// scripts/importFavoriteJobs.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Favorite = require("../../src/models/Favorite");

async function importFavorites() {
    try {
        const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS;
        if (!uri) {
            throw new Error("❌ 未找到数据库连接字符串，请检查 .env 文件是否包含 MONGO_URI_LOCAL 或 MONGO_URI_ATLAS");
        }

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // JSON 文件路径
        const files = [
            path.join(__dirname, "favoritejob-0.json")
        ];

        for (const file of files) {
            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            const doc = {
                user: raw.user,
                type: raw.type,
                target: raw.target,
                createdAt: raw.createdAt || new Date()
            };

            const favorite = await Favorite.create(doc);
            console.log(`📥 已导入收藏: ${favorite.type} -> targetId=${favorite.target}`);
        }

        console.log("🎉 所有收藏已导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importFavorites();
