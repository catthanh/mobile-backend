const express = require("express");
const router = express.Router();
const FoodController = require("../controllers/Food.controller");
const { restaurantOwner, foodOfRestaurant } = require("../helpers/permission");


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
/**
 * @swagger
 * /restaurant/food:
 *   post:
 *     tags: [Food]
 *     parameters:
 *      - in: path
 *        name: idRes
 *        required: true
 *        schema: 
 *          type: integer
 *      - in: path
 *        name: name
 *        required: true
 *        schema: 
 *          type: string
 *      - in: path
 *        name: price
 *        required: true
 *        schema: 
 *          type: integer     
 *       		
 */
router.post("/", FoodController.add);
/**
 * @swagger
 * /restaurant/food:
 *   put:
 *     tags: [Food]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *      - in: path
 *        name: name
 *        required: true
 *        schema: 
 *          type: string
 *      - in: path
 *        name: price
 *        required: true
 *        schema: 
 *          type: integer     
 *       		
 */
router.put("/", restaurantOwner, foodOfRestaurant, FoodController.modify);
/**
 * @swagger
 * /restaurant/food:
 *   delete:
 *     tags: [Food]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer    
 *       		
 */
router.delete("/", restaurantOwner, foodOfRestaurant, FoodController.remove);

module.exports = router;
