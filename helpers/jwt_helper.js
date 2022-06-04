const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const CreateError = require("http-errors");
const Refresh = require("../models").Refresh;

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};

            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
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
    signRefreshToken: (userId, previousToken) => {
        return new Promise((resolve, reject) => {
            console.log(userId);
            const payload = {};
            const jti = uuidv4();
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                jwtid: jti,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
                issuer: "catthanh dep trai vo doi",
                audience: userId,
            };

            const token = jwt.sign(payload, secret, options);

            const refresh = Refresh.create({
                jti,
                token,
                userId: userId,
                previousToken,
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            }).then((refresh) => {
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
                const jti = payload.jti;
                resolve({ userId, jti });
            });
        });
    },
};
