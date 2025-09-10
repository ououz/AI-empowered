// scripts/importCourses.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Course = require("../../src/models/Course");

async function importCourses() {
    try {
        //const uri = process.env.MONGO_URI_LOCA
        const uri = process.env.MONGO_URI_ATLAS;
        if (!uri) {
            throw new Error("❌ 未找到数据库连接字符串，请检查 .env 文件是否包含 MONGO_URI_LOCAL 或 MONGO_URI_ATLAS");
        }

        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");

        // 所有课程 JSON 文件
        const files = [
            path.join(__dirname, "course-0.json"),
            path.join(__dirname, "course-1.json"),
            path.join(__dirname, "course-2.json"),
            path.join(__dirname, "course-3.json"),
            path.join(__dirname, "course-4.json"),
            path.join(__dirname, "course-5.json"),
            path.join(__dirname, "course-6.json"),
            path.join(__dirname, "course-7.json")
            // 以后有更多文件，就在这里加
        ];

        for (const file of files) {
            console.log(`📂 正在导入文件: ${path.basename(file)}`);

            const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

            if (!Array.isArray(raw)) {
                throw new Error(`❌ ${file} 格式错误，必须是数组`);
            }

            for (const course of raw) {
                const doc = await Course.create(course);
                console.log(`📥 已导入课程: ${doc.title} (${doc.platform})`);
            }
        }

        console.log("🎉 所有课程已导入完成");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ 导入失败:", err);
        mongoose.connection.close();
    }
}

importCourses();
