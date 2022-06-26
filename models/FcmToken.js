const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class FcmToken extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                idUser: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                token: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: "fcm_token",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id" }],
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
