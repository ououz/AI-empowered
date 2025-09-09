// models/User.js
const mongoose = require("mongoose");

// 定义用户 Schema
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true, // 去掉前后空格
        },
        phone: {
            type: String,
            unique: true,
            sparse: true, // 允许 null，但不能重复
            match: [/^1[3-9]\d{9}$/, "请输入正确的手机号"], // 简单的手机号正则
        },
        qq: {
            type: String,
            unique: true,
            sparse: true,
            match: [/^[1-9][0-9]{4,11}$/, "请输入正确的 QQ 号"],
        },
        password: {
            type: String,
            required: true, // 存储 bcrypt 哈希后的密码
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            default: "uploads/default_avatar.png", // 默认头像
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        studyTime: { type: Number, default: 0 }, // 学习时长（分钟）

    },
    {
        timestamps: true, // 自动加 createdAt / updatedAt
    }
);

module.exports = mongoose.model("User", UserSchema);
