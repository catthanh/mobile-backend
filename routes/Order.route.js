const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");

router.get("/", OrderController.get);
router.get("/detail", OrderController.getDetail);

router.put("/shipping", OrderController.toShipping);
router.put("/preparing", OrderController.toPreparing);
router.post("/", OrderController.add);

router.delete("/", OrderController.remove);

module.exports = router;
