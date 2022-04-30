"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Refresh extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        blockToken() {
            this.blocked = true;
            return this.save();
        }
    }
    Refresh.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            jti: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            previousToken: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: DataTypes.NOW,
            },
            blocked: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: false,
            },
        },

        {
            sequelize,
            modelName: "Refresh",
            tableName: "refreshes",
        }
    );
    return Refresh;
};
