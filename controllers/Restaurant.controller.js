const createError = require("http-errors");
const { options } = require("joi");
const { restaurantOwner } = require("../helpers/permission");

const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;
const Op = Sequelize.Op;

const Restaurant = require("../models").Restaurant;
const Voucher = require("../models").Voucher;
const Favourite = require("../models").Favourite;
const Food = require("../models").Food;
const Review = require("../models").Review;
const User = require("../models").User;
const ResFuitable = require("../models").ResFuitable;
const Fuitable = require("../models").Fuitable;

const {
    restaurantAddReqSchema,
    restaurantGetReqSchema,
    restaurantModifyReqSchema,
    restaurantRemoveReqSchema,
    restaurantGetByIdSchema,
    restaurantGetByDistance,
    restaurantGetByFiltered,
    restaurantGetDetailsSchema,
    restaurantGetByCategorySchema
} = require("../helpers/schema_validation");

const Utilizer = require("../helpers/utils");

const internalError = createError.InternalServerError;

const foodTopping = {
  "chè": [
    "Topping Trân Châu Nhân Dừa",
    "Topping Sương Sa hạt Lựu",
    "Topping Sợi Thái", 
    "Topping Sầu Riêng"
  ]
}

/**
 * tested
 * son
 */
const getRestaurantbyDistance = async (req, res, next) => {
    try {
        await restaurantGetByDistance.validateAsync(req.query, {
            allowUnknown: true,
        });

        const userId = req.payload.aud;
        var userLoc = await Utilizer.getUserCurrentLocation(userId);
        userLoc = [userLoc.latitude, userLoc.longitude];
        
        const restaurantResults = await Restaurant.findAll({
            attributes: ['id', 'name', 'coverImageLink', 'address', 'avgRating', 'latitude', 'longtitude', 'preparationTime', 'groupName'],
            include: [{
                model: Voucher,
                required: true,
                attributes: ['id', 'idRes', 'name']
            }]
        })

        var resGroup = {};
        for(const val of restaurantResults) {
            if (!(val.groupName in resGroup)) {
                resGroup[val.groupName] = [val.id];
            } else {
                resGroup[val.groupName].push(val.id);
            }
        }

        restaurantResults.forEach((element, index) => {
            const targetLoc = [element.latitude, element.longtitude];
            const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

            // calculate total time to ship
            const totalTime = Utilizer.getShippingTime(distance, element.preparationTime);

            returnElement = {
                "restaurantName": element.name,
                "restaurantImage": element.coverImageLink,
                "restaurantId": element.id,
                "restaurantAddress": element.address,
                "avgRating": element.avgRating,
                "Distance": distance ? distance.toFixed(1) : "0",
                "shippingTime": parseInt(totalTime),
                "Vouchers": element.Vouchers,
                "restaurantBranch": resGroup[element.groupName]
            };

            restaurantResults[index] = returnElement;
        })

        restaurantResults.sort((a, b) => (parseFloat(a.Distance) > parseFloat(b.Distance) ? 1 : -1));

        return restaurantResults;
        
    } catch (error) {
        if (error.isJoi === true) next(createError.BadRequest());
        console.log(error);
        next(internalError);
    }
};

/**
 * tested
 * son
 */
const getRestaurantsbyId = async (req, res, next) => {
    try {
        await restaurantGetByIdSchema.validateAsync(req.query, {
            allowUnknown: true,
        });
        
        const userId = req.payload.aud;
        var userLoc = await Utilizer.getUserCurrentLocation(userId);
        userLoc = [userLoc.latitude, userLoc.longitude];

        const restaurantsId = req.query.restaurantsId.split(",");

        const restaurantResults = await Restaurant.findAll({
            attributes: ['id', 'name', 'coverImageLink', 'address', 'avgRating', 'latitude', 'longtitude', 'preparationTime'],
            where: {
                id: restaurantsId,
            },
            include: [{
                model: Voucher,
                required: true,
                attributes: ['id', 'idRes', 'name']
            }]
        })

        restaurantResults.forEach((element, index) => {
            const targetLoc = [element.latitude, element.longtitude];
            const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

            // calculate total time to ship
            const totalTime = Utilizer.getShippingTime(distance, element.preparationTime);

            returnElement = {
                "restaurantName": element.name,
                "restaurantImage": element.coverImageLink,
                "restaurantId": element.id,
                "restaurantAddress": element.address,
                "avgRating": element.avgRating,
                "Distance": distance ? distance.toFixed(1) : "0",
                "shippingTime": parseInt(totalTime),
                "Vouchers": element.Vouchers
            };

            restaurantResults[index] = returnElement;
        });

        return restaurantResults;
        
    } catch (error) {
        if (error.isJoi === true) next(createError.BadRequest());
        console.log(error);
        next(internalError);
    }
};

const getRestaurantsbyCategory = async (req, res, next) => {
  try {
      await restaurantGetByCategorySchema.validateAsync(req.query, {
          allowUnknown: true,
      });
      
      const userId = req.payload.aud;
      var userLoc = await Utilizer.getUserCurrentLocation(userId);
      userLoc = [userLoc.latitude, userLoc.longitude];

      const categoryId = req.query.categoryId;

      const categoryInfo = await Fuitable.findOne({
        attributes: ["name"],
        where: { 
          id: categoryId
        }
      })


      const restaurantResults = await ResFuitable.findAll({
          attributes: [],
          where: {
              idFuitable: categoryId,
          },
          include: [{
              model: Restaurant,
              required: true,
              attributes: ['id', 'name', 'coverImageLink', 'address', 'avgRating', 'latitude', 'longtitude', 'preparationTime'],
              include: [{
                model: Voucher,
                required: true,
                attributes: ['id', 'idRes', 'name']
            }]
          }]
      })

      restaurantResults.forEach((element, index) => {
          const targetLoc = [element.Restaurant.latitude, element.Restaurant.longtitude];
          const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

          // calculate total time to ship
          const totalTime = Utilizer.getShippingTime(distance, element.Restaurant.preparationTime);

          returnElement = {
              "category": categoryInfo.name,
              "restaurantName": element.Restaurant.name,
              "restaurantImage": element.Restaurant.coverImageLink,
              "restaurantId": element.Restaurant.id,
              "restaurantAddress": element.Restaurant.address,
              "avgRating": element.Restaurant.avgRating,
              "Distance": distance ? distance.toFixed(1) : "0",
              "shippingTime": parseInt(totalTime),
              "Vouchers": element.Restaurant.Vouchers
          };

          restaurantResults[index] = returnElement;
      });

      return restaurantResults;
      
  } catch (error) {
      if (error.isJoi === true) next(createError.BadRequest());
      console.log(error);
      next(internalError);
  }
};

module.exports = {
  /**
   * tested
   * phuc
   */
  get: async (req, res, next) => {
    try {
      await restaurantGetReqSchema.validateAsync(req.query);

      const { pageNumber = 1, pageSize = 100 } = req.query;
      const restaurants = await Restaurant.findAndCountAll({
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize * 1,
      });
      res.send(restaurants);
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

  /**
     * tested
     * son
     */
  getFilteredRestaurants: async (req, res, next) => {
    try {
        await restaurantGetByFiltered.validateAsync(req.query, {
            allowUnknown: true,
        });

        const filter = req.query.filter

        var restaurantResults = null;
        if(filter == "location") {
            restaurantResults = await getRestaurantbyDistance(req, res, next);
        } else if (filter == "id") {
            restaurantResults = await getRestaurantsbyId(req, res, next);
        } else if (filter == "category") {
            restaurantResults = await getRestaurantsbyCategory(req, res, next);
        }

        res.send(restaurantResults);

    } catch (error) {
        if (error.isJoi === true) next(createError.BadRequest());
        console.log(error);
        next(internalError);
    }
  },
  /**
   * tested
   * son
   */
  getResDetails: async (req, res, next) => {
    try {
        await restaurantGetDetailsSchema.validateAsync(req.params)
        
        const userId = req.payload.aud;
        const resId = req.params.id;
        var userLoc = await Utilizer.getUserCurrentLocation(userId);
        userLoc = [userLoc.latitude, userLoc.longitude];

        var resResult = await Restaurant.findOne({
          attributes: ["id", "name", "address", "latitude", "longtitude", "avgRating", "totalReviews", "coverImageLink", "preparationTime"],
          where: { id: resId },
          include: [{
            model: Food,
            attributes: {
              exclude: ["createdAt", "updatedAt", "idRes", "prepareTime"]
            },
          }],
        });

        if (!resResult) {
          return next(createError(404, "Restaurant not found"));
         }

        resResult = resResult.dataValues;

        // check user like this restaurant
        const favResult = await Favourite.findOne({
          where: {
            idUser: userId, 
            idRes: resId
          }
        }).then(token => token !== null)
        .then(isExist => isExist);

        // format return results
        const targetLoc = [resResult.latitude, resResult.longtitude];
        resResult.Distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc).toFixed(1);
        resResult.shippingTime = parseInt(Utilizer.getShippingTime(resResult.Distance, resResult.preparationTime));
        resResult.totalOrders = resResult.totalReviews + Math.floor(Math.random() * 400);
        resResult.totalReviews = resResult.totalReviews > 100 ? `${Math.floor(resResult.totalReviews / 100) * 100}+` : resResult.totalReviews.toString(); 
        resResult.totalOrders = resResult.totalOrders > 100 ? `${Math.floor(resResult.totalOrders / 100) * 100}+` : resResult.totalOrders.toString(); 

        resResult.isLike = favResult;

        // add category to food list 
        resResult.Food = resResult.Food.map((element, index) => {
            const category = element.name.toLowerCase().split(" ")[0];
            var toppingInfo = foodTopping[category] ? foodTopping[category] : [];

            console.log(category);
            console.log(foodTopping[category]);

            toppingInfo = toppingInfo.map((element, index) => {
              const returnVal = {
                "name": element,
                "limit": Math.floor(Math.random() * 10),
                "price": (Math.floor(Math.random() * 10) + 5) * 1000
              }

              return returnVal;
            })

            return {
              ...element.dataValues,
              "category": category,
              "toppings": toppingInfo
            }
        })

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
   * son
   */
   getResReviews: async (req, res, next) => {
    try {
        await restaurantGetDetailsSchema.validateAsync(req.params)
        
        const userId = req.payload.aud;
        const resId = req.params.id;

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

  /**
   * tested
   * son
   */
   getMerchantInfo: async (req, res, next) => {
    try {
        await restaurantGetDetailsSchema.validateAsync(req.params)
        
        const userId = req.payload.aud;
        const resId = req.params.id;

        var results = await Restaurant.findOne({
          attributes: ["id", "address", "openTime", "closeTime"],
          where: {
            id: resId
          }
        })    

        if(!results) {
          console.log("Restaurant not found");
        }
        
        res.send(results);

    } catch (error) {
        if (error.isJoi === true) next(createError.BadRequest());
        console.log(error);
        next(internalError);
    }
  },
};
