// scripts/importComments.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Comment = require("../../src/models/Comment");
const Post = require("../../src/models/Post");

async function importComments() {
    try {
        const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS;
        if (!uri) throw new Error("❌ 未找到数据库连接字符串，请检查 .env");

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // 默认用户 ID
        const DEFAULT_USER_ID = "68bc074d2727dda6f58cce25";

        // JSON 文件路径
        const files = [
            path.join(__dirname, "post-0.json"),
            path.join(__dirname, "post-1.json"),
            path.join(__dirname, "post-2.json"),
        ];

        for (const file of files) {
            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            // 找到对应 Post
            const post = await Post.findOne({ title: raw.meta.title });
            if (!post) {
                console.warn(`⚠️ 未找到对应 Post: ${raw.meta.title}`);
                continue;
            }

            if (!raw.comments || raw.comments.length === 0) continue;

            for (const c of raw.comments) {
                const mainComment = await Comment.create({
                    postId: post._id,
                    userId: DEFAULT_USER_ID,
                    text: c.text,
                    likesCount: c.likes || 0,
                    authorName: c.author,
                    authorAvatar: c.avatar,
                    authorLevel: c.level,
                    time: c.time
                });

                // 如果有 replies，作为子评论插入
                if (c.replies && c.replies.length > 0) {
                    for (const r of c.replies) {
                        await Comment.create({
                            postId: post._id,
                            userId: DEFAULT_USER_ID,
                            text: r.text,
                            parentId: mainComment._id,
                            authorName: r.author,
                            time: r.time
                        });
                    }
                }
            }

            console.log(`📥 已导入评论 -> ${raw.meta.title}`);
        }

        console.log("🎉 所有评论导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importComments();
