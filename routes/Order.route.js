const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");
const { restaurantOwner } = require("../helpers/permission");

router.get("/", restaurantOwner, OrderController.get);
router.get("/detail", restaurantOwner, OrderController.getDetail);

router.put("/to-shipping", restaurantOwner, OrderController.toShipping);
router.put("/to-preparing", restaurantOwner, OrderController.toPreparing);
// router.post("/", OrderController.add);

// router.delete("/", OrderController.remove);

module.exports = router;
