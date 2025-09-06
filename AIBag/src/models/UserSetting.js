const mongoose = require("mongoose");

const UserSettingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    notifications: { type: Boolean, default: true },
    privacy: { type: String, enum: ["public", "private", "friends"], default: "public" }
}, { timestamps: true });

module.exports = mongoose.model("UserSetting", UserSettingSchema);
