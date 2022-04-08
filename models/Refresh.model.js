const mongoose = require("mongoose");
const Schema = mongoose.Schema;

RefreshSchema = new Schema(
    {
        jti: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Refresh", RefreshSchema);
