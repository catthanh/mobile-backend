const createError = require("http-errors");
const { Op } = require("sequelize");
const db = require("../models");
const Restaurant = require("../models").Restaurant;
const Order = require("../models").Order;
const User = require("../models").User;
const OrderFood = require("../models/OrderFood");

const _ = require('lodash');
const internalError = createError.internalError;
const NotiHelper = require("../helpers/notification");
/**
 *
 * Order status {"Pending", "Confirmed", "Cancelled", "Preparing", "Delivering", "Completed", "Reviewed"}
 * trigger notification to restaurant when order status is "Confirmed" or "Cancellled"
 *
 */
let this_ = (module.exports = {
  getRestaurantDetails: async (req, res, next) => {
    try {
      const idRes = req.params.id;

      const res_ = await Restaurant.findOne({
        where: {
          id: idRes,
        },
        include: "Food",
      });
      if (!res_) {
        return next(createError(404, "Restaurant not found"));
      }
      res.send(res_.toJSON());
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  createOrder: async (req, res, next) => {
    try {
      // // validate
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const { idRes, foods } = req.body;

      // {
      //     idRes: 1,
      //     foods: [{idFood: 12876, quantity: 10}];
      // }
      const user = await User.findByPk(idUser);
      if (!user) {
        return next(createError(404, "User not found"));
      }
      const address = user.toJSON().currentAddress;
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
      const grandTotal = total;

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
          discount: 0,
          grandTotal: grandTotal,
          OrderFoods: [...foods],
          address: address,
        },
        {
          include: {
            association: "OrderFoods",
          },
        }
      );

      // res.send(order);
      req.params.id = order.toJSON().id;
      // const notiData = await NotiHelper.getNotiTopic(
      //   {
      //     data: {
      //       id: order.id.toString(),
      //       status: order.status,
      //     },
      //   },
      //   "shipperOrder"
      // );
      // req.notificationData = notiData;
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getOrderDetail: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      // const { idUser } = req.payload;
      const idOrder = req.params.id;
      const order = await Order.findOne({
        where: {
          id: idOrder,
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Voucher,
            as: "voucher_order",
          },
        ],
      });
      if (order.voucher_order === []) {
        order.voucher_order = null;
      } else order.voucher_order = order.voucher_order[0];
      if (!order) {
        return next(createError(404, "Order not found"));
      }
      let order_ = order.toJSON();
      order_.foods = order_.food_order;
      delete order_.food_order;
      order_.foods.forEach((food) => {
        food.quantity = food.OrderFood.quantity;
        delete food.OrderFood;
      });
      order_.voucher = order_.voucher_order[0] || null;
      res.send(_.omit(order_, 'voucher_order'));
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const idOrder = req.params.id;
      const order = await Order.findOne({
        where: {
          id: req.params.id,
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
      foods = order.toJSON().food_order;
      console.log(foods);
      for (let i = 0; i < foods.length; i++) {
        await db.OrderFood.destroy({
          where: {
            idOrder: idOrder,
            idFood: foods[i].id,
          },
        });
      }
      await order.destroy();
      res.send({ message: "Order deleted" });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  confirmOrder: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idOrder = req.params.id;
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
      order.orderedAt = new Date();
      await order.save();
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idOrder = req.params.id;
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
      // const notiData = await NotiHelper.getNotiMultipleDevice(
      //   {
      //     title: "Eat247",
      //     body: `Đơn hàng ${order.id} đã bị hủy `,
      //     data: {
      //       id: order.id,
      //       status: "Cancelled",
      //     },
      //   },
      //   [order.idRes, order.idShipper]
      // );
      // req.notificationData = notiData;
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;

      const idOrder = req.params.id;
      const order = await Order.findOne({
        where: {
          id: idOrder,
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Voucher,
            as: "voucher_order",
          },
        ],
      });
      if (!order) {
        return next(createError(404, "Order not found"));
      }

      if (order.status !== "Pending") {
        return next(createError(400, "Only pending order can be updated"));
      }
      const { idRes, foods } = req.body;
      // {
      //     idRes: 1,
      //     foods: [{idFood: 12876, quantity: 10}];
      // }
      const user = await User.findByPk(idUser);
      if (!user) {
        return next(createError(404, "User not found"));
      }
      const address = user.toJSON().currentAddress;
      let foodIds = foods.map((food) => food.idFood);
      console.log(foods);
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

      let tt = foods.reduce((total, food) => {
        return total + food.price * food.quantity;
      }, 0);

      order.shippingFee = 15000;
      order.tax = 0;
      order.subTotal = tt;
      order.total = tt + order.shippingFee + order.tax;
      order.grandTotal = order.total;
      order.address = address;
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
      if (order.voucher_order && order.voucher_order.length > 0) {
        req.params.idVoucher = order.voucher_order[0]?.id;
        req.params.idOrder = order.id;
        await this_.applyVoucher(req, res, next);
      } else next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getOrderByStatus: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const status = req.body.status;
      const orders = await Order.findAll({
        where: {
          idUser: idUser,
          status: status,
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Restaurant,
          },
        ],
      });
      if (!orders) {
        return next(createError(404, "Order not found"));
      }
      res.send(orders);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getOrderInComing: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const status = req.body.status;
      const orders = await Order.findAll({
        where: {
          idUser: idUser,
          status: {
            [Op.in]: ["Confirmed", "Preparing", "Delivering"],
          },
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Restaurant,
          },
        ],
      });
      if (!orders) {
        return next(createError(404, "Order not found"));
      }
      res.send(orders);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getOrderHistory: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const status = req.body.status;
      const orders = await Order.findAll({
        where: {
          idUser: idUser,
          status: {
            [Op.in]: ["Completed", "Reviewed"],
          },
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Restaurant,
          },
        ],
      });
      if (!orders) {
        return next(createError(404, "Order not found"));
      }
      res.send(orders);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getOrderToReview: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const status = req.body.status;
      const orders = await Order.findAll({
        where: {
          idUser: idUser,
          status: {
            [Op.in]: ["Completed"],
          },
        },
        include: [
          {
            model: db.Food,
            through: db.OrderFood,
            as: "food_order",
          },
          {
            model: db.Restaurant,
          },
        ],
      });
      if (!orders) {
        return next(createError(404, "Order not found"));
      }
      res.send(orders);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  reviewOrder: async (req, res, next) => {
    try {
      // await orderGetReqSchema.validateAsync(req.query);
      const idUser = req.payload.aud;
      const idOrder = req.params.id;
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
      console.log(order);
      if (!order) {
        return next(createError(404, "Order not found"));
      }
      if (order.status !== "Completed") {
        return next(createError(400, "Only completed order can be reviewed"));
      }
      const { rating, description } = req.body;
      const review = await db.Review.create({
        idUser: idUser,
        idRes: order.toJSON().idRes,
        rating: rating,
        description: description,
      });
      console.log(review);
      order.idReview = review.id;
      order.status = "Reviewed";
      await order.save();
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  getApplicableVoucher: async (req, res, next) => {
    try {
      const idUser = req.payload.aud;
      const idRes = req.params.idRes;
      const applicableVoucher = await db.Voucher.findAll({
        where: {
          idRes: {
            [Op.in]: [idRes, "0"],
          },
        },
      });
      res.send(applicableVoucher);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  applyVoucher: async (req, res, next) => {
    try {
      const idUser = req.payload.aud;
      const idVoucher = req.params.idVoucher;
      const idOrder = req.params.idOrder;
      console.log(req.params);
      const voucher = await db.Voucher.findOne({
        where: {
          id: idVoucher,
        },
      });
      if (!voucher) {
        return next(createError(404, "Voucher not found"));
      }
      console.log(voucher);
      const order = await Order.findOne({
        where: {
          id: idOrder,
          status: "Pending",
        },
        include: {
          model: db.Food,
          through: db.OrderFood,
          as: "food_order",
        },
      });
      console.log(order);
      if (!order) {
        return next(createError(404, "Order not found"));
      }
      db.OrderVoucher.findOrCreate({
        where: {
          idOrder: idOrder,
          idVoucher: idVoucher,
        },
      });
      if (voucher.type === "Percentage") {
        order.discount = (order.total * voucher.value) / 100;
      } else {
        order.discount = voucher.value;
      }
      order.grandTotal = order.total - order.discount;
      await order.save();
      req.params.id = idOrder;
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
  removeVoucher: async (req, res, next) => {
    try {
      const idUser = req.payload.aud;
      const idVoucher = req.params.idVoucher;
      const idOrder = req.params.idOrder;
      const voucher = await db.Voucher.findOne({
        where: {
          id: idVoucher,
        },
      });
      if (!voucher) {
        return next(createError(404, "Voucher not found"));
      }
      const order = await Order.findOne({
        where: {
          id: idOrder,
          status: "Pending",
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
      db.OrderVoucher.destroy({
        where: {
          idOrder: idOrder,
          idVoucher: idVoucher,
        },
      });
      order.discount = 0;
      order.grandTotal = order.total;
      await order.save();
      req.params.id = idOrder;
      next();
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(error);
    }
  },
});
