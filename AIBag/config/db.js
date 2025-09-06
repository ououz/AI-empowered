// config/db.js----连接云端
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        // 如果用 MongoDB Atlas，把下面换成你的连接字符串
        // 例如: mongodb+srv://<username>:<password>@cluster0.mongodb.net/aibug_db
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aibug_db";

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB 已连接:", uri);
    } catch (err) {
        console.error("MongoDB 连接失败:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
