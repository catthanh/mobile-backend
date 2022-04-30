const createError = require("http-errors");
const User = require("../models").User;
const Refresh = require("../models/").Refresh;
const { authSchema, logInSchema } = require("../helpers/schema_validation");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt_helper");
module.exports = {
    register: async (req, res, next) => {
        console.log(req.body);
        try {
            const result = await authSchema.validateAsync(req.body);
            console.log(result);

            const doesExist = await User.findOne({
                where: { username: result.username },
            });
            if (doesExist)
                throw createError.Conflict(`${result.username} already exists`);
            const user = await User.create(result);
            const userId = "" + user.toJSON().id;
            console.log(userId);
            const accesstoken = await signAccessToken(userId);
            const refreshtoken = await signRefreshToken(userId, null);
            res.send({ accesstoken, refreshtoken });
        } catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },
    login: async (req, res, next) => {
        console.log(req.body);
        try {
            const result = await logInSchema.validateAsync(req.body);
            const user = await User.findOne({
                where: { username: result.username },
            });
            if (!user) throw createError.NotFound("User not found");
            const isValidPassword = await user.isValidPassword(result.password);
            if (!isValidPassword)
                throw createError.Unauthorized("Invalid password");
            const userId = "" + user.toJSON().id;
            const accesstoken = await signAccessToken(userId);
            const refreshtoken = await signRefreshToken(userId);
            res.send({ accesstoken, refreshtoken });
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest("Invalid username or password"));
            next(error);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const oldRefreshToken = req.body.refreshtoken;
            if (!oldRefreshToken)
                throw createError.BadRequest("Refresh token is required");

            const { userId, jti } = await verifyRefreshToken(oldRefreshToken);

            const refresh = await Refresh.findOne({ where: { jti } });
            console.log(refresh);
            if (!refresh)
                throw createError.Unauthorized("Invalid refresh token");
            if (refresh.expiresAt < Date.now())
                throw createError.Unauthorized("Refresh token expired");
            if (refresh.blocked)
                throw createError.Unauthorized("Refresh token blocked");
            refresh.blockToken();

            const accesstoken = await signAccessToken(userId);
            const newRefreshtoken = await signRefreshToken(
                userId,
                oldRefreshToken
            );
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
                jti: jti,
            });
            if (!refresh)
                throw createError.Unauthorized("Invalid refresh token");
            Refresh.destroy({ where: { jti } });
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },
};
