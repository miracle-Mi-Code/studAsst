const mongoose = require('mongoose');

const GradeRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseCode: { type: String, required: true, uppercase: true },
  courseTitle: { type: String, required: true },
  creditUnits: { type: Number, required: true, min: 1, max: 6 },
  score: { type: Number, required: true, min: 0, max: 100 },
  grade: { type: String }, // Pre-saved computed grade letter
  gradePoint: { type: Number }, // Pre-saved point scale (0-5)
  semester: { type: String, enum: ['First', 'Second'], required: true },
  academicSession: { type: String, required: true } // e.g., "2025/2026"
});

GradeRecordSchema.pre('save', function (next) {
  if (this.score >= 70) { this.grade = 'A'; this.gradePoint = 5; }
  else if (this.score >= 60) { this.grade = 'B'; this.gradePoint = 4; }
  else if (this.score >= 50) { this.grade = 'C'; this.gradePoint = 3; }
  else if (this.score >= 45) { this.grade = 'D'; this.gradePoint = 2; }
  else if (this.score >= 40) { this.grade = 'E'; this.gradePoint = 1; }
  else { this.grade = 'F'; this.gradePoint = 0; }
  next();
});

module.exports = mongoose.model('GradeRecord', GradeRecordSchema);
