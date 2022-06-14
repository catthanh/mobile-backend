const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class UserSearchHistory extends Model {
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
                    primaryKey: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                searchText: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                    onUpdate : DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: "user_search_history",
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
