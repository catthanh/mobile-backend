const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const CreateError = require("http-errors");
const Refresh = require("../models/Refresh.model");

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};

            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1d",
                issuer: "catthanh dep trai vo doi",
                audience: userId,
            };
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err);
                    reject(CreateError.InternalServerError());
                }
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers.authorization) {
            return next(CreateError.Unauthorized());
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === "TokenExpiredError"
                        ? "Token expired"
                        : "Invalid token";
                return next(CreateError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const jti = new mongoose.Types.ObjectId().toHexString();
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                jwtid: jti,
                expiresIn: "1y",
                issuer: "catthanh dep trai vo doi",
                audience: userId,
            };

            const token = jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err);
                    reject(CreateError.InternalServerError());
                }
                resolve(token);
            });
        });
    },
    verifyRefreshToken: (refreshtoken) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET;
            jwt.verify(refreshtoken, secret, (err, payload) => {
                if (err) {
                    return reject(CreateError.Unauthorized());
                }
                const userId = payload.aud;
                resolve(userId);
            });
        });
    },
};
