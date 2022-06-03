const createError = require('http-errors');

const Restaurant = require('../models').Restaurant
const Food = require('../models').Food
const { 
    foodGetPageReqSchema,
    foodAddReqSchema,
    foodModifyReqSchema,
    foodRemoveReqSchema,
    foodGetReqSchema
} = require('../helpers/schema_validation')

const internalError = createError.internalError
module.exports = {
    get: async (req, res, next) => {
        try {
            await foodGetReqSchema.validateAsync(req.query)
            if(req.query?.idRes){
                const foods = await Restaurant.findByPk(req.query?.idRes, {
                    include: 'foods'
                })
                res.send(foods?.foods)
            } else {
                const {pageNumber = 1, pageSize = 100} = req.query
                const foods = await Food.findAndCountAll({
                    offset: (pageNumber-1)*pageSize,
                    limit: pageSize*1
                })
                res.send(foods)
            }
        } catch (error) {
            if (error.isJoi === true)
                Next(createError.BadRequest())
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await foodAddReqSchema.validateAsync(req.body)
            const { restaurant } = req.payload(!restaurant)
            const result = await Food.create({...req.body})
            res.send(result)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    modify: async (req, res, next) => {
        try {
            await foodModifyReqSchema.validateAsync(req.body)
            const { food } = req.payload
            const {id, ...rest} = req.body
            const result = await food.update({...rest});
            res.send(result[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
    remove: async (req, res, next) => {
        try {
            await foodRemoveReqSchema.validateAsync(req.body)
            const { food } = req.payload;
            const result = await food.destroy();
            res.send(result[0]);
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
};
