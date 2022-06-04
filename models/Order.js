const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Order extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                idRes: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "restaurants",
                        key: "id",
                    },
                },
                idUser: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                status: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                shippingFee: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                tax: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                subTotal: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                total: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                discount: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                grandTotal: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "orders",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idRes",
                        using: "BTREE",
                        fields: [{ name: "idRes" }],
                    },
                    {
                        name: "idUser",
                        using: "BTREE",
                        fields: [{ name: "idUser" }],
                    },
                ],
            }
        );
    }
};
