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
    ResCuisine.belongsTo(Cuisine, { foreignKey: "idCuisine" });
    Cuisine.hasMany(ResCuisine, { foreignKey: "idCuisine" });
    OrderFood.belongsTo(Food, { foreignKey: "idFood" });
    Food.hasMany(OrderFood, { foreignKey: "idFood" });
    ResFuitable.belongsTo(Fuitable, { foreignKey: "idFuitable" });
    Fuitable.hasMany(ResFuitable, { foreignKey: "idFuitable" });
    ResCategory.belongsTo(LocationCategory, { foreignKey: "idCategory" });
    LocationCategory.hasMany(ResCategory, { foreignKey: "idCategory" });
    OrderFood.belongsTo(Order, { foreignKey: "idOrder" });
    Order.hasMany(OrderFood, { foreignKey: "idOrder" });
    OrderVoucher.belongsTo(Order, { foreignKey: "idOrder" });
    Order.hasMany(OrderVoucher, { foreignKey: "idOrder" });
    Food.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(Food, { foreignKey: "idRes" });
    Order.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(Order, { foreignKey: "idRes" });
    ResCategory.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(ResCategory, { foreignKey: "idRes" });
    ResCuisine.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(ResCuisine, { foreignKey: "idRes" });
    ResFuitable.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(ResFuitable, { foreignKey: "idRes" });
    ResServingTime.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(ResServingTime, { foreignKey: "idRes" });
    ResSuitable.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(ResSuitable, { foreignKey: "idRes" });
    Review.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(Review, { foreignKey: "idRes" });
    Voucher.belongsTo(Restaurant, { foreignKey: "idRes" });
    Restaurant.hasMany(Voucher, { foreignKey: "idRes" });
    UserRole.belongsTo(Role, { foreignKey: "idRole" });
    Role.hasMany(UserRole, { foreignKey: "idRole" });
    ResServingTime.belongsTo(ServingTime, { foreignKey: "idServingTime" });
    ServingTime.hasMany(ResServingTime, { foreignKey: "idServingTime" });
    ResSuitable.belongsTo(Suitable, { foreignKey: "idSuitable" });
    Suitable.hasMany(ResSuitable, { foreignKey: "idSuitable" });
    Order.belongsTo(User, { foreignKey: "idUser" });
    User.hasMany(Order, { foreignKey: "idUser" });
    Review.belongsTo(User, { foreignKey: "idUser" });
    User.hasMany(Review, { foreignKey: "idUser" });
    UserRole.belongsTo(User, { foreignKey: "idUser" });
    User.hasMany(UserRole, { foreignKey: "idUser" });
    OrderVoucher.belongsTo(Voucher, { foreignKey: "idVoucher" });
    Voucher.hasMany(OrderVoucher, { foreignKey: "idVoucher" });

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
