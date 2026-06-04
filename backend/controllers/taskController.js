const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../config/email');

const createTask = async (req, res) => {
  try {
    const { taskName, description, assignedTo, priority, dueDate } = req.body;
    const assignedBy = req.user.id;

    // Validate required fields
    if (!taskName || !assignedTo) {
      return res.status(400).json({ message: 'Task name and assignee are required' });
    }

    // Check if employee exists
    const employee = await User.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Create new task
    const task = new Task({
      taskName,
      description,
      assignedTo,
      assignedBy,
      priority,
      dueDate,
      attachments: [],
    });

    // Handle file attachments if present
    if (req.files && req.files.length > 0) {
      task.attachments = req.files.map((file) => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
      }));
    }

    await task.save();

    // Send email notification to employee
    const emailContent = `
      <h2>New Task Assigned: ${taskName}</h2>
      <p><strong>Description:</strong> ${description || 'N/A'}</p>
      <p><strong>Priority:</strong> ${priority || 'Medium'}</p>
      <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
      <p>Please log in to your dashboard to view and update the task status.</p>
    `;

    await sendEmail(employee.email, `New Task: ${taskName}`, emailContent);

    res.status(201).json({
      message: 'Task created and notification sent',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const getEmployeeTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const tasks = await Task.find({ assignedTo: employeeId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['To-do', 'In-progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task status updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const todoTasks = await Task.countDocuments({ status: 'To-do' });
    const inProgressTasks = await Task.countDocuments({ status: 'In-progress' });
    const doneTasks = await Task.countDocuments({ status: 'Done' });

    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const tasksByEmployee = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee',
      },
      {
        $project: {
          employeeName: '$employee.name',
          taskCount: '$count',
        },
      },
    ]);

    res.status(200).json({
      stats: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        tasksByPriority,
        tasksByEmployee,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = {
  createTask,
  getEmployeeTasks,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
};
