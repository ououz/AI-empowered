// scripts/importJobs.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Job = require("../../src/models/Job"); // 注意大小写

async function importJobs() {
    try {
        const uri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS;
        if (!uri) {
            throw new Error("❌ 未找到数据库连接字符串，请检查 .env 文件是否包含 MONGO_URI_LOCAL 或 MONGO_URI_ATLAS");
        }

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // JSON 文件列表
        const files = [
            path.join(__dirname, "job-0.json"),
            path.join(__dirname, "job-1.json"),
            path.join(__dirname, "job-2.json"),
            path.join(__dirname, "job-3.json"),
            path.join(__dirname, "job-4.json"),
            path.join(__dirname, "job-5.json"),
            path.join(__dirname, "job-6.json"),
            path.join(__dirname, "job-7.json"),
            path.join(__dirname, "job-8.json"),
            path.join(__dirname, "job-.json")
        ];

        for (const file of files) {
            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            // 检查是否已存在同 slug 的职位
            const existing = await Job.findOne({ slug: raw.slug });
            if (existing) {
                console.log(`⚠️ 已存在职位: ${raw.slug}，跳过`);
                continue;
            }

            const job = await Job.create(raw);
            console.log(`📥 已导入职位: ${job.slug} -> _id=${job._id}`);
        }

        console.log("🎉 所有职位数据已导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importJobs();
