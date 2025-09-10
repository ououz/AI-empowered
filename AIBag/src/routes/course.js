const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// ======================= 获取所有课程（嵌套结构） ======================
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        // 按 category → subcategory → group 分组
        const nestedCourses = {};

        courses.forEach(course => {
            const { category, subcategory, group, ...rest } = course.toObject();

            if (!nestedCourses[category]) {
                nestedCourses[category] = {};
            }

            if (!nestedCourses[category][subcategory]) {
                nestedCourses[category][subcategory] = {};
            }

            if (!nestedCourses[category][subcategory][group]) {
                nestedCourses[category][subcategory][group] = [];
            }

            nestedCourses[category][subcategory][group].push(rest);
        });

        res.json(nestedCourses);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "获取课程失败" });
    }
});

// ====================== 添加课程 ============================
router.post("/", async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.json({ msg: "课程添加成功", course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "保存失败" });
    }
});

module.exports = router;
