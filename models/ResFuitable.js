const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class ResFuitable extends Model {
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
                idFuitable: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "fuitables",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "res_fuitables",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRes" }, { name: "idFuitable" }],
                    },
                    {
                        name: "idFuitable",
                        using: "BTREE",
                        fields: [{ name: "idFuitable" }],
                    },
                ],
            }
        );
    }
};
