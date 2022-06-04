const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class OrderFood extends Model {
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
                idFood: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "foods",
                        key: "id",
                    },
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "order_food",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idOrder" }, { name: "idFood" }],
                    },
                    {
                        name: "idFood",
                        using: "BTREE",
                        fields: [{ name: "idFood" }],
                    },
                ],
            }
        );
    }
};
