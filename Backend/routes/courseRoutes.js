const express = require("express");
const router = express.Router();
const Course = require("./models/Course");

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add one or multiple courses
router.post("/", async (req, res) => {
  try {
    const isMultiple = Array.isArray(req.body);
    const coursesToAdd = isMultiple ? req.body : [req.body];

    const savedCourses = await Course.insertMany(coursesToAdd);

    res.status(201).json({
      message: `${savedCourses.length} course(s) added successfully`,
      courses: savedCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;