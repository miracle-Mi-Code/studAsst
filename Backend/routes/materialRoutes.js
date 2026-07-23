const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/materials/admin/stats
// @desc    Get system statistics, all materials, and all students for Admin Dashboard
// @access  Private (Admin only)
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMaterials = await Material.countDocuments({});
    
    // Sum download counts
    const downloadStats = await Material.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);
    const totalDownloads = downloadStats.length > 0 ? downloadStats[0].total : 0;

    // Fetch all materials
    const materials = await Material.find({})
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 });

    // Fetch all students
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        stats: {
          totalStudents,
          totalMaterials,
          totalDownloads
        },
        materials,
        students
      }
    });
  } catch (err) {
    console.error('Admin stats fetch error:', err);
    res.status(500).json({ message: 'Error fetching system stats for administrator.' });
  }
});

// @route   GET /api/materials
// @desc    Get all materials with optional filtering by level and semester
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { level, semester } = req.query;
    let query = {};

    if (level) query.level = level;
    if (semester) query.semester = semester;

    const materials = await Material.find(query)
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: materials
    });
  } catch (err) {
    console.error('Fetch materials error:', err);
    res.status(500).json({ message: 'Error retrieving academic materials from server.' });
  }
});

// @route   POST /api/materials
// @desc    Create/Upload a new study material
// @access  Private (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, courseCode, level, semester, fileUrl } = req.body;

    if (!title || !courseCode || !level || !semester || !fileUrl) {
      return res.status(400).json({ message: 'All material parameters are required (title, courseCode, level, semester, fileUrl).' });
    }

    const newMaterial = new Material({
      title,
      courseCode: courseCode.trim().toUpperCase(),
      level,
      semester,
      fileUrl,
      uploadedBy: req.user._id
    });

    const savedMaterial = await newMaterial.save();
    
    res.status(201).json({
      status: 'success',
      data: savedMaterial
    });
  } catch (err) {
    console.error('Upload material error:', err);
    res.status(500).json({ message: 'Server error saving study material.' });
  }
});

// @route   PUT /api/materials/download/:id
// @desc    Increment the download count for a specific material
// @access  Public
router.put('/download/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found.' });
    }

    material.downloadCount += 1;
    await material.save();

    res.json({
      status: 'success',
      data: {
        id: material._id,
        downloadCount: material.downloadCount
      }
    });
  } catch (err) {
    console.error('Download tracking error:', err);
    res.status(500).json({ message: 'Error updating resource download count.' });
  }
});

// @route   DELETE /api/materials/:id
// @desc    Delete academic material from library
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found.' });
    }

    await Material.deleteOne({ _id: req.params.id });
    res.json({
      status: 'success',
      message: 'Academic material successfully deleted.'
    });
  } catch (err) {
    console.error('Delete material error:', err);
    res.status(500).json({ message: 'Error deleting academic material.' });
  }
});

module.exports = router;
