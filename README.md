# 📘 Course_Registration
### A full-stack Course Registration (LMS-style) system with distinct roles for Admin, Faculty, and Student. Built using React for the frontend and Node.js + Express for the backend.

## 🚀 Tech Stack
Frontend: React, Tailwind CSS, Axios, React Router

Backend: Node.js, Express, JWT, bcrypt, MySQL

Database: MySQL

Authentication: JWT-based authentication with role-based access control

## 🔐 Default Credentials
### 🛠 Admin
### Email: admin@saveetha.ac.in

### Password: admin123

### Admin can:

Create faculty accounts

Create student accounts

View all registered users

## 👨‍🏫 Sample Faculty
### Email: dinesh@saveetha.ac.in

### Password: dinesh123

### Faculty can:

Create and manage courses

Upload content (PDFs, videos, resources)

Create and manage exams/quizzes

View enrolled students

## 👨‍🎓 Sample Student
### Email: george@saveetha.ac.in

### Password: george123

### Students can:

View available courses

Enroll in courses

Access uploaded content

Take exams/quizzes

## 🛠️ Getting Started
### 1. Clone the Repository
Clone the full project:

bash
Copy
Edit
```
git clone https://github.com/your-username/Course_Registration.git
cd Course_Registration
```

🔧 Backend Setup (Node.js + Express)
Navigate to the backend folder
bash
Copy
Edit
cd backend
Install dependencies
nginx
Copy
Edit
```
npm install
```
Configure environment variables
Create a .env file with the following content:

ini
Copy
Edit
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=course_registration
JWT_SECRET=your_jwt_secret
```
Run backend server
sql
Copy
Edit
```
npm start
```
Server will run at: http://localhost:5000

## 💻 Frontend Setup (React)
Navigate to the frontend folder
bash
Copy
Edit
cd frontend
Install dependencies
nginx
Copy
Edit
```
npm install
```
Run React App
sql
Copy
Edit
```
npm start
```
Frontend will run at: http://localhost:3000

## 📂 Project Structure
### Backend (Node.js)
routes/: Express route files for auth, admin, courses, etc.

controllers/: Handles logic for each route

middleware/: JWT authentication and role-based authorization

models/: MySQL table models using Sequelize or raw queries

config/: DB and environment configuration

Frontend (React)
pages/: Login, Signup, Dashboard pages for each role

components/: UI components like Navbar, Sidebar, CourseCard, etc.

contexts/AuthContext.js: Manages login state and user roles

axios/AxiosInstance.js: For making secured API calls with token

## 📡 API Endpoints
Example:

Login
POST /api/auth/login
Payload:

perl
Copy
Edit
{
  "email": "admin@saveetha.ac.in",
  "password": "admin123"
}
Returns: JWT Token

Use token in headers:
Authorization: Bearer <token>

## 🧪 Testing
Use Postman or Thunder Client to test APIs.

Make sure to pass JWT tokens for protected routes.

## 📌 Notes
Role-based access is strictly enforced on both frontend and backend.

JWT tokens are stored in memory/context or localStorage.

Cleanly separated logic for Admin, Faculty, and Student users.

Additional features like notifications, progress tracking, or leaderboards can be added as future enhancements.

## 🧑‍💻 Author
Developed by George for Saveetha University LMS.
