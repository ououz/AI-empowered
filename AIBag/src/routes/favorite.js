// src/routes/favorite.js
const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Post = require("../models/Post");
const Report = require("../models/Report");
const mongoose = require("mongoose");

// ======================= 收藏 =======================
router.post("/:type/:id", auth, async (req, res) => {
    const { type, id } = req.params;
    console.log("收到收藏请求:", type, id);
    console.log("当前登录用户:", req.user);

    // 转换 type 为大写（和 FavoriteSchema.enum 一致）
    const typeMap = {
        job: "Job",
        post: "Post",
        report: "Report"
    };
    const ModelType = typeMap[type];
    if (!ModelType) return res.status(400).json({ error: "类型错误" });

    let objectId;
    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            objectId = id;
        } else {
            let Model;
            if (type === "job") Model = Job;
            if (type === "post") Model = Post;
            if (type === "report") Model = Report;

            const target = await Model.findOne({ slug: id });
            if (!target) return res.status(400).json({ error: "找不到对应对象" });
            objectId = target._id;
        }
    } catch (e) {
        console.error("ObjectId转换失败:", e);
        return res.status(400).json({ error: "ID格式错误" });
    }

    try {
        const exists = await Favorite.findOne({
            user: req.user._id,
            type: ModelType,
            target: objectId
        });
        if (exists) return res.json({ success: true, message: "已收藏" });

        await Favorite.create({
            user: req.user._id,
            type: ModelType,
            target: objectId
        });

        res.json({ success: true });
    } catch (err) {
        console.error("收藏失败:", err);
        res.status(500).json({ error: "收藏失败" });
    }
});

// ======================= 获取收藏列表 =======================
router.get("/:type", auth, async (req, res) => {
    const { type } = req.params;
    const typeMap = {
        job: "Job",
        post: "Post",
        report: "Report"
    };
    const ModelType = typeMap[type];
    if (!ModelType) return res.status(400).json({ error: "类型错误" });

    try {
        const favorites = await Favorite.find({
            user: req.user._id,
            type: ModelType
        }).populate("target");

        res.json({ favorites });
    } catch (err) {
        console.error("获取收藏失败:", err);
        res.status(500).json({ error: "获取收藏失败" });
    }
});

module.exports = router;
