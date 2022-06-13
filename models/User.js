const _sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { Model, Sequelize } = _sequelize;

module.exports = class User extends Model {
    async isValidPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                username: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                phoneNumber: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                gender: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                birthday: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                job: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                address: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "users",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id" }],
                    },
                ],
                hooks: {
                    beforeCreate: async (user) => {
                        if (user.password) {
                            const salt = await bcrypt.genSalt(10);
                            user.password = bcrypt.hashSync(
                                user.password,
                                salt
                            );
                        }
                    },
                    beforeUpdate: async (user) => {
                        console.log(user);
                        if (user.password) {
                            const salt = await bcrypt.genSalt(10);
                            user.password = bcrypt.hashSync(
                                user.password,
                                salt
                            );
                        }
                    },
                    beforeBulkUpdate: async (user) => {
                        if (user.attributes.password) {
                            const salt = await bcrypt.genSalt(10);
                            user.attributes.password = bcrypt.hashSync(
                                user.attributes.password,
                                salt
                            );
                        }
                    },
                },
            }
        );
    }
};
