const mongoose = require("mongoose");
const Schema = mongoose.Schema;

RefreshSchema = new Schema({
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
    createdAt: {
        type: Date,
        expires: process.env.REFRESH_TOKEN_EXPIRES_IN,
        default: Date.now,
    },
    blocked: { type: Boolean, default: false },
});

RefreshSchema.methods.blockToken = function () {
    this.blocked = true;
    return this.save();
};

module.exports = mongoose.model("Refresh", RefreshSchema);
