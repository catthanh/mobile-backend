const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Favourite extends Model {
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
                }
            },
            {
                sequelize,
                tableName: "favourites",
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
