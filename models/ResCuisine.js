const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class ResCuisine extends Model {
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
                idCuisine: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "cuisines",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "res_cuisines",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRes" }, { name: "idCuisine" }],
                    },
                    {
                        name: "idCuisine",
                        using: "BTREE",
                        fields: [{ name: "idCuisine" }],
                    },
                ],
            }
        );
    }
};
