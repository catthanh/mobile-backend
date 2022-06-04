const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Restaurant extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                idUser: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                avgRating: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                totalReviews: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                totalFavourites: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                totalViews: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                priceRange: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                qualityScore: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                serviceScore: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                spaceScore: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                priceScore: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                locationScore: {
                    type: DataTypes.DECIMAL(2, 1),
                    allowNull: true,
                },
                openTime: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                closeTime: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                latitude: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                longtitude: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                preparationTime: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                category: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                fit: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                capacity: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                cuisines: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                suitable: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                fuitable: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                coverImageLink: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "restaurants",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
};
