# Frontend - Employee Task Tracking System

This is the React frontend for the Employee Task Tracking System.

## Prerequisites

- Node.js v14+
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm start
```

The application will start on `http://localhost:3000`

### Build for Production
```bash
npm build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── EmployeeDashboard.js
│   └── AdminDashboard.js
├── utils/            # Utility functions
│   ├── api.js        # API client setup
│   └── AuthContext.js # Authentication context
├── styles/           # CSS files
│   ├── Auth.css
│   ├── Dashboard.css
│   └── AdminDashboard.css
├── App.js            # Main app component
└── index.js          # Entry point
```

## Features

### Login/Register Page
- User registration with email validation
- Login with email and password
- Role selection (Admin/Employee)
- Department field for employees

### Employee Dashboard
- View all assigned tasks
- Filter tasks by status (To-do, In-progress, Done)
- Update task status
- View task details (description, priority, due date)
- Download task attachments
- Sort by priority

### Admin Dashboard
- **Statistics Tab**: View task statistics and employee workload
- **All Tasks Tab**: View all tasks with status and priority information
- **Create Task Tab**: Assign new tasks to employees with:
  - Task name and description
  - Priority level (Low, Medium, High, Critical)
  - Due date
  - Multiple file attachments

## Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in all API requests.

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app (irreversible)

## API Configuration

The API base URL is configured in `src/utils/api.js`. By default, it connects to `http://localhost:5000/api`.

To change the backend URL, set the `REACT_APP_API_URL` environment variable.

## Styling

The application uses CSS for styling with:
- Gradient backgrounds
- Responsive grid layouts
- Hover effects and transitions
- Priority-based color coding
- Status-based styling

## Dependencies

- `react`: UI library
- `react-dom`: React DOM rendering
- `react-router-dom`: Routing
- `axios`: HTTP client

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Ensure the backend server is running before starting the frontend
- The default API URL is `http://localhost:5000/api`
- JWT tokens expire based on the backend configuration
- File uploads are limited to 10MB per file and 5 files per task
