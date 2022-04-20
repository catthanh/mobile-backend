"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: "idUser",
                as: "users",
            });

            this.belongsTo(models.Restaurant, {
                foreignKey: "idRes",
                as: "restaurants",
            });
        }
    }
    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            idRes: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            idUser: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            totalLikes: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Review",
            tableName: "reviews",
        }
    );
    return Review;
};
