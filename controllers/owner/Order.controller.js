const e = require("express");
const createError = require("http-errors");
const _ = require('lodash');
const Order = require("../../models").Order;
const {
  orderUpdateStatusReqSchema
} = require("../../helpers/schema_validation");
const Food = require("../../models/Food");
const User = require("../../models/User");
const NotiHelper = require("../../helpers/notification");

const internalError = createError.internalError;
const STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  PREPARING: "Preparing",
  DELIVERING: "Delivering",
  COMPLETED: "Completed",
  REVIEWED: "Reviewed",
};
module.exports = {
  get: async (req, res, next) => {
    try {
      const { aud: userId, restaurant } = req.payload;
      const { id, status } = req.query;
      if(id) {
        const order = await Order.findByPk(id, {
          include: [
            User,
            'food_order',
            'voucher_order'
          ]
        });
        const { food_order, voucher_order, ...rest } = order.toJSON();
        const foods = food_order.map((e) => {
          const { quantity } = e.OrderFood;
          return _.assign(_.omit(e, ['OrderFood']), {quantity});
        })
        const vouchers = voucher_order.map((e) => {
          return _.omit(e, ['OrderVoucher']);
        })
        res.send({...rest, foods, vouchers});
      } else if (status) {
        let statusToGet;
        if(typeof status === 'string') {
          statusToGet = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        } else if( typeof status === 'object') {
          statusToGet = status.map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
        }
        const result = await Order.findAndCountAll({
          where: {
            idRes: restaurant.id,
            status: statusToGet
          },
          include: User,
          order: [['createdAt', 'DESC']]
        });
        res.send(result);
      } else {
        const orders = await Order.findAndCountAll({
          where: {
            idRes: restaurant.id,
          },
          include: User,
          order: [['createdAt', 'DESC']]
        });
        res.send(orders || []);
      }
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      await orderUpdateStatusReqSchema.validateAsync(req.params);
      const { id, status } = req.params;
      const { restaurant } = req.payload;
      const statusToChange = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      const order = await Order.findOne({
        where: {
          id: id,
          idRes: restaurant.id,
        },
        include: User
      });
      if (!order) {
        next(createError.BadRequest("order not found"));
      }
      if (order?.status === STATUS.CANCELLED) {
        next(createError.BadRequest("can't update a cancelled order"));
      }
      switch (statusToChange) {
        // case STATUS.CONFIRMED:
        //   if (order?.status === STATUS.PENDING) {
        //     await order.update({
        //       status: STATUS.CONFIRMED,
        //     });
        //   } else {
        //     return next(
        //       createError.BadRequest(
        //         "order must be pending before switch to confirmed"
        //       )
        //     );
        //   }
        //   break;
        case STATUS.PREPARING:
          if (order?.status === STATUS.CONFIRMED) {
            await order.update({
              status: STATUS.PREPARING,
            });
            // NotiHelper.sendToUser({
            //   body: "Món ăn nóng hổi, vừa ăn vừa thổi sắp xong rồi đâyyy",
            //   data: {
            //     id: order.id,
            //     status: order.status
            //   }
            // }, order.User.id);
          } else {
            return next(
              createError.BadRequest(
                "you must confirm order before switch to preparing step"
              )
            );
          }
          break;
        // case STATUS.DELIVERING:
        //   if (order?.status === STATUS.PREPARING) {
        //     await order.update({
        //       status: STATUS.DELIVERING,
        //     });
        //   } else {
        //     return next(
        //       createError.BadRequest(
        //         "you must complete preparing order before switch to delivering step"
        //       )
        //     );
        //   }
        //   break;
        default:
          return next(createError.BadRequest("status not supported"));
      }
      res.send(order);
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
};
