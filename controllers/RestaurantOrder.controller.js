const createError = require('http-errors');

const Restaurant = require('../models').Restaurant
const Voucher = require('../models').Voucher
const {
    voucherAddReqSchema,
    voucherRemoveReqSchema,
    voucherGetReqSchema
} = require('../helpers/schema_validation')

const internalError = createError.internalError
module.exports = {
    get: async (req, res, next) => {
        try {
            await voucherGetReqSchema.validateAsync(req.query)
            if(req.query?.idRes){
                const vouchers = await Restaurant.findByPk(req.query?.idRes, {
                    include: 'vouchers'
                })
                res.send(vouchers?.vouchers)
            } else {
                const {pageNumber = 1, pageSize = 100} = req.query
                const vouchers = await Voucher.findAndCountAll({
                    offset: (pageNumber-1)*pageSize,
                    limit: pageSize*1
                })
                res.send(vouchers)
            }
        } catch (error) {
            if (error.isJoi === true)
                Next(createError.BadRequest())
            next(internalError);
        }
    },
    add: async (req, res, next) => {
        try {
            await voucherAddReqSchema.validateAsyn  c(req.body)
            
            const result = await Voucher.create({...req.body})
            res.send(result[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    remove: async (req, res, next) => {
        try {
            await voucherRemoveReqSchema.validateAsync(req.body)
            const result = await Voucher.destroy({
                where: {
                    id: req.body?.id
                }
            })
            res.send(result[0])
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },
};
