// scripts/importLegacyPosts.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Post = require("../../src/models/Post");

async function importPosts() {
    try {
        const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS;
        if (!uri) {
            throw new Error("❌ 未找到数据库连接字符串，请检查 .env 文件是否包含 MONGO_URI_LOCAL 或 MONGO_URI_ATLAS");
        }

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // 使用已有的默认用户 id
        const DEFAULT_USER_ID = "68bc074d2727dda6f58cce25"; // 这里换成你数据库里实际的 ObjectId

        // JSON 文件路径
        const files = [
            path.join(__dirname, "post-0.json"),
            path.join(__dirname, "post-1.json"),
            path.join(__dirname, "post-2.json"),
        ];

        for (const file of files) {
            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            const doc = {
                userId: DEFAULT_USER_ID,
                title: raw.meta.title,
                description: raw.meta.description || "",
                category: raw.meta.category || "",
                tags: raw.meta.tags || [],

                // 作者信息（兼容旧 JSON）
                authorName: raw.meta.author,
                authorAvatar: raw.meta.avatar,
                authorLevel: raw.meta.level,
                postTime: raw.meta.postTime,

                // 内容（直接保存 JSON 的 content 数组）
                content: raw.content || [],

                // 计数
                viewsCount: raw.meta.views || 0,
                likesCount: raw.meta.likes || 0,
                commentsCount: raw.meta.comments || 0,
            };

            const post = await Post.create(doc);
            console.log(`📥 已导入: ${file} -> _id=${post._id}`);
        }

        console.log("🎉 所有 JSON 帖子已导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importPosts();
