const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    realName: String,
    skills: [String],
    education: [
        {
            school: String,
            degree: String,
            start: Date,
            end: Date
        }
    ],
    experience: [
        {
            company: String,
            position: String,
            start: Date,
            end: Date
        }
    ],
    contact: String,
    bio: String
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", UserProfileSchema);
