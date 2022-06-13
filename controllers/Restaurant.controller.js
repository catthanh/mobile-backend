const createError = require("http-errors");
const { options } = require("joi");
const { restaurantOwner } = require("../helpers/permission");

const Restaurant = require("../models").Restaurant;
const Voucher = require("../models").Voucher;

const {
    restaurantAddReqSchema,
    restaurantGetReqSchema,
    restaurantModifyReqSchema,
    restaurantRemoveReqSchema,
    restaurantGetByIdSchema,
    restaurantGetByDistance,
    restaurantGetByFiltered
} = require("../helpers/schema_validation");

const Utilizer = require("../helpers/utils");

const internalError = createError.InternalServerError;

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
        userLoc = [userLoc.latitude, userLoc.longtitude];
        
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
                "avgRating": parseFloat(element.avgRating),
                "Distance": distance ? parseFloat(distance.toFixed(1)) : 0,
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
        userLoc = [userLoc.latitude, userLoc.longtitude];

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
                "avgRating": parseFloat(element.avgRating),
                "Distance": distance ? parseFloat(distance.toFixed(1)) : 0,
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
            const result = await Restaurant.create({
                ...req.body,
                idUser: idUser,
            });
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
            }

            res.send(restaurantResults);
            
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            console.log(error);
            next(internalError);
        }
    }

};
