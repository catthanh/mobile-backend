const createError = require("http-errors");

const Order = require("../../models").Order;
const {
  orderUpdateStatusReqSchema
} = require("../../helpers/schema_validation");
const User = require("../../models/User");

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
      const { restaurant } = req.payload;
      const { id, status } = req.query;
      if(id) {
        const order = await Order.findByPk(id, {
          include: User
        });
        res.send(order);
      } else if (status) {
        const statusToChange = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        const orders = await Order.findAndCountAll({
          where: {
            idRes: restaurant.id,
            status: statusToChange
          },
          include: User,
          order: [['createdAt', 'DESC']]
        });
        res.send(orders || []);
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
      });
      if (!order) {
        next(createError.BadRequest("order not found"));
      }
      if (order?.status === STATUS.CANCELLED) {
        next(createError.BadRequest("can't update a cancelled order"));
      }
      switch (statusToChange) {
        case STATUS.CONFIRMED:
          if (order?.status === STATUS.PENDING) {
            await order.update({
              status: STATUS.CONFIRMED,
            });
          } else {
            next(
              createError.BadRequest(
                "order must be pending before switch to confirmed"
              )
            );
          }
          break;
        case STATUS.PREPARING:
          if (order?.status === STATUS.CONFIRMED) {
            await order.update({
              status: STATUS.PREPARING,
            });
          } else {
            next(
              createError.BadRequest(
                "you must confirm order before switch to preparing step"
              )
            );
          }
          break;
        case STATUS.DELIVERING:
          if (order?.status === STATUS.PREPARING) {
            await order.update({
              status: STATUS.DELIVERING,
            });
          } else {
            next(
              createError.BadRequest(
                "you must complete preparing order before switch to delivering step"
              )
            );
          }
          break;
        default:
          next(createError.BadRequest("status not supported"));
      }
      res.send(order);
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
};
