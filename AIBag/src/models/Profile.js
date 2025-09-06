// src/models/Profile.js
const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
    school: String,
    degree: String,  // 本科/硕士/博士...
    major: String,
    start: Date,
    end: Date
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
    company: String,
    position: String,
    start: Date,
    end: Date,
    description: String
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    realName: String,
    avatar: String,
    skills: [String],
    education: [EducationSchema],
    experience: [ExperienceSchema],
    contact: String,
    bio: String,
    // 统计/展示用
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    fansCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
