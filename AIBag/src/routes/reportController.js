const express = require("express");
const router = express.Router();

// 获取帖子列表（示例）
router.get("/", (req, res) => {
    res.json({
        msg: "这里是帖子接口",
        posts: [],
    });
});

module.exports = router;
