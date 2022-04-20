const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("./helpers/jwt_helper");
const AuthController = require("../controllers/Res.controller");

router.post("/dosomething", verifyAccessToken, ResController.dosomething);

module.exports = router;
