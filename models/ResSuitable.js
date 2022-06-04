const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class ResSuitable extends Model {
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
                idSuitable: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "suitables",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "res_suitables",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRes" }, { name: "idSuitable" }],
                    },
                    {
                        name: "idSuitable",
                        using: "BTREE",
                        fields: [{ name: "idSuitable" }],
                    },
                ],
            }
        );
    }
};
