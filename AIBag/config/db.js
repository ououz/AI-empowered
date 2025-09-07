const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_LOCAL;
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
