const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    authorName: String,
    authorAvatar: String,
    authorLevel: String,
    likesCount: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    time: String
}, { timestamps: true });

// ✅ 防止 OverwriteModelError
module.exports = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
