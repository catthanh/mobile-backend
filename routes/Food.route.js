const express = require("express");
const router = express.Router();
const FoodController = require("../controllers/Food.controller");

router.get("/", FoodController.get);
router.post("/", FoodController.add);
router.put("/", FoodController.modify);
router.delete("/", FoodController.remove);

module.exports = router;
