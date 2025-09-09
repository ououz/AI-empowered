const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    salary: String,
    contactPhone: String,
    experience: String,
    education: String,
    company: String,
    location: String,
    description: String,
    requirements: [String],   // 数组类型
    category: String,
}, { timestamps: true });    // 自动生成 createdAt 和 updatedAt

module.exports = mongoose.model("Job", jobSchema);