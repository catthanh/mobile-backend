const createError = require('http-errors');
const Food = require('../models').Food
const {
    foodGetReqSchema
} = require('../helpers/schema_validation')

const internalError = createError.InternalServerError()
module.exports = {
    get: async (req, res, next) => {
        try {
            const {pageNumber = 1, pageSize = 100} = req.query
            const foods = await Food.findAndCountAll({
                offset: (pageNumber-1)*pageSize,
                limit: pageSize*1
            })
            res.send(foods)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    getById: async (req, res, next) => {
        try {
            await foodGetReqSchema.validateAsync(req.params);
            const { id } = req.params;
            
            const food = await Food.findByPk(id);
            let result = food.toJSON();
            if(!result.newPrice) {
                const { price, ...rest } = result;
                result = {
                    ...rest,
                    oldPrice: price,
                    newPrice: price
                }
            }
            res.send(result);
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
};
