const createError = require("http-errors");
const { options } = require("joi");

const Restaurant = require("../models").Restaurant;
const Order = require("../models").Order;
const Favourite = require("../models").Favourite;
const User = require("../models").User;

const {
    jwtPayloadSchema,
    userGetFavouriteSchema,
    userUpdateInfoSchema
} = require("../helpers/schema_validation");
const Utilizer = require("../helpers/utils");

const internalError = createError.InternalServerError;
module.exports = {
    /**
     * tested
     * son
     */
    getNotification: async (req, res, next) => {
        try {
            await jwtPayloadSchema.validateAsync(req.payload);
            
            const userId = req.payload.aud;
            const orders = await Order.findAll({
                attributes: ['idRes', 'idUser', 'status', 'updatedAt'],
                where: {idUser: userId},
                include: [{
                    model: Restaurant,
                    required: true,
                    attributes: ['id', 'name', 'coverImageLink']
                }],
                order: [['updatedAt', 'DESC']]
            })

            // format return elements 
            orders.forEach((element, index) => {
                returnElement = {
                    "orderStatus": element.status,
                    "updateTime": new Date(element.updatedAt).toLocaleString('en-GB'),
                    "restaurantName": element.Restaurant.name,
                    "restaurantImage": element.Restaurant.coverImageLink
                };

                orders[index] = returnElement;
            })

            res.send(orders);
            
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
    getFavouritesList: async (req, res, next) => {
        try {
            const re = new RegExp('[0-9]');

            const queryParams = await userGetFavouriteSchema.validateAsync(req.query);
            const userLoc = [queryParams.lat, queryParams.long] 
            const userId = req.payload.aud;

            const favourites = await Favourite.findAll({
                attributes: ['idRes', 'idUser'],
                where: {idUser: userId},
                include: [{
                    model: Restaurant,
                    required: true,
                    attributes: ['id', 'name', 'avgRating', 'latitude', 'longtitude', 'coverImageLink', 'preparationTime']
                }],
                order: [['updatedAt', 'DESC']]
            })
            
            favourites.forEach((element, index) => {
                const targetLoc = [element.Restaurant.latitude, element.Restaurant.longtitude];
                const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

                // calculate total time to ship
                var prepareTime = element.Restaurant.preparationTime.match(re);
                prepareTime = prepareTime ? prepareTime?.[0] : 0;
                const totalTime = parseInt(prepareTime) + parseInt(distance) * 2;

                returnElement = {
                    "Distance": distance.toFixed(1),
                    "shippingTime": totalTime,
                    "restaurantName": element.Restaurant.name,
                    "restaurantImage": element.Restaurant.coverImageLink
                };

                favourites[index] = returnElement;
            })

            res.send(favourites);

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
    profile: async (req, res, next) => {
        try {
            await jwtPayloadSchema.validateAsync(req.payload);

            const userId = req.payload.aud;
            // hardcoded  
            const userAvatar = 'https://banner2.cleanpng.com/20180626/fhs/kisspng-avatar-user-computer-icons-software-developer-5b327cc98b5780.5684824215300354015708.jpg';
            
            const user = await User.findOne({
                attributes: ['id', 'name'],
                where: {id: userId},
            })

            res.send({
                "name": user.name,
                "avatar": userAvatar
            })

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
    updateInfo: async (req, res, next) => {
        try {
            const reqBody = await userUpdateInfoSchema.validateAsync(req.body);

            const userId = req.payload.aud;

            var updateData = {};
            updateData[reqBody.column] = reqBody.updateValue;

            User.update(
                updateData,
                { 
                    where: { id: userId } 
                }
              );

            res.sendStatus(200);
            
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            console.log(error);
            next(internalError);
        }
    }

};
