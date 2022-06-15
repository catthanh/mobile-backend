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

router.get("/restaurant", UserOrderController.getRestaurantDetails);
router.post(
    "/order/",
    UserOrderController.createOrder,
    UserOrderController.getOrderDetail
);
router.put(
    "/order/",
    UserOrderController.updateOrder,
    UserOrderController.getOrderDetail
);
router.put(
    "/order/confirm",
    UserOrderController.confirmOrder,
    UserOrderController.getOrderDetail
);
// router.get("/orders", UserOrderController.getOrderList);
router.get("/order", UserOrderController.getOrderDetail);

module.exports = router;
