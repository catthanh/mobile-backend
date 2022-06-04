const _sequelize = require("sequelize");
const DataTypes = _sequelize.DataTypes;
const _Cuisine = require("./Cuisine.js");
const _Food = require("./Food.js");
const _Fuitable = require("./Fuitable.js");
const _LocationCategory = require("./LocationCategory.js");
const _OrderFood = require("./OrderFood.js");
const _OrderVoucher = require("./OrderVoucher.js");
const _Order = require("./Order.js");
const _Refresh = require("./Refresh.js");
const _ResCategory = require("./ResCategory.js");
const _ResCuisine = require("./ResCuisine.js");
const _ResFuitable = require("./ResFuitable.js");
const _ResServingTime = require("./ResServingTime.js");
const _ResSuitable = require("./ResSuitable.js");
const _Restaurant = require("./Restaurant.js");
const _Review = require("./Review.js");
const _Role = require("./Role.js");
const _ServingTime = require("./ServingTime.js");
const _Suitable = require("./Suitable.js");
const _UserRole = require("./UserRole.js");
const _User = require("./User.js");
const _Voucher = require("./Voucher.js");

module.exports = function initModels(sequelize) {
    const Cuisine = _Cuisine.init(sequelize, DataTypes);
    const Food = _Food.init(sequelize, DataTypes);
    const Fuitable = _Fuitable.init(sequelize, DataTypes);
    const LocationCategory = _LocationCategory.init(sequelize, DataTypes);
    const OrderFood = _OrderFood.init(sequelize, DataTypes);
    const OrderVoucher = _OrderVoucher.init(sequelize, DataTypes);
    const Order = _Order.init(sequelize, DataTypes);
    const Refresh = _Refresh.init(sequelize, DataTypes);
    const ResCategory = _ResCategory.init(sequelize, DataTypes);
    const ResCuisine = _ResCuisine.init(sequelize, DataTypes);
    const ResFuitable = _ResFuitable.init(sequelize, DataTypes);
    const ResServingTime = _ResServingTime.init(sequelize, DataTypes);
    const ResSuitable = _ResSuitable.init(sequelize, DataTypes);
    const Restaurant = _Restaurant.init(sequelize, DataTypes);
    const Review = _Review.init(sequelize, DataTypes);
    const Role = _Role.init(sequelize, DataTypes);
    const ServingTime = _ServingTime.init(sequelize, DataTypes);
    const Suitable = _Suitable.init(sequelize, DataTypes);
    const UserRole = _UserRole.init(sequelize, DataTypes);
    const User = _User.init(sequelize, DataTypes);
    const Voucher = _Voucher.init(sequelize, DataTypes);

    Cuisine.belongsToMany(Restaurant, {
        as: "idRes_restaurants_res_cuisines",
        through: ResCuisine,
        foreignKey: "idCuisine",
        otherKey: "idRes",
    });
    Food.belongsToMany(Order, {
        as: "idOrder_orders",
        through: OrderFood,
        foreignKey: "idFood",
        otherKey: "idOrder",
    });
    Fuitable.belongsToMany(Restaurant, {
        as: "idRes_restaurants_res_fuitables",
        through: ResFuitable,
        foreignKey: "idFuitable",
        otherKey: "idRes",
    });
    LocationCategory.belongsToMany(Restaurant, {
        as: "idRes_restaurants",
        through: ResCategory,
        foreignKey: "idCategory",
        otherKey: "idRes",
    });
    Order.belongsToMany(Food, {
        as: "idFood_foods",
        through: OrderFood,
        foreignKey: "idOrder",
        otherKey: "idFood",
    });
    Order.belongsToMany(Voucher, {
        as: "idVoucher_vouchers",
        through: OrderVoucher,
        foreignKey: "idOrder",
        otherKey: "idVoucher",
    });
    Restaurant.belongsToMany(Cuisine, {
        as: "idCuisine_cuisines",
        through: ResCuisine,
        foreignKey: "idRes",
        otherKey: "idCuisine",
    });
    Restaurant.belongsToMany(Fuitable, {
        as: "idFuitable_fuitables",
        through: ResFuitable,
        foreignKey: "idRes",
        otherKey: "idFuitable",
    });
    Restaurant.belongsToMany(LocationCategory, {
        as: "idCategory_location_categories",
        through: ResCategory,
        foreignKey: "idRes",
        otherKey: "idCategory",
    });
    Restaurant.belongsToMany(ServingTime, {
        as: "idServingTime_serving_times",
        through: ResServingTime,
        foreignKey: "idRes",
        otherKey: "idServingTime",
    });
    Restaurant.belongsToMany(Suitable, {
        as: "idSuitable_suitables",
        through: ResSuitable,
        foreignKey: "idRes",
        otherKey: "idSuitable",
    });
    Role.belongsToMany(User, {
        as: "idUser_users",
        through: UserRole,
        foreignKey: "idRole",
        otherKey: "idUser",
    });
    ServingTime.belongsToMany(Restaurant, {
        as: "idRes_restaurants_res_serving_times",
        through: ResServingTime,
        foreignKey: "idServingTime",
        otherKey: "idRes",
    });
    Suitable.belongsToMany(Restaurant, {
        as: "idRes_restaurants_res_suitables",
        through: ResSuitable,
        foreignKey: "idSuitable",
        otherKey: "idRes",
    });
    User.belongsToMany(Role, {
        as: "idRole_roles",
        through: UserRole,
        foreignKey: "idUser",
        otherKey: "idRole",
    });
    Voucher.belongsToMany(Order, {
        as: "idOrder_orders_order_vouchers",
        through: OrderVoucher,
        foreignKey: "idVoucher",
        otherKey: "idOrder",
    });
    ResCuisine.belongsTo(Cuisine, {
        as: "idCuisine_cuisine",
        foreignKey: "idCuisine",
    });
    Cuisine.hasMany(ResCuisine, {
        as: "res_cuisines",
        foreignKey: "idCuisine",
    });
    OrderFood.belongsTo(Food, { as: "idFood_food", foreignKey: "idFood" });
    Food.hasMany(OrderFood, { as: "order_foods", foreignKey: "idFood" });
    ResFuitable.belongsTo(Fuitable, {
        as: "idFuitable_fuitable",
        foreignKey: "idFuitable",
    });
    Fuitable.hasMany(ResFuitable, {
        as: "res_fuitables",
        foreignKey: "idFuitable",
    });
    ResCategory.belongsTo(LocationCategory, {
        as: "idCategory_location_category",
        foreignKey: "idCategory",
    });
    LocationCategory.hasMany(ResCategory, {
        as: "res_categories",
        foreignKey: "idCategory",
    });
    OrderFood.belongsTo(Order, { as: "idOrder_order", foreignKey: "idOrder" });
    Order.hasMany(OrderFood, { as: "order_foods", foreignKey: "idOrder" });
    OrderVoucher.belongsTo(Order, {
        as: "idOrder_order",
        foreignKey: "idOrder",
    });
    Order.hasMany(OrderVoucher, {
        as: "order_vouchers",
        foreignKey: "idOrder",
    });
    Food.belongsTo(Restaurant, { as: "idRes_restaurant", foreignKey: "idRes" });
    Restaurant.hasMany(Food, { as: "foods", foreignKey: "idRes" });
    Order.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(Order, { as: "orders", foreignKey: "idRes" });
    ResCategory.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(ResCategory, {
        as: "res_categories",
        foreignKey: "idRes",
    });
    ResCuisine.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(ResCuisine, { as: "res_cuisines", foreignKey: "idRes" });
    ResFuitable.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(ResFuitable, {
        as: "res_fuitables",
        foreignKey: "idRes",
    });
    ResServingTime.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(ResServingTime, {
        as: "res_serving_times",
        foreignKey: "idRes",
    });
    ResSuitable.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(ResSuitable, {
        as: "res_suitables",
        foreignKey: "idRes",
    });
    Review.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(Review, { as: "reviews", foreignKey: "idRes" });
    Voucher.belongsTo(Restaurant, {
        as: "idRes_restaurant",
        foreignKey: "idRes",
    });
    Restaurant.hasMany(Voucher, { as: "vouchers", foreignKey: "idRes" });
    UserRole.belongsTo(Role, { as: "idRole_role", foreignKey: "idRole" });
    Role.hasMany(UserRole, { as: "user_roles", foreignKey: "idRole" });
    ResServingTime.belongsTo(ServingTime, {
        as: "idServingTime_serving_time",
        foreignKey: "idServingTime",
    });
    ServingTime.hasMany(ResServingTime, {
        as: "res_serving_times",
        foreignKey: "idServingTime",
    });
    ResSuitable.belongsTo(Suitable, {
        as: "idSuitable_suitable",
        foreignKey: "idSuitable",
    });
    Suitable.hasMany(ResSuitable, {
        as: "res_suitables",
        foreignKey: "idSuitable",
    });
    Order.belongsTo(User, { as: "idUser_user", foreignKey: "idUser" });
    User.hasMany(Order, { as: "orders", foreignKey: "idUser" });
    Review.belongsTo(User, { as: "idUser_user", foreignKey: "idUser" });
    User.hasMany(Review, { as: "reviews", foreignKey: "idUser" });
    UserRole.belongsTo(User, { as: "idUser_user", foreignKey: "idUser" });
    User.hasMany(UserRole, { as: "user_roles", foreignKey: "idUser" });
    OrderVoucher.belongsTo(Voucher, {
        as: "idVoucher_voucher",
        foreignKey: "idVoucher",
    });
    Voucher.hasMany(OrderVoucher, {
        as: "order_vouchers",
        foreignKey: "idVoucher",
    });

    return {
        Cuisine,
        Food,
        Fuitable,
        LocationCategory,
        OrderFood,
        OrderVoucher,
        Order,
        Refresh,
        ResCategory,
        ResCuisine,
        ResFuitable,
        ResServingTime,
        ResSuitable,
        Restaurant,
        Review,
        Role,
        ServingTime,
        Suitable,
        UserRole,
        User,
        Voucher,
    };
};
