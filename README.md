# Student Assistant Portal

A full-stack academic management system for students and administrators.

## Features

- Student registration and authentication
- Grade tracking and CGPA calculation
- Academic materials upload and download
- Admin dashboard for managing users and materials
- Role-based access control (student/admin)

## Admin Credentials

The system automatically creates a default administrator account on first startup:

- **Registration Number:** `ADMIN/2026/001`
- **Email:** `admin@student-asst.com`
- **Password:** `AdminPass2026!`

Use these credentials to log in as an administrator and access the admin dashboard for uploading materials and managing students.

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://your-connection-string/student_asst
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Seeding

To seed the database with sample materials and ensure the admin account exists:

```bash
cd Backend
node seed.js
```

## Project Structure

```
studAsst/
├── Backend/
│   ├── models/         # Mongoose models (User, Material, GradeRecord)
│   ├── routes/         # API routes (auth, materials, grades, users)
│   ├── middleware/     # Authentication middleware
│   ├── server.js       # Main server file
│   ├── seed.js         # Database seeding script
│   └── .env            # Environment variables
├── Frontend/
│   ├── src/
│   │   ├── components/ # React components (Dashboard, Login, Register, etc.)
│   │   ├── config/     # API configuration
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   └── .env            # Environment variables
└── README.md
```

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Vite

## Deployment

The project includes a `render.yaml` configuration for deployment on Render.com.

## License

MIT
