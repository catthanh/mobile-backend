const express = require("express");
const router = express.Router();

const HpController = require("../controllers/HomePage.controller");
const RestaurantController = require("../controllers/Restaurant.controller");

router.post("/search", HpController.search);
router.get("/restaurants", RestaurantController.getFilteredRestaurants);

module.exports = router;
