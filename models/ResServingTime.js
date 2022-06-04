const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class ResServingTime extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                idRes: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "restaurants",
                        key: "id",
                    },
                },
                idServingTime: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "serving_time",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "res_serving_time",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRes" }, { name: "idServingTime" }],
                    },
                    {
                        name: "idServingTime",
                        using: "BTREE",
                        fields: [{ name: "idServingTime" }],
                    },
                ],
            }
        );
    }
};
