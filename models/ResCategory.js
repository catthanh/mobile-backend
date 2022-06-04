const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class ResCategory extends Model {
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
                idCategory: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "location_categories",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "res_categories",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRes" }, { name: "idCategory" }],
                    },
                    {
                        name: "idCategory",
                        using: "BTREE",
                        fields: [{ name: "idCategory" }],
                    },
                ],
            }
        );
    }
};
