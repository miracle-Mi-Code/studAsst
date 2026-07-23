const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseCode: { type: String, required: true, uppercase: true },
  level: { type: String, enum: ['100', '200', '300', '400'], required: true },
  semester: { type: String, enum: ['First', 'Second'], required: true },
  fileUrl: { type: String, required: true }, // URL to AWS S3, Cloudinary, or Render storage
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);
