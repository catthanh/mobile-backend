const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category.controller")
router.get("/", CategoryController.get)
router.post("/", CategoryController.add)

router.get("/popular", CategoryController.getPopularCategory);

module.exports = router;