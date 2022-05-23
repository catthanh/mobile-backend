const createError = require('http-errors');

const Category = require('../models').Category
const { 
    CategoryAddReqSchema,
    CategoryGetReqSchema, 
    CategoryModifyReqSchema, 
    CategoryRemoveReqSchema 
} = require('../helpers/schema_validation')

const internalError = createError.internalError
module.exports = {
    get: async (req, res, next) => {
        try {

            if(req.query?.id){ 
                const Categories = await Category.findByPk(req.query?.id)
                res.send(Categories)
            } else {
                const {pageNumber = 1, pageSize = 100} = req.query
                const Categories = await Category.findAndCountAll({
                    offset: (pageNumber-1)*pageSize,
                    limit: pageSize*1
                })
                res.send(Categories)
            }
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await CategoryAddReqSchema.validateAsync(req.body)
            
            const newRes = await Category.create({...req.body})
            res.send(newRes[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    modify: async (req, res, next) => {
        try {
            await CategoryModifyReqSchema.validateAsync(req.body)
            
            const {id, ...rest} = req.body
            const newRes = await Category.update({...rest},{
                where: {
                    id: id
                }
            })
            res.send(newRes[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
    remove: async (req, res, next) => {
        try {
            await CategoryRemoveReqSchema.validateAsync(req.body)
            const newRes = await Category.destroy({
                where: {
                    id: req.body?.id
                }
            })
            res.send(newRes[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
};
