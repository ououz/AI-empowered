const express = require("express");
const Ad = require("../models/Ad");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// 广告列表分页
router.post("/", auth, async (req, res) => {
    try {
        const { title, description = "", content = [], tags = [], link, type } = req.body;
        if (!["main", "secondary"].includes(type)) {
            return res.status(400).json({ msg: "广告类型必须是 main 或 secondary" });
        }
        const ad = await Ad.create({ authorId: req.user.id, title, description, content, tags, link, type });
        res.json(ad);
    } catch (err) {
        console.error("🔥 /ads POST error:", err);
        res.status(400).json({ msg: "发布广告失败", error: err.message });
    }
});


// 获取主推文（只返回两个）
router.get("/main", async (req, res) => {
    try {
        const ads = await Ad.find({ type: "main" })
            .sort({ postTime: -1 })
            .limit(2); // 主推文只取最新两个

        const withUser = await Promise.all(
            ads.map(async ad => {
                const u = await User.findById(ad.authorId);
                return { ...ad.toObject(), author: { username: u?.username || "匿名", avatar: u?.avatar || "" } };
            })
        );

        res.json(withUser);
    } catch (err) {
        console.error("🔥 /ads/main error:", err);
        res.status(500).json({ msg: "获取主推文失败", error: err.message });
    }
});

// 获取次推文（只返回三个）
router.get("/secondary", async (req, res) => {
    try {
        const ads = await Ad.find({ type: "secondary" })
            .sort({ postTime: -1 })
            .limit(3); // 次推文只取最新三个

        const withUser = await Promise.all(
            ads.map(async ad => {
                const u = await User.findById(ad.authorId);
                return { ...ad.toObject(), author: { username: u?.username || "匿名", avatar: u?.avatar || "" } };
            })
        );

        res.json(withUser);
    } catch (err) {
        console.error("🔥 /ads/secondary error:", err);
        res.status(500).json({ msg: "获取次推文失败", error: err.message });
    }
});


// 删除广告
router.delete("/:id", auth, async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);
        if (!ad) return res.status(404).json({ msg: "广告不存在" });
        res.json({ msg: "广告删除成功" });
    } catch (err) {
        console.error("🔥 /ads/:id DELETE error:", err);
        res.status(400).json({ msg: "删除广告失败", error: err.message });
    }
});

// 广告详情
router.get("/:id", async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ msg: "广告不存在" });

        await Ad.updateOne({ _id: ad._id }, { $inc: { viewsCount: 1 } });

        const u = await User.findById(ad.authorId).select("username avatar");
        const obj = ad.toObject();
        obj.author = { username: u?.username || "匿名", avatar: u?.avatar || "" };
        res.json(obj);
    } catch (err) {
        res.status(400).json({ msg: "无效的广告ID", error: err.message });
    }
});

module.exports = router;
