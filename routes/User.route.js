const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");

router.get("/", UserController.get);

router.get("/notification", UserController.getNotification);

router.get("/favourite", UserController.getFavouritesList);

router.get("/profile", UserController.profile);

router.put("/update-info", UserController.updateInfo);

router.put("/update-info/address", UserController.updateAddressInfo);

router.put("/location", UserController.saveCurrentUserLocation);


module.exports = router;
