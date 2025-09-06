// src/routes/favorite.js
const express = require("express");
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");

const router = express.Router();

// 我的收藏列表 ?type=post|career|course
router.get("/", auth, async (req, res) => {
    const filter = { userId: req.user.id };
    if (req.query.type) filter.type = req.query.type;
    const list = await Favorite.find(filter).sort({ createdAt: -1 });
    res.json(list);
});

// 添加收藏
router.post("/", auth, async (req, res) => {
    const { type, targetId } = req.body;
    const fav = await Favorite.create({ userId: req.user.id, type, targetId });
    res.json(fav);
});

// 取消收藏
router.delete("/", auth, async (req, res) => {
    const { type, targetId } = req.body;
    await Favorite.deleteOne({ userId: req.user.id, type, targetId });
    res.json({ ok: true });
});

module.exports = router;
