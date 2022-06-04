const _sequelize = require("sequelize");
const { Model, Sequelize } = _sequelize;

module.exports = class Refresh extends Model {
    blockToken() {
        this.blocked = true;
        return this.save();
    }
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                jti: {
                    type: DataTypes.CHAR(36),
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                previousToken: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                token: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                expiresAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                blocked: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: "refreshes",
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
