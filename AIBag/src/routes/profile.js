const express = require("express");
const UserProfile = require("../models/UserProfile");
const auth = require("../middleware/auth");

const router = express.Router();

// ======================= 获取用户资料 =======================
router.get("/", auth, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user.userId });
        res.json(profile || {}); // 没有就返回空对象
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


// =======================保存技能 =======================
router.post("/skills", auth, async (req, res) => {
    const { skills } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { skills } },
        { upsert: true, new: true }
    );
    res.json({ msg: "技能已保存", profile });
});


// =======================保存教育经历=======================
router.post("/education", auth, async (req, res) => {
    const { education } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { education } },
        { upsert: true, new: true }
    );
    res.json({ msg: "教育经历已保存", profile });
});


// =======================保存工作经历=======================
router.post("/work", auth, async (req, res) => {
    const { experience } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { experience } },
        { upsert: true, new: true }
    );
    res.json({ msg: "工作经历已保存", profile });
});
module.exports = router;
