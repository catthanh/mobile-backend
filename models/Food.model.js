"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.Order, {
                through: models.OrderFood,
                as: "orders",
                foreignKey: "idFood",
            });
            this.belongsTo(models.Restaurant, {
                foreignKey: "idRes",
                as: "restaurants",
            });
        }
    }
    Food.init(
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
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            prepareTime: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Food",
            tableName: "foods",
        }
    );
    return Food;
};
