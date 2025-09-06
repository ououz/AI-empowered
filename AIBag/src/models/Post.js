// src/models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },   // 可存 HTML/Markdown
    tags: [String],
    images: [String],
    likesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
