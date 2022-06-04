const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class OrderVoucher extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                idOrder: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "orders",
                        key: "id",
                    },
                },
                idVoucher: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "vouchers",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "order_voucher",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idOrder" }, { name: "idVoucher" }],
                    },
                    {
                        name: "idVoucher",
                        using: "BTREE",
                        fields: [{ name: "idVoucher" }],
                    },
                ],
            }
        );
    }
};
