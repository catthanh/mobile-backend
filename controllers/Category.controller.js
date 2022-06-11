const createError = require('http-errors');
const Fuitable = require('../models').Fuitable;
const Restaurant = require('../models').Restaurant;
const { 
    categoryAddReqSchema,
    categoryGetReqSchema, 
    // CategoryModifyReqSchema, 
    // CategoryRemoveReqSchema 
} = require('../helpers/schema_validation')

const internalError = createError.internalError
module.exports = {
    get: async (req, res, next) => {
        try {
            await categoryGetReqSchema.validateAsync(req.query)
            const categories = await Restaurant.findByPk(req.query?.idRes, {
                include: {
                    model: 'fuitables',
                    as: 'idFuitable_fuitables'
                }
            })
            res.send(categories);
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await categoryAddReqSchema.validateAsync(req.body)
            
            const result = await Fuitable.create({...req.body});    
            res.send(result[0]);
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    
};
