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
    address: Joi.string().required(),
    category: Joi.array().required()
})
const restaurantModifyReqSchema = Joi.object({
    id: Joi.number().required()
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
    idRes: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required()
})
const foodModifyReqSchema = Joi.object({
    id: Joi.number().required(),
    idRes: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required()
})
const foodRemoveReqSchema = Joi.object({
    id: Joi.number().required(),
})
/*******************
 * Voucher section *
 *******************/
 const voucherGetReqSchema = Joi.object({
    idRes: Joi.number()
})
const voucherAddReqSchema = Joi.object({
    idRes: Joi.number().required(),
    name: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    totalPay: Joi.number().required()
})
const voucherRemoveReqSchema = Joi.object({
    id: Joi.number().required(),
    idRes: Joi.number().required()
})

/*******************
 * User section *
 *******************/
const jwtPayloadSchema = Joi.object({
    iss: Joi.string(),
    iat: Joi.number(),
    exp: Joi.number(),
    aud: Joi.number().required()
})

const userGetFavouriteSchema = Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required()
})

const userUpdateInfoSchema = Joi.object({
    column: Joi.string().required(),
    updateValue: Joi.string().required()
})

/********************
 * Category section *
 ********************/
const categoryGetReqSchema = Joi.object({
    idRes: Joi.number().required()
})
const categoryAddReqSchema = Joi.object({
    idRes: Joi.number().required(),
    name: Joi.string().required(),
})
/*****************
 * Order section *
 *****************/
const orderGetReqSchema = Joi.object({
    idRes: Joi.number().required()
})
const orderUpdateReqSchema = Joi.object({
    idRes: Joi.number().required()
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
    foodRemoveReqSchema,

    voucherGetReqSchema,
    voucherAddReqSchema,
    voucherRemoveReqSchema,

    jwtPayloadSchema,
    userGetFavouriteSchema,
    userUpdateInfoSchema,

    categoryGetReqSchema,
    categoryAddReqSchema,

    orderGetReqSchema,
    orderUpdateReqSchema
};
