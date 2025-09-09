const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// ======================= 获取所有职位 =======================
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 根据分类获取职位 =======================
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const jobs = await Job.find({ category }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 根据 slug 获取职位详情 =======================
router.get("/slug/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const job = await Job.findOne({ slug });
        if (!job) return res.status(404).json({ error: "职位不存在" });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 创建新职位 =======================
router.post("/", async (req, res) => {
    try {
        const { slug, title, salary, contactPhone, experience, education, company, location, description, requirements, category } = req.body;
        const existing = await Job.findOne({ slug });
        if (existing) return res.status(400).json({ error: "该职位标识已存在" });

        const newJob = new Job({ slug, title, salary, contactPhone, experience, education, company, location, description, requirements, category });
        await newJob.save();
        res.status(201).json({ msg: "职位创建成功", job: newJob });
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 更新职位 =======================
router.put("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const updatedJob = await Job.findOneAndUpdate({ slug }, req.body, { new: true });
        if (!updatedJob) return res.status(404).json({ error: "职位不存在" });
        res.json({ msg: "职位更新成功", job: updatedJob });
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 删除职位 =======================
router.delete("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const deleted = await Job.findOneAndDelete({ slug });
        if (!deleted) return res.status(404).json({ error: "职位不存在" });
        res.json({ msg: "职位删除成功" });
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

module.exports = router;
