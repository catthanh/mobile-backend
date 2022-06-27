const express = require("express");
const router = express.Router();

const ShipperController = require('../controllers/shipper/Shipper.Controller');
router.put('/order/:id/:status', ShipperController.updateStatus);
router.get('/order/:id', ShipperController.getById);
router.get('/order/', ShipperController.getMyOrder);
module.exports = router;
