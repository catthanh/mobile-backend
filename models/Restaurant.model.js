"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Restaurant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Food, {
                foreignKey: "idRes",
                as: "foods",
            });
            this.hasMany(models.Review, {
                foreignKey: "idRes",
                as: "reviews",
            });
            this.hasMany(models.Order, {
                foreignKey: "idRes",
                as: "orders",
            });
            this.hasMany(models.Voucher, {
                foreignKey: "idRes",
                as: "vouchers",
            });
            this.belongsTo(models.User, {
                foreignKey: "idUser",
                as: "users",
            });
        }
    }
    Restaurant.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            idUser: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: false,
                primaryKey: false,
            },
            avgRating: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            totalReviews: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            totalFavourites: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            totalViews: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            priceRange: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            qualityScore: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            serviceScore: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            spaceScore: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            priceScore: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            locationScore: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            openTime: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            closeTime: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            longtitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            preparationTime: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            category: {
                type: DataTypes.JSON,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            fit: {
                type: DataTypes.JSON,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            capacity: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            cuisines: {
                type: DataTypes.JSON,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            suitable: {
                type: DataTypes.JSON,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            fuitable: {
                type: DataTypes.JSON,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Restaurant",
            tableName: "restaurants",
        }
    );
    return Restaurant;
};
