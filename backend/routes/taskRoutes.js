const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createTask,
  getEmployeeTasks,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/create', auth, adminOnly, upload.array('attachments', 5), createTask);
router.get('/employee-tasks', auth, getEmployeeTasks);
router.get('/all-tasks', auth, adminOnly, getAllTasks);
router.put('/update-status/:taskId', auth, updateTaskStatus);
router.delete('/delete/:taskId', auth, adminOnly, deleteTask);
router.get('/stats', auth, adminOnly, getTaskStats);

module.exports = router;
