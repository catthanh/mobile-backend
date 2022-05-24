const createError = require('http-errors');

const Restaurant = require('../models').Restaurant
const { 
    restaurantAddReqSchema,
    restaurantGetReqSchema, 
    restaurantModifyReqSchema, 
    restaurantRemoveReqSchema 
} = require('../helpers/schema_validation')

const internalError = createError.internalError
module.exports = {
    /**
     * tested
     * phuc
     */
    get: async (req, res, next) => {
        try {
            await restaurantGetReqSchema.validateAsync(req.query)

            if(req.query?.id){ 
                const restaurants = await Restaurant.findByPk(req.query?.id)
                res.send(restaurants)
            } else {
                const {pageNumber = 1, pageSize = 100} = req.query
                const restaurants = await Restaurant.findAndCountAll({
                    offset: (pageNumber-1)*pageSize,
                    limit: pageSize*1
                })
                res.send(restaurants)
            }
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    /**
     * tested
     * phuc
     */
    add: async (req, res, next) => {
        try {
            await restaurantAddReqSchema.validateAsync(req.body)
            const { aud: idUser } = req.payload
            const result = await Restaurant.create({...req.body, idUser: idUser})
            res.send(result)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    modify: async (req, res, next) => {
        try {
            await restaurantModifyReqSchema.validateAsync(req.body)
            const { aud: idUser } = req.payload
            const {id, ...rest} = req.body
            const result = await Restaurant.findByPk(req.query?.id)
            if(result.idUser != idUser)
                next(createError.Unauthorized)

            result.update({...rest})
            res.send(result)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
    remove: async (req, res, next) => {
        try {
            await restaurantRemoveReqSchema.validateAsync(req.body)
            const { aud: idUser } = req.payload
            const res = await Restaurant.findByPk(req.query?.id)
            if(res.idUser != idUser)
                next(createError.Unauthorized)

            res.destroy()
            // const newRes = await Restaurant.destroy({
            //     where: {
            //         id: req.body?.id
            //     }
            // })
            res.send(newRes[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
};
