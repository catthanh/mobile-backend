const createError = require('http-errors');

const User = require('../../models').User
const Restaurant = require('../../models').Restaurant
const {
    shipperUpdateStatusReqSchema,
    shipperGetReqSchema
} = require('../../helpers/schema_validation');
const Order = require('../../models/Order');
const NotiHelper = require("../../helpers/notification");

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
    getById: async (req, res, next) => {
        try {
            await shipperGetReqSchema.validateAsync(req.params);
            const { id } = req.params;
            const order = await Order.findByPk(id, {
                include: [
                    User,
                    Restaurant
                ]
            })
            if(!order) {
                next(createError.NotFound("order not found"));
            } else {
                res.send(order);
            }
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
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
                        return next(createError.BadRequest('you cant confirmed a order not in pending status'))
                    } else {
                        const result = await Order.update({
                            status: STATUS.CONFIRMED,
                            idShipper: userId
                        }, {
                            where: {
                                id: id,
                                status: STATUS.PENDING
                            }
                        });
                        if(result) {
                            const newOrder = Order.findByPk(id, {
                                include: [
                                    User,
                                    'food_order'
                                ]
                            })
                            NotiHelper.sendToTopic({
                                data: {
                                    id: id,
                                    status: result.status
                                }
                            }, "shipperOrder")
                            res.send(newOrder);
                        }else {
                            return next(createError.NotFound('order is not available for update status'));
                        }
                    }
                case STATUS.DELIVERING:
                    if(jsonedOrder.status != STATUS.PREPARING){
                        return next(createError.BadRequest('you cant deliver a order not in preparing status'))
                    } else if(jsonedOrder.idShipper === userId) {
                        const result = await order.update({
                            status: STATUS.DELIVERING,
                        });
                        if(result) {
                            NotiHelper.sendToUser({
                                body: "Chờ chút shipper tới liền",
                                data: {
                                    id: id,
                                    status: result.status
                                }
                            }, order.User.id)
                            res.send(order);
                        }else {
                            return next(createError.NotFound('order is not available for update status'));
                        }
                    } else {
                        return next(createError.BadRequest('you must be shipper of this order to update status'))
                    }
                default: 
                    return next(createError.BadRequest('status not supported'));
            }
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },

};