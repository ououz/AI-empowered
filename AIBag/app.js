// 项目入口文件
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// 初始化 express
const app = express();
app.use(express.json());
app.use(cors());

// 连接数据库
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI_ATLAS;
        //  const uri=process.env.MONGO_URI_LOCAL;
        if (!uri) {
            console.error("❌ 未配置 MONGO_URI_ATLAS 环境变量");
            process.exit(1);
        }

        // 4.x 驱动不再需要 useNewUrlParser 和 useUnifiedTopology
        await mongoose.connect(uri);
        console.log("✅ MongoDB 已连接");
    } catch (err) {
        console.error("❌ 数据库连接失败：", err.message);
        process.exit(1); // 连接失败直接退出
    }
};
connectDB();

// 静态资源
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 路由
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/posts", require("./src/routes/posts"));
app.use("/api/user", require("./src/routes/profile"));
app.use("/api/profile", require("./src/routes/profile"));
app.use("/api/favorites", require("./src/routes/favorite"));
app.use("/api/favorite", require("./src/routes/favorite"));
app.use("/api/report", require("./src/routes/report"));

app.use("/api/jobs", require("./src/routes/job"));
app.use("/api/ads", require("./src/routes/ad"));
app.use("/api/courses", require("./src/routes/course"));
app.use("/api", require("./src/routes/ai"));

// 健康检查
app.get("/api/health", (_, res) => res.json({ ok: true }));

// 默认首页 -> login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 使用 Render 或本地端口
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server 运行在 http://localhost:${PORT}`));
