const mongoose = require("mongoose");

// 子 schema：文章内容（兼容 JSON 的结构）
const ContentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // header / paragraph / list / quote / image
    title: String,   // header 专用
    text: String,    // 段落、引用
    items: [String], // 列表
    src: String,     // 图片地址
    alt: String,
    caption: String
}, { _id: false });

const postSchema = new mongoose.Schema({
    // 关联用户
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 基本信息
    title: { type: String, required: true },
    description: String,   // 摘要
    category: String,
    tags: [String],

    // 内容（富文本结构，兼容 JSON）
    content: [ContentSchema],

    // 冗余计数
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },


    // 发帖时间
    postTime: String
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
