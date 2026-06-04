# Employee Task Tracking System

A full-stack web application for managing employee tasks with admin and employee dashboards.

## Features

### Admin Features
- Create and assign tasks to employees
- Add task descriptions, priorities, deadlines, and attachments
- View all tasks and employee statistics
- Track task progress
- Delete tasks
- Email notifications to employees when tasks are assigned

### Employee Features
- View assigned tasks
- Update task status (To-do, In-progress, Done)
- Filter tasks by status
- Download attachments
- View task priorities and deadlines

### Technology Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js
- **Authentication**: JWT
- **Email**: Nodemailer
- **File Upload**: Multer

## Project Structure

```
WhizSAP/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── uploads/
│   ├── package.json
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── EmployeeDashboard.js
    │   │   └── AdminDashboard.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── AuthContext.js
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   └── AdminDashboard.css
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task_tracking
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   FRONTEND_URL=http://localhost:3000
   ```

4. Make sure MongoDB is running on your system

5. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/auth/employees` - Get all employees (admin only)

### Tasks
- `POST /api/tasks/create` - Create new task (admin only)
- `GET /api/tasks/employee-tasks` - Get employee's tasks
- `GET /api/tasks/all-tasks` - Get all tasks (admin only)
- `PUT /api/tasks/update-status/:taskId` - Update task status
- `DELETE /api/tasks/delete/:taskId` - Delete task (admin only)
- `GET /api/tasks/stats` - Get statistics (admin only)

## Email Configuration

To enable email notifications, you need to configure Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in the `.env` file as `EMAIL_PASSWORD`

## Default Credentials (for testing)

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

### Employee Account
- Email: `employee@example.com`
- Password: `emp123`
- Role: Employee

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register or login with your credentials
4. If logged in as admin, you'll be redirected to the admin dashboard
5. If logged in as employee, you'll be redirected to the employee dashboard

## Notes

- Ensure MongoDB is installed and running
- Update the `.env` file with your actual email credentials
- Change the JWT_SECRET in production
- Maximum file size for attachments is 10MB
- Maximum 5 files can be attached per task

## License

MIT
