const createError = require("http-errors");
const User = require("../models/User.model");
const Refresh = require("../models/Refresh.model");
const { authSchema } = require("../helpers/schema_validation");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt_helper");
const mongoose = require("mongoose");
module.exports = {
    register: async (req, res, next) => {
        console.log(req.body);
        try {
            const result = await authSchema.validateAsync(req.body);
            console.log(result);

            const doesExist = await User.findOne({ email: result.email });
            if (doesExist)
                throw createError.Conflict(`${result.email} already exists`);
            const user = new User(result);
            const savedUser = await user.save();
            const accesstoken = await signAccessToken(savedUser.id);
            const refreshtoken = await signRefreshToken(savedUser.id);
            res.send({ accesstoken, refreshtoken });
        } catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },
    login: async (req, res, next) => {
        console.log(req.body);
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });
            if (!user) throw createError.NotFound("User not found");
            const isValidPassword = await user.isValidPassword(result.password);
            if (!isValidPassword)
                throw createError.Unauthorized("Invalid password");
            const accesstoken = await signAccessToken(user.id);
            const refreshtoken = await signRefreshToken(user.id);
            res.send({ accesstoken, refreshtoken });
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest("Invalid username or password"));
            next(error);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshtoken } = req.body;
            if (!refreshtoken)
                throw createError.BadRequest("Refresh token is required");

            const { userId, jti } = await verifyRefreshToken(refreshtoken);
            const refresh = await Refresh.findOne({ jti });
            if (!refresh)
                throw createError.Unauthorized("Invalid refresh token");
            if (refresh.userId.toHexString() !== userId)
                throw createError.Unauthorized("Invalid refresh token");
            if (refresh.expiresAt < Date.now())
                throw createError.Unauthorized("Refresh token expired");
            if (refresh.blocked)
                throw createError.Unauthorized("Refresh token blocked");
            refresh.blockToken();

            const accesstoken = await signAccessToken(userId);
            const newRefreshtoken = await signRefreshToken(userId);
            res.send({ accesstoken, refreshtoken: newRefreshtoken });
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest("Invalid refresh token"));
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const { refreshtoken } = req.body;
            if (!refreshtoken)
                throw createError.BadRequest("Refresh token is required");

            const { userId, jti } = await verifyRefreshToken(refreshtoken);
            const refresh = await Refresh.findOne({
                jti: new mongoose.Types.ObjectId(jti),
            });
            if (!refresh)
                throw createError.Unauthorized("Invalid refresh token");
            if (refresh.userId.toHexString() !== userId)
                throw createError.Unauthorized("Invalid refresh token");
            User.deleteOne({ userId });
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },
};
