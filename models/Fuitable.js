const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Fuitable extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    unique: true,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "fuitables",
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
