const createError = require("http-errors");
const User = require("../models").User;
const Refresh = require("../models").Refresh;
const { authSchema, logInSchema } = require("../helpers/schema_validation");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const db = require("../models");
const Role = require("../models").Role;
module.exports = {
  register: async (req, res, next) => {
    console.log(req.body);
    try {
      const result = await authSchema.validateAsync(req.body);
      if (!req.body.role) {
        req.body.role = "user";
      }
      console.log(result);

      const doesExist = await User.findOne({
        where: { username: result.username },
      });

      const Role = await db.Role.findOne({
        where: {
          name: result.role,
        },
      }); //.toJSON().id;
      const idRole = Role.toJSON().id;
      delete result.role;

      if (doesExist)
        throw createError.Conflict(`${result.username} already exists`);
      const user = await User.create(result);
      const userId = "" + user.toJSON().id;
      const userRole = await db.UserRole.create({
        idUser: user.toJSON().id,
        idRole: idRole,
      });

      res.send({
        success: {
          message: "User created successfully",
          status: 200,
        },
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  login: async (req, res, next) => {
    console.log(req.body);
    try {
      let role = req.params.role;
      if (!role) role = "user";
      console.log(role);
      if (role !== "shipper" && role !== "user" && role !== "resOwner") {
        throw createError.BadRequest(`${role} is not a valid role`);
      }
      const result = await logInSchema.validateAsync(req.body);
      const user = await User.findOne({
        where: { username: result.username },
        include: {
          model: Role,
          as: "role_user",
        },
      });

      if (!user) throw createError.NotFound("User not found");
      const isValidPassword = await user.isValidPassword(result.password);
      if (!isValidPassword) throw createError.Unauthorized("Invalid password");

      if (!user.toJSON().role_user.some((userRole) => userRole.name === role)) {
        throw createError.Unauthorized("This user has no " + role + " role");
      }
      const userId = "" + user.toJSON().id;
      const accesstoken = await signAccessToken(userId, role);
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

      const { userId, jti, role } = await verifyRefreshToken(oldRefreshToken);

      const refresh = await Refresh.findOne({ where: { jti } });
      console.log(refresh);
      if (!refresh) throw createError.Unauthorized("Invalid refresh token");
      if (refresh.expiresAt < Date.now())
        throw createError.Unauthorized("Refresh token expired");
      if (refresh.blocked)
        throw createError.Unauthorized("Refresh token blocked");
      refresh.blockToken();
      const accesstoken = await signAccessToken(userId, role);
      const newRefreshtoken = await signRefreshToken(userId, oldRefreshToken);
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
      if (!refresh) throw createError.Unauthorized("Invalid refresh token");
      Refresh.destroy({ where: { jti } });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};
