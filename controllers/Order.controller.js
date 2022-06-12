const createError = require("http-errors");

const Restaurant = require("../models").Restaurant;
const Order = require("../models").Order;
const User = require("../models").User;
const {
    orderAddReqSchema,
    orderRemoveReqSchema,
    orderGetReqSchema,
} = require("../helpers/schema_validation");

const internalError = createError.internalError;
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
    getDetail: async (req, res, next) => {
        try {
            await orderGetReqSchema.validateAsync(req.query);
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await orderAddReqSchema.validateAsync(req.body);
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    toShipping: async (req, res, next) => {
        try {
            await orderAddReqSchema.validateAsync(req.body);
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    toPreparing: async (req, res, next) => {
        try {
            await orderAddReqSchema.validateAsync(req.body);
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
    remove: async (req, res, next) => {
        try {
            await orderRemoveReqSchema.validateAsync(req.body);

            res.send(result[0]);
        } catch (error) {
            if (error.isJoi === true) next(createError.BadRequest());
            next(internalError);
        }
    },
};
