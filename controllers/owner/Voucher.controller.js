const createError = require('http-errors');

const Voucher = require('../../models').Voucher
const {
    voucherAddReqSchema,
    voucherRemoveReqSchema
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
            const vouchers = await Voucher.findAndCountAll({
                offset: (pageNumber-1)*pageSize,
                limit: pageSize*1,
                where: {
                    idRes: restaurant.id
                }
            })
            res.send(vouchers)
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest())
            next(internalError);
        }
    },
    /**
     * tested
     * phuc
     */
    getById: async (req, res, next) => {
        try {
            const { restaurant } = req.payload;
            const { id: voucherId } = req.params;
            const vouchers = await Voucher.findAndCountAll({
                where: {
                    idRes: restaurant.id
                }
            })
            res.send(vouchers?.rows.find(e => e.dataValues.id === parseInt(voucherId)) || null)
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
            const { restaurant } = req.payload
            const [voucher, isCreated] = await Voucher.findOrCreate({
                where: {...req.body, idRes: restaurant.id},
                default: {...req.body, idRes: restaurant.id}
            });
            if(!isCreated) {
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
    delete: async (req, res, next) => {
        try {
            await voucherRemoveReqSchema.validateAsync(req.params);
            const { id } = req.params;
            const { restaurant } = req.payload;
            const result = await Voucher.destroy({
                where: {
                    id: id,
                    idRes: restaurant.id
                }
            })
            if(result) {
                res.send("success");
            } else {
                next(createError.NotFound("food not found"));
            }
        } catch (error) {
            if (error.isJoi === true)
                next(createError.BadRequest());
            next(internalError);
        }
    },

};
