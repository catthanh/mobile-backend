const Restaurant = require('../models').Restaurant;
const Food = require('../models').Food;
const createError = require('http-errors');

module.exports = {
  restaurantOwner: async (req, res, next) => {
    try {
      const { aud: idUser } = req.payload;
      const { idRes } = req.body;
      if (!idRes) {
        next(createError.BadRequest('restaurant id missing'));
      }
      const restaurant = await Restaurant.findByPk(idRes);
      if (!restaurant) {
        next(createError.NotFound("restaurant isn't exist"));
      } else if (restaurant?.idUser != idUser) {
        next(createError.Unauthorized('user is not authenticated'));
      }
      req.payload = {
        ...req.payload,
        restaurant: restaurant,
      };
      next();
    } catch (error) {
      next(createError.internalError);
    }
  },
  foodOfRestaurant: async (req, res, next) => {
    // must used in chain after restaurantOwner
    try {
      const { restaurant } = req.payload;
      const { id: idFood } = req.body;
      const food = await Food.findByPk(idFood);
      if (!food) {
        next(createError.NotFound('food not found'));
      } else if (restaurant.id != food.idRes) {
        next(createError.NotFound('restaurant doesnt have this food'));
      }
      req.payload = {
        ...req.payload,
        food: food,
      };
      next();
    } catch (error) {
      next(createError.internalError);
    }
  },
};
