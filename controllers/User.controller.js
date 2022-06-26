const createError = require("http-errors");
const { options } = require("joi");

const Restaurant = require("../models").Restaurant;
const Order = require("../models").Order;
const Favourite = require("../models").Favourite;
const User = require("../models").User;
const Voucher = require("../models").Voucher;
const UserSearchHistory = require("../models").UserSearchHistory;
const FcmToken = require("../models").FcmToken;

const {
    jwtPayloadSchema,
    userGetFavouriteSchema,
    userUpdateInfoSchema,
    userUpdateAddressInfoSchema,
    userSaveCurrentAddressSchema,
    userGetSearchHistorySchema,
    userAddFavouriteSchema,
    userDeleteFavouriteSchema,
    userDeleteSearchHistoryByIdSchema,
    addFcmTokenSchema
} = require("../helpers/schema_validation");
const Utilizer = require("../helpers/utils");
const NotiHelper = require("../helpers/notification");

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
                    "restaurantImage": element.Restaurant.coverImageLink,
                    "restaurantId": element.Restaurant.id
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
            await userGetFavouriteSchema.validateAsync(req.query);

            const userId = req.payload.aud;
            var userLoc = await Utilizer.getUserCurrentLocation(userId);
            userLoc = [userLoc.latitude, userLoc.longitude];

            const favourites = await Favourite.findAll({
                attributes: ['idRes', 'idUser'],
                where: {idUser: userId},
                include: [{
                        model: Restaurant,
                        required: true,
                        attributes: ['id', 'name', 'avgRating', 'latitude', 'longtitude', 'coverImageLink', 'preparationTime'],
                        include: {
                            model: Voucher,
                            required: true,
                            attributes: ['id', 'idRes', 'name']
                        }
                    }
                ],
                order: [['updatedAt', 'DESC']]
            })
            
            favourites.forEach((element, index) => {
                const targetLoc = [element.Restaurant.latitude, element.Restaurant.longtitude];
                const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

                // calculate total time to ship
                const totalTime = Utilizer.getShippingTime(distance, element.Restaurant.preparationTime);

                returnElement = {
                    "Distance": distance.toFixed(1),
                    "shippingTime": totalTime,
                    "restaurantName": element.Restaurant.name,
                    "restaurantImage": element.Restaurant.coverImageLink,
                    "restaurantId": element.Restaurant.id,
                    "Vouchers": element.Restaurant.Vouchers,
                    "avgRating": element.Restaurant.avgRating ? element.Restaurant.avgRating.toString() : 0
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
    addFavouritesList: async (req, res, next) => {
        try {
            await userAddFavouriteSchema.validateAsync(req.body);

            const userId = req.payload.aud;

            const isExist = await Restaurant.findOne({ where: { id: req.body.idRes } })
                                    .then(token => token !== null)
                                    .then(isUnique => isUnique);

            if (!isExist) next(createError.BadRequest("Restaurant id is not exist"));

            await Favourite.create({
                idRes: req.body.idRes,
                idUser: userId
            })
            
            res.send(200);

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
    deleteFavouritesList: async (req, res, next) => {
        try {
            await userDeleteFavouriteSchema.validateAsync(req.body);

            const userId = req.payload.aud;

            const isExist = await Favourite.findOne({ where: { idRes: req.body.idRes } })
                                    .then(token => token !== null)
                                    .then(isUnique => isUnique);

            if (!isExist) next(createError.BadRequest("Restaurant id not exist in favourite list"));

            await Favourite.destroy({
                where: {
                    idRes: req.body.idRes,
                    idUser: userId
                }
            })
            
            res.send(200);

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
            const reqBody = await userUpdateInfoSchema.validateAsync(req.body, {
                allowUnknown: true,
            });

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
    },
    /**
     * tested
     * son
     */
    updateAddressInfo: async (req, res, next) => {
        try {
            const reqBody = await userUpdateAddressInfoSchema.validateAsync(req.body, {
                allowUnknown: true,
            });

            const userId = req.payload.aud;

            var updateData = {};

            const user = await User.findOne({
                attributes: ["id", "address"],
                where: {id: userId},
            })
            
            updateData[reqBody.updateKey] = reqBody.updateValue;
            user.address = {...user.address, ...updateData}

            User.update(
                {
                    address: user.address
                },
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
    },
    /**
     * tested
     * son
     */
    get: async (req, res, next) => {
        try {
            await jwtPayloadSchema.validateAsync(req.payload);
            
            const userId = req.payload.aud;

            var user = await User.findOne({
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt', "currentAddress"]
                },
                where: {id: userId},
            })

            user = user.dataValues;
            user = {
                ...user,
                "address": Object.entries(user.address).map((e) => ( { "type": e[0], ...e[1] } ))
            };

            res.send(user);
            
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
    saveCurrentUserLocation: async (req, res, next) => {
        try {
            await userSaveCurrentAddressSchema.validateAsync(req.body);
            
            const userId = req.payload.aud;
            
            // update current address
            const user = await User.update(
                {
                    currentAddress: req.body
                },
                { 
                    where: { id: userId } 
                }
            );

            // update current address in address fields
            var updateData = {};

            const userResult = await User.findOne({
                attributes: ["id", "address"],
                where: {id: userId},
            })
            
            updateData["currentAddress"] = req.body;
            userResult.address = {...userResult.address, ...updateData}

            User.update(
                {
                    address: userResult.address
                },
                { 
                    where: { id: userId } 
                }
            );

            res.send(200);
            
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
    getSearchHistory: async (req, res, next) => {
        try {
            await userGetSearchHistorySchema.validateAsync(req.query);
            
            const userId = req.payload.aud;

            const searchHistories = await UserSearchHistory.findAll({
                attributes: ["id", "idUser", "searchText"],
                where: {
                    idUser: userId,
                },
                limit: parseInt(req.query.limit),
                order: [['createdAt', 'DESC']]
            });

            res.send(searchHistories);
            
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
    deleteSearchHistoryById: async (req, res, next) => {
        try {            
            await userDeleteSearchHistoryByIdSchema.validateAsync(req.params);

            const userId = req.payload.aud;

            const row = await UserSearchHistory.findOne({ 
                where: {
                    id: req.params.id, 
                }
            });

            if(row) {
                await row.destroy();
            } else {
                next(createError.BadRequest("Id not exists"));
            }

            res.sendStatus(200);
            
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
    deleteAllSearchHistory: async (req, res, next) => {
        try {            
            const userId = req.payload.aud;

            const count = await UserSearchHistory.destroy({ 
                where: {
                    idUser: userId, 
                }
            });

            if(count) {
                console.log("Success");
            } else {
                next(createError.BadRequest("This user dont have search history"));
            }

            res.sendStatus(200);
            
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
    addFcmToken: async (req, res, next) => {
        try {            
            await addFcmTokenSchema.validateAsync(req.body);

            console.log(req.payload);
            const userRole = req.payload.role;
            const userId = req.payload.aud;
            const token = req.body.token;

            await FcmToken.findOrCreate({
                where: {
                    idUser: userId,
                },
                defaults: {
                    idUser: userId,
                    token: token
                }
            }).then(function(result) {
                const created = result[1]; // boolean stating if it was created or not
          
                if (!created) { // false if author already exists and was not created.
                  console.log('User already have token');
                  next(createError.BadRequest("User already have token"));
                }
            });
            
            if (userRole === "shipper") {
                NotiHelper.setSubscribeToTopic("shipperOrder", userId)
            }

            res.sendStatus(200);
            
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            console.log(error);
            next(internalError);
        }
    },

};
