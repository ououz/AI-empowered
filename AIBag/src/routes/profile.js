const express = require("express");
const UserProfile = require("../models/UserProfile");
const auth = require("../middleware/auth");
const User = require("../models/User");
const path = require("path");
const multer = require("multer"); // ✅ 补充

const router = express.Router();

// ======================= 获取用户资料 =======================
router.get("/", auth, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user.userId });
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// 获取当前登录用户基础信息
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("username avatar gender");
        if (!user) return res.status(404).json({ msg: "用户不存在" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "服务器错误" });
    }
});

// ======================= 更新或创建用户资料 =======================
router.post("/", auth, async (req, res) => {
    try {
        const data = req.body;
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.user.userId },
            { $set: data },
            { new: true, upsert: true, runValidators: true }
        );
        res.json({ msg: "资料保存成功", profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "保存失败" });
    }
});

// ======================= 保存基本信息 =======================
router.post("/basic", auth, async (req, res) => {
    const { realName, gender, contact, bio } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { realName, gender, contact, bio },
        { upsert: true, new: true }
    );
    res.json({ msg: "基本信息已保存", profile });
});

// ======================= 保存技能 =======================
router.post("/skills", auth, async (req, res) => {
    const { skills } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { skills } },
        { upsert: true, new: true }
    );
    res.json({ msg: "技能已保存", profile });
});

// ======================= 保存教育经历 =======================
router.post("/education", auth, async (req, res) => {
    const { education } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { education } },
        { upsert: true, new: true }
    );
    res.json({ msg: "教育经历已保存", profile });
});

// ======================= 保存工作经历 =======================
router.post("/work", auth, async (req, res) => {
    const { experience } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { experience } },
        { upsert: true, new: true }
    );
    res.json({ msg: "工作经历已保存", profile });
});

// ======================= 文件上传配置 =======================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${req.user.id}${ext}`);
    }
});

const upload = multer({ storage });

// ======================= 上传头像 =======================
router.post("/upload-avatar", auth, upload.single("avatar"), async (req, res) => {
    try {
        const updateData = {};

        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }

        if (req.body.username && req.body.username.trim()) {
            updateData.username = req.body.username.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: "请至少上传头像或填写用户名" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select("username avatar");

        res.json({ msg: "资料更新成功", user });
    } catch (err) {
        console.error("资料更新失败:", err);
        res.status(500).json({ msg: "服务器错误" });
    }
});

module.exports = router;
