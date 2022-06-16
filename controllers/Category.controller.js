const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;
const Op = Sequelize.Op;

const createError = require('http-errors');
const Fuitable = require('../models').Fuitable;
const Restaurant = require('../models').Restaurant;
const ResFuitable = require('../models').ResFuitable;

const { 
    categoryAddReqSchema,
    categoryGetReqSchema, 
    categoryGetPopularSchema,
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
    getPopularCategory: async (req, res, next) => {
        try {
            await categoryGetPopularSchema.validateAsync(req.query);

            const results = await ResFuitable.findAll({
                include: [{
                        where: {
                            imageLink: {
                                [Op.not]: null
                            }
                        },
                        model: Fuitable,
                        attributes: ["id", "name", "imageLink"],
                        required: true
                    }
                ],
                attributes: [[Sequelize.fn('count', Sequelize.col('ResFuitable.idRes')), 'count']],
                group: ['ResFuitable.idFuitable'],
                order: [[Sequelize.col("count"), "DESC"]],
                limit: parseInt(req.query.limit)
            })
            
            results.forEach((element, index) => {
                results[index] = element.Fuitable;
            })
            
            res.send(results);
        } catch (error) {   
            if (error.isJoi === true)
                next(createError.BadRequest());
            console.log(error);
            next(internalError);
        }
    },
};
