"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderFood extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    OrderFood.init(
        {
            idOrder: {
                type: DataTypes.INTEGER,
            },
            idFood: {
                type: DataTypes.INTEGER,
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "OrderFood",
            tableName: "order_food",
        }
    );
    return OrderFood;
};
