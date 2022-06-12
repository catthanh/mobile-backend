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
    /**
     * tested ttphuc
     */
    get: async (req, res, next) => {
        try {
            await voucherGetReqSchema.validateAsync(req.query)
            if(req.query?.idRes){
                const vouchers = await Restaurant.findByPk(req.query?.idRes, {
                    include: Voucher
                })
                res.send(vouchers?.Vouchers || [])
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
                next(createError.BadRequest())
            next(internalError);
        }
    },
    /**
     * tested ttphuc
     */
    add: async (req, res, next) => {
        try {
            await voucherAddReqSchema.validateAsync(req.body)

            // const restaurants = await Restaurant.findAll();

            // let index = 1;
            // restaurants.forEach(async (e) => {
            //     const tmp = await Voucher.create({...req.body, name: req.body.name + index});
            //     await e.addVoucher(tmp);
            //     index++;
            // });
            const [voucher, isCreated] = await Voucher.findOrCreate({
                where: {...req.body},
                default: {...req.body}
            });
            if(isCreated) {
                next(createError.BadRequest('voucher existed'));
            }
            res.send(voucher)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    /**
     * tested ttphuc
     */
    remove: async (req, res, next) => {
        try {
            await voucherRemoveReqSchema.validateAsync(req.body)
            const result = await Voucher.destroy({
                where: {
                    id: req.body?.id
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
