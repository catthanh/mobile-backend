"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.Food, {
                through: models.OrderFood,
                as: "foods",
                foreignKey: "idOrder",
            });
            this.belongsTo(models.User, {
                foreignKey: "idUser",
                as: "users",
            });
            this.belongsTo(models.Restaurant, {
                foreignKey: "idRes",
                as: "restaurants",
            });
            this.belongsToMany(models.Voucher, {
                through: "order_voucher",
                as: "vouchers",
                foreignKey: "idOrder",
            });
        }
    }
    Order.init(
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
            status: {
                type: DataTypes.STRING,
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
            shippingFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            tax: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            subTotal: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            discount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
            grandTotal: {
                type: DataTypes.FLOAT,
                allowNull: true,
                autoIncrement: false,
                primaryKey: false,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "orders",
        }
    );
    return Order;
};
