//项目入口文件
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
app.use(express.json());
// 解决跨域
const cors = require("cors");
app.use(cors());


// 连接数据库
connectDB();

app.use(express.static(path.join(__dirname, "public")));
// 默认首页 -> login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 路由：用户注册/登录
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/posts", require("./src/routes/posts"));
app.use("/api/user", require("./src/routes/profile"));
app.use("/api/profile", require("./src/routes/profile"));
app.use("/api/favorites", require("./src/routes/favorite"));
app.use("/api/favorite", require("./src/routes/favorite"));
app.use("/api/jobs", require("./src/routes/job"));
app.use("/api/ads", require("./src/routes/ad"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.get("/api/health", (_, res) => res.json({ ok: true }));

// 默认首页 -> login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server 运行在 http://localhost:${PORT}`));
