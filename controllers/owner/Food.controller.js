const createError = require('http-errors');

const Food = require('../../models').Food
const {
    foodAddReqSchema,
    foodRemoveReqSchema,
    foodModifyReqSchema
} = require('../../helpers/schema_validation')

const internalError = createError.InternalServerError()
module.exports = {
    /**
     * tested ttphuc
     */
    get: async (req, res, next) => {
        try {
            const { restaurant } = req.payload;
            const {pageNumber = 1, pageSize = 100} = req.query
            const foods = await Food.findAndCountAll({
                offset: (pageNumber-1)*pageSize,
                limit: pageSize*1,
                where: {
                    idRes: restaurant.id
                }
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
            const { restaurant } = req.payload;
            const { id: foodId } = req.params;
            const foods = await Food.findAndCountAll({
                where: {
                    idRes: restaurant.id
                }
            })
            res.send(foods?.rows.find(e => e.dataValues.id === parseInt(foodId)) || null)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    
    /**
     * tested ttphuc
     */
    add: async (req, res, next) => {
        try {
            await foodAddReqSchema.validateAsync(req.body)
            const { restaurant } = req.payload
            const [food, isCreated] = await Food.findOrCreate({
                where: {...req.body, idRes: restaurant.id},
                default: {...req.body, idRes: restaurant.id}
            });
            if(!isCreated) {
                next(createError.BadRequest('food existed'));
            }
            res.send(food)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    modify: async (req, res, next) => {
        try {
            await foodModifyReqSchema.validateAsync(req.body);
            const { restaurant } = req.payload;
            const { id, ...rest } = req.body;
            const food = await Food.findOne({
                where: {
                    id: id,
                    idRes: restaurant.id
                }
            })
            if(!food){
                next(createError.BadRequest("food not found"));
            }
            await food.update({ ...rest, id: id, idRes: restaurant.id });
            res.send(food);
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    delete: async (req, res, next) => {
        try {
            await foodRemoveReqSchema.validateAsync(req.params);
            const { id } = req.params;
            const { restaurant } = req.payload;
            const result = await Food.destroy({
                where: {
                    id: id,
                    idRes: restaurant.id
                }
            })
            res.send(result)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },

};