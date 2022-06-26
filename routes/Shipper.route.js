const express = require("express");
const router = express.Router();

const ShipperController = require('../controllers/shipper/Shipper.Controller');
router.put('/order/:id/:status', ShipperController.updateStatus);
module.exports = router;
