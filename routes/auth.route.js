const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User management and login
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login to the application
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 example: tesdsssst
 *               password:
 *                 type: string
 *                 required: true
 *                 example: fdsfadfst
 *     responses:
 *       200:
 *         description: login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accesstoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1MTIwMzI1NSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSJ9.dh6QpESKklLY2qU5SX2G7_n5WWx-CaYAAvP9cSbEEj0
 *                 refreshtoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1Mzc5NTIyNSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSIsImp0aSI6IjU3ZDk5NzljLWFjNTQtNGEzYS1iNDQ2LTgyNjY5MzZjODhjNCJ9.0hbH1rNBqXMP6MrsRLPZIgdBwJCboP-Vu2wMDK3m2UM
 *       400:
 *         description: failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   example: Invalid username or password
 *                   type: string
 *       401:
 *         description: failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   example: Invalid username or password
 *                   type: string
 */
router.post("/login/", AuthController.login);
router.post("/login/:role", AuthController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 example: tesdsss23st
 *               password:
 *                 type: string
 *                 required: true
 *                 example: fdsfadfst
 *               name:
 *                 type: string
 *                 required: true
 *                 example: test ik
 *     responses:
 *       200:
 *         description: register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accesstoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1MTIwMzI1NSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSJ9.dh6QpESKklLY2qU5SX2G7_n5WWx-CaYAAvP9cSbEEj0
 *                 refreshtoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1Mzc5NTIyNSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSIsImp0aSI6IjU3ZDk5NzljLWFjNTQtNGEzYS1iNDQ2LTgyNjY5MzZjODhjNCJ9.0hbH1rNBqXMP6MrsRLPZIgdBwJCboP-Vu2wMDK3m2UM
 *       409:
 *         description: failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   example: User already exists
 *                   type: string
 *       422:
 *         description: failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   example: "\"password\" length must be at least 6 characters long"
 *                   type: string
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     description: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshtoken:
 *                 type: string
 *                 required: true
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTAzNzQ4NTYsImV4cCI6MTY1Mjk2Njg1NiwiYXVkIjoiMSIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSIsImp0aSI6ImZhN2VlZmQ2LWQwZjMtNDMzZi04MzkzLWY1YjRjZTAwNzc0NCJ9.W0Fy3z-NY46ISJMAKQBTebN_0_z5Hwn-gkDuHu1luoQ
 *     responses:
 *       200:
 *         description: refresh token successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accesstoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1MTIwMzI1NSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSJ9.dh6QpESKklLY2qU5SX2G7_n5WWx-CaYAAvP9cSbEEj0
 *                 refreshtoken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTEyMDMyMjUsImV4cCI6MTY1Mzc5NTIyNSwiYXVkIjoiMjA3NyIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSIsImp0aSI6IjU3ZDk5NzljLWFjNTQtNGEzYS1iNDQ2LTgyNjY5MzZjODhjNCJ9.0hbH1rNBqXMP6MrsRLPZIgdBwJCboP-Vu2wMDK3m2UM
 *       401:
 *         description: failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   example: Refresh token blocked
 *                   type: string
 */
router.post("/refresh-token", AuthController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     description: Delete access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshtoken:
 *                 type: string
 *                 required: true
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTAzNzQ4NTYsImV4cCI6MTY1Mjk2Njg1NiwiYXVkIjoiMSIsImlzcyI6ImNhdHRoYW5oIGRlcCB0cmFpIHZvIGRvaSIsImp0aSI6ImZhN2VlZmQ2LWQwZjMtNDMzZi04MzkzLWY1YjRjZTAwNzc0NCJ9.W0Fy3z-NY46ISJMAKQBTebN_0_z5Hwn-gkDuHu1luoQ
 *     responses:
 *       204:
 *         description:
 *         content:
 *
 */
router.post("/logout", AuthController.logout);

module.exports = router;
