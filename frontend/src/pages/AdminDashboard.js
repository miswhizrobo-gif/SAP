import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { taskAPI, authAPI } from '../utils/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    attachments: [],
  });
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    search: '',
    dateSort: 'newest',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes, employeesRes] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getAllTasks(),
        authAPI.getAllEmployees(),
      ]);
      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks);
      setEmployees(employeesRes.data.employees);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (isCreating) return; // Prevent duplicate submissions
    
    try {
      setIsCreating(true);
      const formDataToSend = new FormData();
      formDataToSend.append('taskName', formData.taskName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('assignedTo', formData.assignedTo);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('dueDate', formData.dueDate);

      for (let i = 0; i < formData.attachments.length; i++) {
        formDataToSend.append('attachments', formData.attachments[i]);
      }

      await taskAPI.createTask(formDataToSend);
      setFormData({
        taskName: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: '',
        attachments: [],
      });
      setActiveTab('tasks');
      fetchInitialData();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchInitialData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by status
    if (filters.status !== 'All') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'All') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by search term (task name or employee name)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.taskName.toLowerCase().includes(search) ||
        task.assignedTo.name.toLowerCase().includes(search)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      if (filters.dateSort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.dateSort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.dateSort === 'due-soon') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    return filtered;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1>Admin Dashboard - Task Tracking</h1>
        </div>
        <div className="nav-right">
          <span>{user?.name} (Admin)</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          All Tasks
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Task
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-content">
          {/* Statistics Tab */}
          {activeTab === 'stats' && stats && (
            <div className="stats-section">
              <h2>Dashboard Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Tasks</h3>
                  <p className="stat-number">{stats.totalTasks}</p>
                </div>
                <div className="stat-card">
                  <h3>To-do</h3>
                  <p className="stat-number">{stats.todoTasks}</p>
                </div>
                <div className="stat-card">
                  <h3>In-progress</h3>
                  <p className="stat-number">{stats.inProgressTasks}</p>
                </div>
                <div className="stat-card">
                  <h3>Done</h3>
                  <p className="stat-number">{stats.doneTasks}</p>
                </div>
              </div>

              {stats.tasksByPriority.length > 0 && (
                <div className="chart-section">
                  <h3>Tasks by Priority</h3>
                  <ul>
                    {stats.tasksByPriority.map((item) => (
                      <li key={item._id}>
                        {item._id}: {item.count}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {stats.tasksByEmployee.length > 0 && (
                <div className="chart-section">
                  <h3>Tasks by Employee</h3>
                  <ul>
                    {stats.tasksByEmployee.map((item) => (
                      <li key={item._id}>
                        {item.employeeName}: {item.taskCount}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* All Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="tasks-section">
              <h2>All Tasks</h2>
              
              {tasks.length > 0 && (
                <div className="tasks-filters">
                  <div className="filter-group">
                    <label>Search Task/Employee:</label>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Status:</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="All">All Statuses</option>
                      <option value="To-do">To-do</option>
                      <option value="In-progress">In-progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Priority:</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Sort By:</label>
                    <select
                      value={filters.dateSort}
                      onChange={(e) => setFilters({ ...filters, dateSort: e.target.value })}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="due-soon">Due Soon</option>
                    </select>
                  </div>
                </div>
              )}

              {tasks.length === 0 ? (
                <p>No tasks created yet.</p>
              ) : getFilteredTasks().length === 0 ? (
                <p>No tasks match your filters.</p>
              ) : (
                <div className="tasks-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Assigned To</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredTasks().map((task) => (
                        <tr key={task._id}>
                          <td>{task.taskName}</td>
                          <td>{task.assignedTo.name}</td>
                          <td>
                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${task.status.toLowerCase()}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Create Task Tab */}
          {activeTab === 'create' && (
            <div className="create-task-section">
              <h2>Create New Task</h2>
              <form onSubmit={handleCreateTask} className="create-form">
                <div className="form-group">
                  <label>Task Name:</label>
                  <input
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Assign To:</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select an employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority:</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Attachments (max 5 files, 10MB each):</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
