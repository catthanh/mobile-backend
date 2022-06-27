const express = require("express");
const router = express.Router();
const MediaController = require("../controllers/Media.controller")

router.get("/presigned-url", MediaController.getPresignedUrl)

module.exports = router;