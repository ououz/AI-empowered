// src/models/Comment.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // 楼中楼
    likesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
