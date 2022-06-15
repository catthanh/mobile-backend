const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/Restaurant.controller');
const { restaurantOwner } = require('../helpers/permission');
const FoodRoute = require('./Food.route');
const CategoryRoute = require('./Category.route');
const VoucherRoute = require('./Voucher.route');
const { route } = require('./User.route');
/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: manages restaurant
 */

/**
 * @swagger
 * /restaurant:
 *   get:
 *     tags: [Restaurant]
 *     parameters:
 *      - in: path
 *        name: id
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
 *     responses:
 *       200:
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            id:
 *             type: integer
 *            name:
 *             type: string
 *            address:
 *             type: string
 *
 */
router.get('/', RestaurantController.get);
/**
 * @swagger
 * /restaurant:
 *   post:
 *     tags: [Restaurant]
 *     parameters:
 *      - in: body
 *        name: name
 *        required: true
 *        schema:
 *          type: string
 *      - in: body
 *        name: address
 *        required: true
 *        schema:
 *          type: string
 *
 */
router.post('/', RestaurantController.add);
/**
 * @swagger
 * /restaurant:
 *   put:
 *     tags: [Restaurant]
 *     parameters:
 *      - in: body
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *      - in: body
 *        name: name
 *        required: false
 *        schema:
 *          type: string
 *      - in: body
 *        name: address
 *        required: false
 *        schema:
 *          type: string
 *
 */
router.put('/', restaurantOwner, RestaurantController.modify);
/**
 * @swagger
 * /restaurant:
 *   delete:
 *     tags: [Restaurant]
 *     parameters:
 *      - in: body
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *
 */
router.delete('/', restaurantOwner, RestaurantController.remove);

router.get('/:id/details', RestaurantController.getResDetails);

router.use('/food', FoodRoute);
router.use('/category', CategoryRoute);
router.use('/voucher', VoucherRoute);
module.exports = router;
