const express = require("express");
const router = express.Router();

const RestaurantController = require("../controllers/owner/Restaurant.controller");
const VoucherController = require("../controllers/owner/Voucher.controller");
const FoodController = require("../controllers/owner/Food.controller");
const { extractRestaurantId } = require("../helpers/permission");

router.get("/restaurant", extractRestaurantId, RestaurantController.get);
router.post("/restaurant", extractRestaurantId, RestaurantController.add);
router.put("/restaurant", extractRestaurantId, RestaurantController.modify);
router.get("/restaurant/review", extractRestaurantId, RestaurantController.getResReviews);

router.get("/food", extractRestaurantId, FoodController.get);
router.post("/food", extractRestaurantId, FoodController.add);
router.put("/food", extractRestaurantId, FoodController.modify);
router.get("/food/:id", extractRestaurantId, FoodController.getById);
router.delete("/food/:id", extractRestaurantId, FoodController.delete);

router.get("/voucher", extractRestaurantId, VoucherController.get);
router.get("/voucher/:id", extractRestaurantId, VoucherController.getById);
router.post("/voucher", extractRestaurantId, VoucherController.add);
router.delete("/voucher/:id", extractRestaurantId, VoucherController.delete);

// router.get("/restaurant", extractRestaurantId, RestaurantController.get);
// router.post("/restaurant", extractRestaurantId, RestaurantController.add);
// router.put("/restaurant", extractRestaurantId, RestaurantController.modify);
// router.get("/restaurant/review", extractRestaurantId, RestaurantController.getResReviews);

module.exports = router;
