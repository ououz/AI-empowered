const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// 列表
router.get("/", async (req, res) => {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const [total, itemsRaw] = await Promise.all([
        Post.countDocuments({}),
        Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(pageSize)
    ]);

    const items = await Promise.all(itemsRaw.map(async p => {
        const u = await User.findById(p.userId).select("username avatar");
        const obj = p.toObject();
        obj.author = { username: u?.username || "匿名", avatar: u?.avatar || "" };
        return obj;
    }));

    res.json({ total, page, pageSize, items });
});


// 发布
router.post("/", auth, async (req, res) => {
    const { title, content, tags = [], images = [] } = req.body;
    const post = await Post.create({
        userId: req.user._id,
        title,
        content,
        tags,
        images
    });
    res.json(post);
});


// 今日热帖 (要放在 /:id 前面)
router.get("/hot-today", async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ likesCount: -1, commentsCount: -1, viewsCount: -1 })
            .limit(5);

        const withUser = await Promise.all(
            posts.map(async (p) => {
                const u = await User.findById(p.userId);
                return { ...p.toObject(), user: u };
            })
        );

        res.json(withUser);
    } catch (error) {
        console.error("🔥 /hot-today error:", error); // 这里打印后端错误
        res.status(400).json({ msg: "获取热帖失败", error: error.message });
    }
});

// 详情
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "帖子不存在" });

        await Post.updateOne({ _id: post._id }, { $inc: { viewsCount: 1 } });

        const u = await User.findById(post.userId).select("username avatar");
        const obj = post.toObject();
        obj.author = { username: u?.username || "匿名", avatar: u?.avatar || "" };
        res.json(obj);
    } catch (err) {
        res.status(400).json({ msg: "无效的帖子ID" });
    }
});

// 评论列表
router.get("/:id/comments", async (req, res) => {
    const list = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    // 附加评论用户
    const withUser = await Promise.all(list.map(async c => {
        const u = await User.findById(c.userId).select("username avatar");
        const o = c.toObject();
        o.user = { username: u?.username || "用户", avatar: u?.avatar || "" };
        return o;
    }));
    res.json(withUser);
});

// 发表评论
router.post("/:id/comments", auth, async (req, res) => {
    const { text: content, parentId = null } = req.body;
    const c = await Comment.create({ postId: req.params.id, userId: req.user.id, text, parentId });
    res.json(c);
});


module.exports = router;
