const express = require("express");
const router = express.Router();
const FoodController = require("../controllers/Food.controller");


/**
 * @swagger
 * tags:
 *   name: Food
 *   description: manages restaurant
 */

/**
 * @swagger
 * /restaurant/food:
 *   get:
 *     tags: [Food]
 *     parameters:
 *      - in: path
 *        name: idRes
 *        required: false
 *        description: numeric id of a restaurant, if null return all
 *        schema: 
 *          type: integer
 *      - in: path
 *        name: pageNumber
 *        required: false
 *        default: 1
 *        schema: 
 *          type: integer
 *      - in: path
 *        name: pageSize
 *        required: false
 *        default: 100
 *        schema: 
 *          type: integer     
 *       		
 */
 router.get("/", FoodController.get);
router.get("/:id", FoodController.getById);
module.exports = router;
