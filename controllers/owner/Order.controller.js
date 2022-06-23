const createError = require("http-errors");

const Order = require("../../models").Order;
const {
  orderGetReqSchema,
} = require("../../helpers/schema_validation");

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
      const orders = await Order.findAndCountAll({
        where: {
          idRes: restaurant.id,
        },
      });
      res.send(orders || []);
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  getDetail: async (req, res, next) => {
    try {
      await orderGetReqSchema.validateAsync(req.params);
      const { id } = req.params;
      const order = await Order.findByPK(id);
      res.send(order);
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  confirmOrder: async (req, res, next) => {
    req.payload = {
      ...req.payload,
      statusToChange: STATUS.CONFIRMED,
    };
    updateStatus(req, res, next);
  },
  prepareOrder: async (req, res, next) => {
    req.payload = {
      ...req.payload,
      statusToChange: STATUS.PREPARING,
    };
    updateStatus(req, res, next);
  },
  deliverOrder: async (req, res, next) => {
    req.payload = {
      ...req.payload,
      statusToChange: STATUS.DELIVERING,
    };
    updateStatus(req, res, next);
  },
  updateStatus: async (req, res, next) => {
    try {
      await orderGetReqSchema.validateAsync(req.params);
      const { id } = req.params;
      const { restaurant, statusToChange } = req.payload;

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
