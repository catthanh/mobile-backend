const createError = require("http-errors");
const { options } = require("joi");
const { restaurantOwner } = require("../helpers/permission");

const Restaurant = require('../models').Restaurant;
const {
  restaurantAddReqSchema,
  restaurantGetReqSchema,
  restaurantModifyReqSchema,
  restaurantRemoveReqSchema,
} = require('../helpers/schema_validation');

const internalError = createError.internalError;
module.exports = {
  /**
   * tested
   * phuc
   */
  get: async (req, res, next) => {
    try {
      await restaurantGetReqSchema.validateAsync(req.query);

      if (req.query?.id) {
        const restaurants = await Restaurant.findByPk(req.query?.id);
        res.send(restaurants);
      } else {
        const { pageNumber = 1, pageSize = 100 } = req.query;
        const restaurants = await Restaurant.findAndCountAll({
          offset: (pageNumber - 1) * pageSize,
          limit: pageSize * 1,
        });
        res.send(restaurants);
      }
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  /**
   * tested
   * phuc
   */
  add: async (req, res, next) => {
    try {
      await restaurantAddReqSchema.validateAsync(req.body, {
        allowUnknown: true,
      });
      const { aud: idUser } = req.payload;
      const result = await Restaurant.create({ ...req.body, idUser: idUser });
      res.send(result);
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  /**
   * tested
   * phuc
   */
  modify: async (req, res, next) => {
    try {
      await restaurantModifyReqSchema.validateAsync(req.body, {
        allowUnknown: true,
      });
      const { restaurant } = req.payload;
      if (restaurant) {
        restaurant.update({ ...rest });
        res.send(restaurant);
      } else {
        next(createError.Unauthorized());
      }
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  /**
   * tested
   * phuc
   */
  remove: async (req, res, next) => {
    try {
      await restaurantRemoveReqSchema.validateAsync(req.body);
      const { restaurant } = req.payload;
      if (restaurant) {
        restaurant.destroy();
        res.send(restaurant);
      } else {
        next(createError.Unauthorized());
      }
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
};
