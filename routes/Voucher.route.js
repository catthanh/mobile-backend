const express = require("express");
const router = express.Router();
const VoucherController = require("../controllers/Voucher.controller");


/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: manages restaurant
 */

/**
 * @swagger
 * /restaurant/Voucher:
 *   get:
 *     tags: [Voucher]
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
router.get("/", VoucherController.get);
/**
 * @swagger
 * /restaurant/Voucher:
 *   post:
 *     tags: [Voucher]
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
router.post("/", VoucherController.add);
/**
 * @swagger
 * /restaurant/Voucher:
 *   delete:
 *     tags: [Voucher]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer    
 *       		
 */
router.delete("/", VoucherController.remove);

module.exports = router;
