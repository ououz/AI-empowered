// src/models/Favorite.js
const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["job", "post", "report"], required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'type' }, // 收藏对象ID
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
