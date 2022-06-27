const createError = require('http-errors');

const User = require('../../models').User
const Restaurant = require('../../models').Restaurant
const {
    shipperUpdateStatusReqSchema,
    shipperGetReqSchema
} = require('../../helpers/schema_validation');
const Order = require('../../models/Order');
const NotiHelper = require("../../helpers/notification");
const _ = require('lodash');

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
    getMyOrder: async (req, res, next) => {
        try {
            const { aud: userId } = req.payload;
            const orders = await Order.findAndCountAll({
                where: {
                    idShipper: null,
                    status: STATUS.CONFIRMED
                },
                include: ["food_order", User, Restaurant],
            })
            const orderItems = orders.rows.map(order => {
                return {
                    id: order.id,
                    address: order.Restaurant.address,
                    orderedAt: order.orderedAt,
                    userName: order.User.name.split(' ')[0],
                    restaurantName: order.Restaurant.name,
                    status: order.status,
                    grandTotal: order.grandTotal,
                    restaurantLat: Restaurant.latitude,
                    restaurantLong: Restaurant.longtitude,
                }
            })
            res.send(orderItems || []);
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
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
            const order = await Order.findByPk(id, {
                include: User
            });
            const statusToChange = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            switch(statusToChange) {
                case STATUS.PREPARING:
                    if(order.status != STATUS.CONFIRMED){
                        return next(createError.BadRequest('you cant prepare a order not in confirmed status'))
                    } else {
                        const result = await Order.update({
                            status: STATUS.PREPARING,
                            idShipper: userId
                        }, {
                            where: {
                                id: id,
                                status: STATUS.CONFIRMED
                            }
                        });
                        if(result) {
                            const newOrder = await Order.findByPk(id, {
                                include: [
                                    User,
                                    'food_order',
                                    Restaurant
                                ]
                            })
                            const jsonedOrder = newOrder.toJSON();
                            
                            const food_order = jsonedOrder.food_order.map(food => {
                                const { quantity } = food.OrderFood;
                                return {quantity: quantity, ..._.omit(food, 'OrderFood')}
                            })
                            jsonedOrder.food_order = food_order;
                            NotiHelper.sendToTopic({
                                data: {
                                    id: id,
                                    status: jsonedOrder.status
                                }
                            }, "shipperOrder")
                            NotiHelper.sendToUser({
                                body: `Đơn hàng ${order.id} đã được xác nhận`,
                                data: {
                                    id: id,
                                    status: jsonedOrder.status
                                }
                            }, order.idRes)
                            return res.send(jsonedOrder);
                        }else {
                            return next(createError.NotFound('order is not available for update status'));
                        }
                    }
                case STATUS.DELIVERING:
                    if(order.status != STATUS.PREPARING){
                        return next(createError.BadRequest('you cant deliver a order not in preparing status'))
                    } else if(order.idShipper.toString() === userId) {
                        const result = await order.update({
                            status: STATUS.DELIVERING,
                        });
                        if(result) {
                            NotiHelper.sendToUser({
                                body: "Chờ chút shipper tới liền",
                                data: {
                                    id: result.id,
                                    status: result.status
                                }
                            }, order.User.id);
                            return res.send(order);
                        }else {
                            return next(createError.NotFound('order is not available for update status'));
                        }
                    } else {
                        return next(createError.BadRequest('you must be shipper of this order to update status'))
                    }
                case STATUS.COMPLETED:
                    if(order.status != STATUS.DELIVERING){
                        return next(createError.BadRequest('you cant complete a order not in delivering status'))
                    } else if(order.idShipper.toString() === userId) {
                        const result = await order.update({
                            status: STATUS.COMPLETED,
                        });
                        if(result) {
                            NotiHelper.sendToUser({
                                body: "Tài xế đã giao tới rồi",
                                data: {
                                    id: id,
                                    status: result.status
                                }
                            }, order.User.id)
                            return res.send(order);
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