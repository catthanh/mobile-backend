"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        async isValidPassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
            },
            sequelize,
            modelName: "User",
            tableName: "users",
        }
    );
    return User;
};
