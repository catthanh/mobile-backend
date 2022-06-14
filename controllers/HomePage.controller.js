const createError = require("http-errors");
const { options } = require("joi");
const _sequelize = require('sequelize');
const { Model, Sequelize } = _sequelize;

const Restaurant = require("../models").Restaurant;
const UserSearchHistory = require("../models").UserSearchHistory;

const {
    jwtPayloadSchema,
    homePageSearchSchema,
} = require("../helpers/schema_validation");

const Utilizer = require("../helpers/utils");

const internalError = createError.InternalServerError;

/**
 * tested
 * son
 */
const saveSearchResults = async (userId, searchValue) => {
    try {
        await UserSearchHistory.findOrCreate({
            where: {
                idUser: userId,
                searchText: searchValue,
            },
            defaults: {
                idUser: userId,
                searchText: searchValue,
            }
        }).then((results) => {
            const created = results[1];

            if (!created) { // false if author already exists and was not created.
                console.log('Already exists');
            };
        })

    } catch (error) {
        console.log(error);
        throw internalError;
    }
};

module.exports = {
    /**
     * tested
     * son
     */
    search: async (req, res, next) => {
        try {
            await homePageSearchSchema.validateAsync(req.body);
            
            const limit = req.body.pageSize;
            const offset = (req.body.pageNumber - 1) * limit;
            const searchValue = req.body.searchValue;
            const isSearch = req.body.isSearch;

            const userId = req.payload.aud;
            var userLoc = await Utilizer.getUserCurrentLocation(userId);
            userLoc = [userLoc.latitude, userLoc.longtitude];

            if(isSearch) {
                saveSearchResults(userId, searchValue);
            }
            
            const restaurantResults = await Restaurant.findAll({
                attributes: { 
                    exclude: [`idUser`, `totalFavourites`, `totalViews`, `priceRange`, `qualityScore`, `serviceScore`, `spaceScore`, `priceScore`, `locationScore`, `fit`, `capacity`, `cuisines`, `suitable`, `fuitable`, `groupName`, `createdAt`, `updatedAt`],
                    include: [
                        [Sequelize.literal(`"restaurant"`), 'type'],
                        [Sequelize.literal(`MATCH (name) AGAINST("${searchValue}" IN NATURAL LANGUAGE MODE)`), 'score']
                    ]
                },
                where: Sequelize.literal(`MATCH (name) AGAINST("${searchValue}" IN NATURAL LANGUAGE MODE)`),
                order: [[Sequelize.literal('score'), 'DESC']],
                limit: limit,
                offset: offset
            })

            // const foodResults = await Food.findAll({
            //     attributes: { 
            //         exclude: [`idRes`, `price`, `prepareTime`, `imageLink`, `createdAt`, `updatedAt`],
            //         include: [
            //             [Sequelize.literal(`"food"`), 'type'],
            //             [Sequelize.literal(`MATCH (name) AGAINST("${searchValue}" IN NATURAL LANGUAGE MODE)`), 'score']
            //         ]
            //     },
            //     where: Sequelize.literal(`MATCH (name) AGAINST("${searchValue}" IN NATURAL LANGUAGE MODE)`),
            //     order: [[Sequelize.literal('score'), 'DESC']],
            //     limit: limit,
            // })
            
            const finalResults = [...restaurantResults]

            finalResults.forEach((element, index) => {
                const targetLoc = [element.latitude, element.longtitude];
                const distance = Utilizer.calDistanceByLatLong(userLoc, targetLoc);

                const currentTime = Utilizer.getCurrentTime();

                // handle if this restaurant not have open time and close time
                element.openTime = element.openTime ? element.openTime : "00:00:00";
                element.closeTime = element.closeTime ? element.closeTime : "23:59:00";

                returnElement = {
                    "restaurantName": element.name,
                    "restaurantImage": element.coverImageLink,
                    "restaurantId": element.id,
                    "restaurantAddress": element.address,
                    "totalReviews": element.totalReviews,
                    "avgRating": parseFloat(element.avgRating),
                    "Distance": distance ? parseFloat(distance.toFixed(1)) : 0,
                    "category": element.category,
                    "isOpen": (currentTime > element.openTime && currentTime < element.closeTime) ? true : false
                };

                finalResults[index] = returnElement;
            })

            res.send(finalResults);
            
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            console.log(error);
            next(internalError);
        }
    },
};
