const mongoose = require("mongoose");

// 广告内容子 Schema（兼容 JSON 富文本）
const ContentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // header / paragraph / list / quote / image
    title: String,   // header 专用
    text: String,    // 段落或引用
    items: [String], // 列表
    src: String,     // 图片地址
    alt: String,
    caption: String
}, { _id: false });

const adSchema = new mongoose.Schema({
    // 广告来源或发布账号
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 广告基本信息
    title: { type: String, required: true },
    description: String, // 简短介绍
    link: { type: String, required: true }, // "立即了解"跳转链接
    tags: [String], // 广告标签，例如：招聘信息、活动预告

    // 广告操作按钮类型（可选显示）
    actions: [
        {
            type: { type: String, required: true }, // "learnMore" / "bookNow" / "watchReplay" / "share"
            label: String, // 按钮显示文字，例如“立即了解”、“预约参加”
            url: String // 对应跳转链接（非必填，可用于 learnMore 或 bookNow）
        }
    ],

    // 广告内容（富文本）
    content: [ContentSchema],

    // 数据统计（可选）
    viewsCount: { type: Number, default: 0 },
    clicksCount: { type: Number, default: 0 },

    // 发布时间
    postTime: { type: Date, default: Date.now },

    type: { type: String, enum: ["main", "secondary"], default: "secondary" } // 新增字段
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);
