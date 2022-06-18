const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");
const UserOrderController = require("../controllers/UserOrder.controller");

router.get("/", UserController.get);

router.get("/notification", UserController.getNotification);

router.get("/favourite", UserController.getFavouritesList);

router.get("/profile", UserController.profile);

router.put("/update-info", UserController.updateInfo);

router.put("/update-info/address", UserController.updateAddressInfo);

router.put("/location", UserController.saveCurrentUserLocation);

router.get("/search/history", UserController.getSearchHistory);

router.get("/foodbyrestaurant/:id", UserOrderController.getRestaurantDetails);
router.post(
  "/order/",
  UserOrderController.createOrder,
  UserOrderController.getOrderDetail
);
router.put(
  "/order/:id",
  UserOrderController.updateOrder,
  UserOrderController.getOrderDetail
);
router.delete("/order/:id", UserOrderController.deleteOrder);
router.put(
  "/order/confirm/:id",
  UserOrderController.confirmOrder,
  UserOrderController.getOrderDetail
);
router.put(
  "/order/cancel/:id",
  UserOrderController.cancelOrder,
  UserOrderController.getOrderDetail
);
router.get("/orders", UserOrderController.getOrderByStatus);
router.get("/orders/incoming", UserOrderController.getOrderInComing);
router.get("/orders/history", UserOrderController.getOrderHistory);
router.get("/orders/toreview", UserOrderController.getOrderToReview);
router.get("/order/:id", UserOrderController.getOrderDetail);
router.post(
  "/order/review/:id",
  UserOrderController.reviewOrder,
  UserOrderController.getOrderDetail
);

module.exports = router;
