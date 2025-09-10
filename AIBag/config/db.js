const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        //const uri = process.env.MONGO_URI_LOCAL;
        const uri = process.env.MONGO_URI_ATLAS;
        if (!uri) {
            console.error("❌ 未配置 MONGO_URI_ATLAS");
            process.exit(1);
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB 已连接: ${uri}`);
    } catch (err) {
        console.error("❌ 数据库连接失败:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
