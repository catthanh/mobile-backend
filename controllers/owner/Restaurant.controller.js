const createError = require("http-errors");
const { options } = require("joi");
const { restaurantOwner } = require("../../helpers/permission");

const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;
const Op = Sequelize.Op;

const Restaurant = require("../../models").Restaurant;
const Voucher = require("../../models").Voucher;
const Favourite = require("../../models").Favourite;
const Food = require("../../models").Food;
const Review = require("../../models").Review;
const User = require("../../models").User;

const {
  restaurantAddReqSchema,
  restaurantModifyReqSchema,
} = require("../../helpers/schema_validation");

const Utilizer = require("../../helpers/utils");

const internalError = createError.InternalServerError;


module.exports = {
  /**
  * tested
  * son
  */
  get: async (req, res, next) => {
    try {
      const { aud: userId, restaurant } = req.payload;
      var userLoc = await Utilizer.getUserCurrentLocation(userId);
      userLoc = [userLoc?.latitude, userLoc?.longitude];

      const categories = await Restaurant.findByPk(restaurant.id, {
        include: 'fuitable_restaurant'
      });
      const processedCategories = categories['fuitable_restaurant'].map(e => {
        const { ResFuitable, ...rest } = e.toJSON();
        return rest;
      });
      resResult = restaurant.toJSON();
      
      // format return results
      const targetLoc = [resResult?.latitude, resResult?.longtitude];
      resResult.Categories = [...processedCategories];
      resResult.Distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc).toFixed(1);
      resResult.shippingTime = parseInt(Utilizer.getShippingTime(resResult.Distance, resResult.preparationTime));
      resResult.totalOrders = resResult.totalReviews + Math.floor(Math.random() * 400);
      resResult.totalReviews = resResult.totalReviews > 100 ? `${Math.floor(resResult.totalReviews / 100) * 100}+` : resResult.totalReviews?.toString(); 
      resResult.totalOrders = resResult.totalOrders > 100 ? `${Math.floor(resResult.totalOrders / 100) * 100}+` : resResult.totalOrders?.toString(); 
      
      delete resResult["longtitude"];
      delete resResult["latitude"];
      delete resResult["preparationTime"];
      
      res.send(resResult);
      
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      console.log(error);
      next(internalError);
    }
  },
  
  /**
  * tested
  * phuc
  */
  add: async (req, res, next) => {
    try {
      await restaurantAddReqSchema.validateAsync(req.body);
      const { aud: idUser, restaurant } = req.payload;
      if(restaurant){
        next(createError.BadRequest("Restaurant already exist"));
      }
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
      await restaurantModifyReqSchema.validateAsync(req.body);
      const { aud: userId, restaurant } = req.payload;
      await restaurant.update({ ...req.body, idUser: userId });
      res.send(restaurant);
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) next(createError.BadRequest());
      next(internalError);
    }
  },
  
  /**
  * tested
  * son
  */
  getResReviews: async (req, res, next) => {
    try {
      
      const { aud: userId, restaurant } = req.payload;
      const resId = restaurant.id;
      
      var results = await Review.findAll({
        attributes: {
          exclude: ["createdAt", "idRes"]
        },
        where: {
          idRes: resId,
          description: {
            [Op.not]: null
          }
        },
        include: {
          model: User,
          attributes: ["name"]
        },
        raw: true,
        nest: true,
      })
      
      if (!results) {
        return next(createError(404, "Restaurant not found"));
      }
      
      results.forEach((element, index) => {
        returnElement = {
          ...element,
          "userName": element.User.name
        };
        
        delete returnElement["User"];
        
        results[index] = returnElement;
      });
      
      res.send(results);
      
      
    } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      console.log(error);
      next(internalError);
    }
  },
};
