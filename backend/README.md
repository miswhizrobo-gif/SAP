# Backend - Employee Task Tracking System

This is the Node.js/Express backend for the Employee Task Tracking System.

## Prerequisites

- Node.js v14+
- MongoDB running locally or access to MongoDB Atlas
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task_tracking
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (admin or employee)
- `department`: String
- `createdAt`: Date

### Task Model
- `taskName`: String (required)
- `description`: String
- `assignedTo`: ObjectId (Employee reference)
- `assignedBy`: ObjectId (Admin reference)
- `status`: String (To-do, In-progress, Done)
- `priority`: String (Low, Medium, High, Critical)
- `dueDate`: Date
- `attachments`: Array of file objects
- `createdAt`: Date
- `updatedAt`: Date

## API Routes

See the main README.md for complete API documentation.

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `nodemailer`: Email sending
- `multer`: File upload handling
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment variables

## File Upload

Files are uploaded to the `/uploads` directory and served statically at `/uploads/[filename]`.

Maximum file size: 10MB
Maximum files per task: 5

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```
