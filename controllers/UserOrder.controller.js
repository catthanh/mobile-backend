const createError = require("http-errors");
const { Op } = require("sequelize");
const db = require("../models");
const Restaurant = require("../models").Restaurant;
const Order = require("../models").Order;
const User = require("../models").User;
const {
    orderAddReqSchema,
    orderRemoveReqSchema,
    orderGetReqSchema,
} = require("../helpers/schema_validation");
const OrderFood = require("../models/OrderFood");

const internalError = createError.internalError;

/**
 *
 * Order status {"Pending", "Confirmed", "Cancelled", "Preparing", "Delivering", "Completed"}
 */
module.exports = {
    getRestaurantDetails: async (req, res, next) => {
        try {
            const { idRes } = req.body;

            const res_ = await Restaurant.findOne({
                where: 1,
                include: "Food",
            });
            if (!res_) {
                return next(createError(404, "Restaurant not found"));
            }
            res.send(res_.toJSON());
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    createOrder: async (req, res, next) => {
        try {
            // // validate
            // await orderGetReqSchema.validateAsync(req.query);
            const idUser = req.payload.aud;

            const { idRes, foods, discount } = req.body;
            // {
            //     idRes: 1,
            //     foods: [{idFood: 12876, quantity: 10}];
            // }
            let foodIds = foods.map((food) => food.idFood);
            let t = await db.Food.findAll({
                where: {
                    id: {
                        [Op.in]: foodIds,
                    },
                },
            });
            for (let i = 0; i < t.length; i++) {
                foods[i].price = t[i].price;
            }
            console.log(foods);

            let tt = foods.reduce((total, food) => {
                return total + food.price * food.quantity;
            }, 0);

            const shippingFee = 15000;
            const tax = 0;
            const subTotal = tt;
            const total = tt + shippingFee + tax;
            const grandTotal = total - discount * total;

            const order = await db.Order.create(
                {
                    idUser: idUser,
                    idRes: idRes,
                    status: "Pending",
                    description: "test",
                    shippingFee: shippingFee,
                    tax: 0,
                    subTotal: subTotal,
                    total: tt + shippingFee,
                    discount: discount,
                    grandTotal: grandTotal,
                    OrderFoods: [
                        {
                            idFood: 12876,
                            quantity: 1,
                        },
                        {
                            idFood: 12877,
                            quantity: 2,
                        },
                    ],
                },
                {
                    include: {
                        association: "OrderFoods",
                    },
                }
            );

            // res.send(order);
            req.body.idOrder = order.toJSON().id;

            next();
            // const order_ = await db.Order.findOne({
            //     where: { id: 24 },
            //     include: {
            //         model: db.Food,
            //         through: db.OrderFood,
            //         as: "food_order",
            //     },
            // })
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    // getOrderList: async (req, res, next) => {
    //     try {
    //         // await orderGetReqSchema.validateAsync(req.query);
    //         const { idUser, orderStatus } = req.payload;
    //         const orders = await Order.findAll({
    //             where: {
    //                 idUser,
    //                 status: orderStatus,
    //             },
    //             include: "Food",
    //         });
    //     } catch (error) {
    //         if (error.isJoi === true) next(createError.BadRequest());
    //         next(internalError);
    //     }
    // },
    // addReview: async (req, res, next) => {
    //     try {
    //         //await orderGetReqSchema.validateAsync(req.query);
    //         const { idUser } = req.payload;
    //     } catch (error) {
    //         if (error.isJoi === true) next(createError.BadRequest());
    //         next(internalError);
    //     }
    // },
    getOrderDetail: async (req, res, next) => {
        try {
            // await orderGetReqSchema.validateAsync(req.query);
            // const { idUser } = req.payload;
            const { idOrder } = req.body;

            const order = await Order.findOne({
                where: {
                    id: idOrder,
                },
                include: {
                    model: db.Food,
                    through: db.OrderFood,
                    as: "food_order",
                },
            });
            let order_ = order.toJSON();
            order_.foods = order_.food_order;
            delete order_.food_order;
            order_.foods.forEach((food) => {
                food.quantity = food.OrderFood.quantity;
                delete food.OrderFood;
            });
            res.send(order_);
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    /**
     * TODO:
     * trigger notification to restaurant
     */
    confirmOrder: async (req, res, next) => {
        try {
            // await orderGetReqSchema.validateAsync(req.query);
            const { idOrder } = req.body;
            const order = await Order.findOne({
                where: {
                    id: idOrder,
                },
                include: {
                    model: db.Food,
                    through: db.OrderFood,
                    as: "food_order",
                },
            });
            if (!order) {
                return next(createError(404, "Order not found"));
            }
            order.status = "Confirmed";
            await order.save();
            next();
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    cancelOrder: async (req, res, next) => {
        try {
            // await orderGetReqSchema.validateAsync(req.query);
            const { idOrder } = req.body;
            const order = await Order.findOne({
                where: {
                    id: idOrder,
                },
                include: {
                    model: db.Food,
                    through: db.OrderFood,
                    as: "food_order",
                },
            });
            if (!order) {
                return next(createError(404, "Order not found"));
            }
            order.status = "Cancelled";
            await order.save();
            next();
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    updateOrder: async (req, res, next) => {
        try {
            // await orderGetReqSchema.validateAsync(req.query);
            const idUser = req.payload.aud;

            const order = await Order.findOne({
                where: {
                    id: req.body.idOrder,
                },
                include: {
                    model: db.Food,
                    through: db.OrderFood,
                    as: "food_order",
                },
            });
            if (order.status !== "Pending") {
                return next(
                    createError(400, "Only pending order can be updated")
                );
            }
            if (!order) {
                return next(createError(404, "Order not found"));
            }
            const { idRes, foods, discount } = req.body;
            // {
            //     idRes: 1,
            //     foods: [{idFood: 12876, quantity: 10}];
            // }
            let foodIds = foods.map((food) => food.idFood);
            let t = await db.Food.findAll({
                where: {
                    id: {
                        [Op.in]: foodIds,
                    },
                },
            });
            for (let i = 0; i < t.length; i++) {
                foods[i].price = t[i].price;
            }
            console.log(foods);

            let tt = foods.reduce((total, food) => {
                return total + food.price * food.quantity;
            }, 0);

            order.shippingFee = 15000;
            order.tax = 0;
            order.subTotal = tt;
            order.total = tt + order.shippingFee + order.tax;
            order.grandTotal = order.total - discount * order.total;
            for (let i = 0; i < foods.length; i++) {
                await db.OrderFood.update(
                    {
                        quantity: foods[i].quantity,
                    },
                    {
                        where: {
                            idOrder: order.id,
                            idFood: foods[i].idFood,
                        },
                    }
                );
            }
            await order.save();
            next();
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
};
