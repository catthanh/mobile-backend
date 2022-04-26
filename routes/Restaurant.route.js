const express = require("express");
const router = express.Router();
const RestaurantController = require("../controllers/Restaurant.controller");
const FoodRoute = require("../routes/Food.route");

router.get("/", RestaurantController.get);
router.post("/", RestaurantController.add);
router.put("/", RestaurantController.modify);
router.delete("/", RestaurantController.remove);

router.use('/food', FoodRoute)

module.exports = router;
