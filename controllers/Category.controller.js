const createError = require('http-errors');
const Fuitable = require('../models').Fuitable;
const Restaurant = require('../models').Restaurant;
const { 
    categoryAddReqSchema,
    categoryGetReqSchema, 
    // CategoryModifyReqSchema, 
    // CategoryRemoveReqSchema 
} = require('../helpers/schema_validation');

const internalError = createError.internalError
module.exports = {
    get: async (req, res, next) => {
        try {
            await categoryGetReqSchema.validateAsync(req.query)
            const categories = await Restaurant.findByPk(req.query?.idRes, {
                include: 'fuitable_restaurant'
            });
            const result = categories['fuitable_restaurant'].map(e => {
                const { ResFuitable, ...rest } = e.toJSON();
                return rest;
            });
            res.send(result);
        } catch (error) {   
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await categoryAddReqSchema.validateAsync(req.body)
            const { idRes, name } = req.body;
            const [category, _] = await Fuitable.findOrCreate({
                where: {
                    name: name
                },
                default: {
                    name: name
                }
            })
            const restaurant = await Restaurant.findByPk(idRes);
            await category.addRestaurant_fuitable(restaurant);

            const result = await Fuitable.findOne({
                where: {
                    name: name
                }
            })
            res.send(result)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    
};
