const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");

// 创建/提交测评
router.post("/", auth, async (req, res) => {
    const { answers, scores, topType, top3Types, jobRecommendations } = req.body;
    try {
        const report = await Report.create({
            user: req.user._id,
            answers,
            scores,
            topType,
            top3Types,
            jobRecommendations
        });
        res.json({ success: true, report });
    } catch (err) {
        console.error("创建测评失败:", err);
        res.status(500).json({ error: "创建测评失败" });
    }
});

// 获取用户测评列表
router.get("/", auth, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ reports });
    } catch (err) {
        console.error("获取测评失败:", err);
        res.status(500).json({ error: "获取测评失败" });
    }
});

// 获取单个报告
router.get("/:id", auth, async (req, res) => {
    console.log("请求的 reportId:", req.params.id, "用户:", req.user._id);
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) {
            console.log("报告未找到");
            return res.status(404).json({ error: "报告未找到" });
        }
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "获取报告失败" });
    }
});


module.exports = router;
