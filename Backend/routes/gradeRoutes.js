const express = require('express');
const router = express.Router();
const GradeRecord = require('../models/GradeRecord');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/grades/summary
// @desc    Get user's grade records and compute CGPA & academic remark
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const grades = await GradeRecord.find({ student: req.user._id });

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
      totalPoints += grade.gradePoint * grade.creditUnits;
      totalCredits += grade.creditUnits;
    });

    const cgpaVal = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    const cgpa = cgpaVal.toFixed(2);

    let remark = 'No entries';
    if (totalCredits > 0) {
      if (cgpaVal >= 4.50) remark = 'First Class';
      else if (cgpaVal >= 3.50) remark = 'Second Class Upper';
      else if (cgpaVal >= 2.40) remark = 'Second Class Lower';
      else if (cgpaVal >= 1.50) remark = 'Third Class';
      else if (cgpaVal >= 1.00) remark = 'Pass';
      else remark = 'Fail';
    }

    res.json({
      status: 'success',
      data: {
        courses: grades,
        summary: {
          cgpa,
          remark
        }
      }
    });
  } catch (err) {
    console.error('Grades fetch error:', err);
    res.status(500).json({ message: 'Error retrieving academic summary from database.' });
  }
});

// @route   POST /api/grades/add
// @desc    Add a new course grade entry
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { courseCode, courseTitle, creditUnits, score, semester, academicSession } = req.body;

    if (!courseCode || !courseTitle || creditUnits === undefined || score === undefined || !semester || !academicSession) {
      return res.status(400).json({ message: 'All grade entry parameters are required.' });
    }

    const newGrade = new GradeRecord({
      student: req.user._id,
      courseCode,
      courseTitle,
      creditUnits: Number(creditUnits),
      score: Number(score),
      semester,
      academicSession
    });

    const savedGrade = await newGrade.save();

    res.status(201).json({
      status: 'success',
      data: savedGrade
    });
  } catch (err) {
    console.error('Add grade error:', err);
    res.status(500).json({ message: 'Error saving academic grade entry to database.' });
  }
});

module.exports = router;
