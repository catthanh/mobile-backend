const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");

router.get("/notification", UserController.getNotification);
router.get("/favourite", UserController.getFavouritesList);

router.get("/profile", UserController.profile);
router.put("/updateInfo", UserController.updateInfo);

module.exports = router;
