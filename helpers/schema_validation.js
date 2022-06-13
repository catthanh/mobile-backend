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

const restaurantGetByFiltered = Joi.object({
    filter: Joi.string().required(),
})

const restaurantGetByDistance = Joi.object({
    userLat: Joi.number().required(),
    userLong: Joi.number().required()
})

const restaurantGetByIdSchema = Joi.object({
    restaurantsId: Joi.string().required(),
    userLat: Joi.number().required(),
    userLong: Joi.number().required()
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
    idRes: Joi.number().required,
    name: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    totalPay: Joi.number().required()
})
const voucherRemoveReqSchema = Joi.object({
    id: Joi.number().required(),
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
    updateValue: Joi.string().required(),
    updateKey: Joi.string(),
})

/*******************
 * Homepage section *
 *******************/
const homePageSearchSchema = Joi.object({
    searchValue: Joi.string().required(),
    userLat: Joi.number().required(),
    userLong: Joi.number().required(),
    pageNumber: Joi.number().min(1),
    pageSize: Joi.number().min(1)
})

module.exports = { 
    authSchema, 
    logInSchema, 

    restaurantGetReqSchema,
    restaurantAddReqSchema,
    restaurantModifyReqSchema,
    restaurantRemoveReqSchema,
    restaurantGetByIdSchema,
    restaurantGetByDistance,
    restaurantGetByFiltered,

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

    homePageSearchSchema,
    
};
