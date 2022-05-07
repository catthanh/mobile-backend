const Joi = require("joi");
const JoiObjectId = (message = 'valid id') => Joi.string().regex(/^[0-9a-fA-F]{24}$/, message)

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
});

const logInSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

/**********************
 * Restaurant section *
 **********************/
const restaurantGetReqSchema = Joi.object({
    id: Joi.number(),
    pageNumber: Joi.number().min(1),
    pageSize: Joi.number().min(1)
})
const restaurantAddReqSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required()
})
const restaurantModifyReqSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string(),
    address: Joi.string()
})
const restaurantRemoveReqSchema = Joi.object({
    id: Joi.number().required(),
})

/****************
 * Food section *
 ****************/
const foodGetReqSchema = Joi.object({
    idRes: Joi.number(),
    pageNumber: Joi.number().min(1),
    pageSize: Joi.number().min(1)
})
const foodAddReqSchema = Joi.object({
    idRes: Joi.number().required,
    name: Joi.string().required(),
    price: Joi.number().required()
})
const foodModifyReqSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required()
})
const foodRemoveReqSchema = Joi.object({
    id: Joi.number().required(),
})
module.exports = { 
    authSchema, 
    logInSchema, 

    restaurantGetReqSchema,
    restaurantAddReqSchema,
    restaurantModifyReqSchema,
    restaurantRemoveReqSchema,

    foodGetReqSchema,
    foodAddReqSchema,
    foodModifyReqSchema,
    foodRemoveReqSchema
};
