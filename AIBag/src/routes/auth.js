const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require('../models/Post');

const router = express.Router();

// ======================= 注册接口 =======================
router.post("/register", async (req, res) => {
    try {
        const { username, phone, qq, password } = req.body;

        // 动态构造查询条件
        const query = [];
        if (phone) query.push({ phone });
        if (qq) query.push({ qq });

        if (query.length === 0) {
            return res.status(400).json({ error: "手机号或QQ必须填写一个" });
        }

        // 检查是否已注册
        const existingUser = await User.findOne({ $or: query });
        if (existingUser) {
            return res.status(400).json({ error: "手机号或QQ已被注册" });
        }

        // 对密码进行加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = new User({
            phone,
            qq,
            username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ msg: "注册成功", userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 登录接口 =======================
router.post("/login", async (req, res) => {
    try {
        const { account, password } = req.body;

        // 可以用手机号或QQ登录
        const user = await User.findOne({ $or: [{ phone: account }, { qq: account }] });
        if (!user) return res.status(400).json({ error: "用户不存在" });

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "密码错误" });

        // 生成 token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            msg: "登录成功",
            token,
            user: {
                id: user._id,
                username: user.username,
                phone: user.phone,
                qq: user.qq,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================= 获取当前用户信息 =======================
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: "缺少认证信息" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ error: "用户不存在" });

        // 动态统计帖子数
        const postsCount = await Post.countDocuments({ userId: user._id });
        res.json({
            id: user._id,
            username: user.username,
            phone: user.phone,
            qq: user.qq,
            postsCount, // 这里用动态统计
            likes: user.likes || 0,
            studyHours: user.studyHours || 0
        });
    } catch (err) {
        res.status(401).json({ error: "无效或过期的 token" });
    }
});

module.exports = router;
