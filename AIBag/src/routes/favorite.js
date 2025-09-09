// src/routes/favorite.js
const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Post = require("../models/Post");
// 测评报告模型假设为 Report
const Report = require("../models/Report");
const mongoose = require("mongoose");

// 收藏
router.post("/:type/:id", auth, async (req, res) => {
    const { type, id } = req.params;
    console.log('收到收藏请求ID:', id, typeof id, id.length);

    if (!["job", "post", "report"].includes(type))
        return res.status(400).json({ error: "类型错误" });

    let objectId;

    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            objectId = new mongoose.Types.ObjectId(id);
        } else {
            let Model;
            if (type === "job") Model = require("../models/Job");
            if (type === "post") Model = require("../models/Post");
            if (type === "report") Model = require("../models/Report");

            const target = await Model.findOne({ slug: id });
            if (!target) return res.status(400).json({ error: "找不到对应对象" });
            objectId = target._id;
        }
    } catch (e) {
        console.error('ObjectId转换失败:', e);
        return res.status(400).json({ error: "ID格式错误" });
    }

    const exists = await Favorite.findOne({ user: req.user._id, type, target: objectId });
    if (exists) return res.json({ success: true, message: "已收藏" });

    await Favorite.create({ user: req.user._id, type, target: objectId });
    res.json({ success: true });
});


// 获取收藏列表
router.get("/:type", auth, async (req, res) => {
    const { type } = req.params;
    if (!["job", "post", "report"].includes(type)) return res.status(400).json({ error: "类型错误" });
    let populateModel = null;
    if (type === "job") populateModel = Job;
    if (type === "post") populateModel = Post;
    if (type === "report") populateModel = Report;
    const favorites = await Favorite.find({ user: req.user._id, type }).populate("target");
    res.json({ favorites });
});

module.exports = router;
