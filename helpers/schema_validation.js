const Joi = require("joi");
const JoiObjectId = (message = "valid id") =>
  Joi.string().regex(/^[0-9a-fA-F]{24}$/, message);

const authSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid("user", "shipper", "resOwner"),
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
  pageSize: Joi.number().min(1),
});
const restaurantAddReqSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  category: Joi.array().required(),
  openTime: Joi.string(),
  closeTime: Joi.string(),
  coverImageLink: Joi.string(),
});
const restaurantModifyReqSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  openTime: Joi.string(),
  closeTime: Joi.string(),
  coverImageLink: Joi.string(),
});

const restaurantGetByFiltered = Joi.object({
  filter: Joi.string().required(),
});

const restaurantGetByDistance = Joi.object({});

const restaurantGetByIdSchema = Joi.object({
  restaurantsId: Joi.string().required(),
});

const restaurantGetByCategorySchema = Joi.object({
  categoryId: Joi.number().required(),
});

const restaurantGetDetailsSchema = Joi.object({
  id: Joi.number().required(),
});

/****************
 * Food section *
 ****************/
const foodGetReqSchema = Joi.object({
  id: Joi.number().required(),
});
const foodAddReqSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  prepareTime: Joi.number(),
  imageLink: Joi.string(),
});
const foodModifyReqSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  prepareTime: Joi.string(),
  imageLink: Joi.string(),
});
const foodRemoveReqSchema = Joi.object({
  id: Joi.number().required(),
});
/*******************
 * Voucher section *
 *******************/
const voucherGetReqSchema = Joi.object({
  idRes: Joi.number(),
});
const voucherAddReqSchema = Joi.object({
  name: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  totalPay: Joi.number().required(),
});
const voucherRemoveReqSchema = Joi.object({
  id: Joi.number().required(),
});

/*******************
 * User section *
 *******************/
const jwtPayloadSchema = Joi.object({
  iss: Joi.string(),
  iat: Joi.number(),
  exp: Joi.number(),
  aud: Joi.number().required(),
});

const userGetFavouriteSchema = Joi.object({});

const userAddFavouriteSchema = Joi.object({
  idRes: Joi.number(),
});

const userDeleteFavouriteSchema = Joi.object({
  idRes: Joi.number(),
});

const userUpdateInfoSchema = Joi.object({
  column: Joi.string().required(),
  updateValue: Joi.string().required(),
});

const userUpdateAddressInfoSchema = Joi.object({
  updateKey: Joi.string().required(),
  updateValue: Joi.object().required(),
});

const userSaveCurrentAddressSchema = Joi.object({
  address: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  building: Joi.string(),
  phoneNumber: Joi.string(),
  port: Joi.string(),
  userNote: Joi.string(),
});

const userGetSearchHistorySchema = Joi.object({
  limit: Joi.number().required(),
});

const userDeleteSearchHistoryByIdSchema = Joi.object({
  id: Joi.number().required(),
});

/*******************
 * Homepage section *
 *******************/
const homePageSearchSchema = Joi.object({
  searchValue: Joi.string().required(),
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(1),
  isSearch: Joi.boolean().required(),
});

/********************
 * Category section *
 ********************/
const categoryGetReqSchema = Joi.object({
  idRes: Joi.number().required(),
});
const categoryAddReqSchema = Joi.object({
  idRes: Joi.number().required(),
  name: Joi.string().required(),
});
const categoryGetPopularSchema = Joi.object({
  limit: Joi.number().required(),
});

/*****************
 * Order section *
 *****************/
const orderGetReqSchema = Joi.object({
  id: Joi.number().required(),
});
const orderGetByStatusReqSchema = Joi.object({
  status: Joi.string().required(),
});
const orderUpdateReqSchema = Joi.object({
  idRes: Joi.number().required(),
});
const orderUpdateStatusReqSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
});
module.exports = {
  authSchema,
  logInSchema,

  restaurantGetReqSchema,
  restaurantAddReqSchema,
  restaurantModifyReqSchema,
  restaurantGetByIdSchema,
  restaurantGetByDistance,
  restaurantGetByFiltered,
  restaurantGetDetailsSchema,
  restaurantGetByCategorySchema,

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
  userUpdateAddressInfoSchema,
  userSaveCurrentAddressSchema,
  userGetSearchHistorySchema,
  userAddFavouriteSchema,
  userDeleteFavouriteSchema,
  userDeleteSearchHistoryByIdSchema,

  homePageSearchSchema,

  categoryGetReqSchema,
  categoryAddReqSchema,
  categoryGetPopularSchema,

  orderGetReqSchema,
  orderUpdateReqSchema,
  orderGetByStatusReqSchema,
  orderUpdateStatusReqSchema,
};
