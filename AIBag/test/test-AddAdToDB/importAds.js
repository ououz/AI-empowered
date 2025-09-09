// scripts/importAds.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Ad = require("../../src/models/Ad"); // 确保路径和模型名称正确

async function importAds() {
    try {
        const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS;
        if (!uri) {
            throw new Error("❌ 未找到数据库连接字符串，请检查 .env 文件是否包含 MONGO_URI_LOCAL 或 MONGO_URI_ATLAS");
        }

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // 使用已有的默认用户 id
        const DEFAULT_USER_ID = "68bc074d2727dda6f58cce25"; // 数据库实际 ObjectId

        // JSON 文件路径列表
        const files = [
            path.join(__dirname, "ad-0.json"),
            path.join(__dirname, "ad-1.json"),
            path.join(__dirname, "ad-2.json"),
            path.join(__dirname, "ad-3.json"),
            path.join(__dirname, "ad-4.json"),
        ];

        for (const file of files) {
            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            const doc = {
                authorId: DEFAULT_USER_ID,
                title: raw.title,
                description: raw.description || "",
                link: raw.link,
                tags: raw.tags || [],
                type: raw.type,
                actions: raw.actions || [],
                content: raw.content || [],
                viewsCount: raw.viewsCount || 0,
                clicksCount: raw.clicksCount || 0,
                postTime: raw.postTime || new Date()
            };

            const ad = await Ad.create(doc);
            console.log(`📥 已导入广告: ${file} -> _id=${ad._id}`);
        }

        console.log("🎉 所有广告 JSON 已导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importAds();
