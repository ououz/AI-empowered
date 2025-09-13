// src/models/Favorite.js
const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Job", "Post", "Report"], required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "type" },
    createdAt: { type: Date, default: Date.now }
});


FavoriteSchema.index({ user: 1, type: 1, target: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
