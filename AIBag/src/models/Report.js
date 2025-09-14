// src/models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户
    answers: { type: Object, required: true }, // 用户所有答案 { 1: { value: 1, type: 'R' }, ... }
    scores: { type: Object, required: true },  // 计算后的分数 { R: 5, I: 3, ... }
    topType: { type: String, required: true }, // 最高得分类型 'R' / 'I' / ...
    top3Types: { type: String, required: true }, // 三个最高得分类型组合 'RIA'
    jobRecommendations: { type: [String], default: [] }, // 推荐职业列表
    createdAt: { type: Date, default: Date.now } // 测评时间
});

// 可根据需要加索引
ReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Report", ReportSchema);
