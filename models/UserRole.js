const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class UserRole extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                idRole: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "roles",
                        key: "id",
                    },
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
            },
            {
                sequelize,
                tableName: "user_role",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "idRole" }, { name: "idUser" }],
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
