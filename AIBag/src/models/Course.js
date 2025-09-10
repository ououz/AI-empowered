const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    category: { type: String, required: true },     // 一级分类，如 IT技术类
    subcategory: { type: String, required: true },  // 二级分类，如 编程开发
    group: { type: String, required: true },        // 三级分组，如 Python编程基础
    title: { type: String, required: true },        // 课程标题
    description: { type: String },                  // 课程简介
    platform: { type: String },                     // 平台名称，如 B站、慕课网
    platformTag: { type: String },                  // 标签样式 (bilibili / imooc / coursera...)
    imageUrl: { type: String },                     // 封面图片路径
    hours: { type: String },                        // 学时，如 12小时
    tags: { type: [String], default: [] },          // 标签数组，可用于前端 filter
    link: { type: String },                         // 学习链接
    isRecommended: { type: Boolean, default: false } // 是否推荐
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
