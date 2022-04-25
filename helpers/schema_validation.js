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
    id: JoiObjectId().required(),
    name: Joi.string(),
    address: Joi.string()
})
const restaurantRemoveReqSchema = Joi.object({
    id: JoiObjectId().required(),
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
    name: Joi.string().required(),
    address: Joi.string().required()
})
const foodModifyReqSchema = Joi.object({
    id: JoiObjectId().required(),
    name: Joi.string(),
    address: Joi.string()
})
const foodRemoveReqSchema = Joi.object({
    id: JoiObjectId().required(),
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
