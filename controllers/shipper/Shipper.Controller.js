const createError = require('http-errors');

const Food = require('../../models').Food
const {
    shipperUpdateStatusReqSchema,
} = require('../../helpers/schema_validation');
const Order = require('../../models/Order');

const STATUS = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    PREPARING: "Preparing",
    DELIVERING: "Delivering",
    COMPLETED: "Completed",
    REVIEWED: "Reviewed",
  };
const internalError = createError.InternalServerError()
module.exports = {
    updateStatus: async (req, res, next) => {
        try {
            await shipperUpdateStatusReqSchema.validateAsync(req.params);
            const { aud: userId } = req.payload;
            const { id, status } = req.params;
            const order = await Order.findByPk(id);
            const jsonedOrder = order.toJSON();
            const statusToChange = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            switch(statusToChange) {
                case STATUS.CONFIRMED:
                    if(jsonedOrder.status != STATUS.PENDING){
                        next(createError.BadRequest('you cant confirmed a order not in pending status'))
                    } else {
                        const result = await order.update({
                            status: STATUS.CONFIRMED,
                            shipperId: userId
                        });
                        res.send(result);
                    }
                    break;
                case STATUS.DELIVERING:
                    if(jsonedOrder.status != STATUS.PREPARING){
                        next(createError.BadRequest('you cant deliver a order not in preparing status'))
                    } else {
                        const result = await order.update({
                            status: STATUS.DELIVERING,
                            shipperId: userId
                        });
                        res.send(result);
                    }
                    break;
                default: 
                    next(createError.BadRequest('status not supported'));
                    break;
            }
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },

};
