const mongoose = require('mongoose');
const Material = require('./models/Material');
require('dotenv').config();

const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_asst';

const dummyMaterials = [
  {
    title: "MTH 101: College Algebra & Trigonometry Notes",
    courseCode: "MTH101",
    level: "100",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 15
  },
  {
    title: "CHM 101: General Chemistry I - Past Questions (2020-2024)",
    courseCode: "CHM101",
    level: "100",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 42
  },
  {
    title: "CSC 102: Introduction to Computer Science Note",
    courseCode: "CSC102",
    level: "100",
    semester: "Second",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 8
  },
  {
    title: "CSC 201: Object Oriented Java Programming",
    courseCode: "CSC201",
    level: "200",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 29
  },
  {
    title: "STA 202: Statistics for Physical Sciences",
    courseCode: "STA202",
    level: "200",
    semester: "Second",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 17
  },
  {
    title: "CMP 301: Compiler Construction & Automata",
    courseCode: "CMP301",
    level: "300",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 22
  },
  {
    title: "CMP 305: Database Design and Systems",
    courseCode: "CMP305",
    level: "300",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 34
  },
  {
    title: "ENG 302: Applied Thermodynamics Textbook",
    courseCode: "ENG302",
    level: "300",
    semester: "Second",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 12
  },
  {
    title: "CMP 401: Distributed Systems & Cloud Computing",
    courseCode: "CMP401",
    level: "400",
    semester: "First",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 51
  },
  {
    title: "GST 411: Entrepreneurship and Innovation Handbook",
    courseCode: "GST411",
    level: "400",
    semester: "Second",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloadCount: 68
  }
];

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Seed connection established.');
    
    // Clear old data
    await Material.deleteMany({});
    console.log('Cleared existing materials.');
    
    // Insert new data
    const inserted = await Material.insertMany(dummyMaterials);
    console.log(`Successfully seeded ${inserted.length} academic materials!`);

    // Seed default Admin if not exists
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('AdminPass2026!', salt);
        await User.create({
          regNumber: 'ADMIN/2026/001',
          fullName: 'System Administrator',
          email: 'admin@student-asst.com',
          password: hashedPassword,
          level: '400',
          role: 'admin'
        });
        console.log('Admin account (ADMIN/2026/001) seeded successfully.');
      } else {
        console.log('Admin account already exists.');
      }
    } catch (seedErr) {
      console.error('Error seeding default administrator:', seedErr);
    }
    
    mongoose.connection.close();
    console.log('Seed script finished, connection closed.');
  })
  .catch(err => {
    console.error('Failed to run seed script:', err);
    process.exit(1);
  });
