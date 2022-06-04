const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Food extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                idRes: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "restaurants",
                        key: "id",
                    },
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                prepareTime: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                imageLink: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "foods",
                timestamps: true,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idRes",
                        using: "BTREE",
                        fields: [{ name: "idRes" }],
                    },
                ],
            }
        );
    }
};
