// src/models/Favorite.js
const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["career", "course", "post"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
});

// 防止同一用户对同一对象重复收藏
FavoriteSchema.index({ userId: 1, type: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
