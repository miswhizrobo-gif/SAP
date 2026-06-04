import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { taskAPI } from '../utils/api';
import '../styles/Dashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    search: '',
    dateSort: 'newest',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getEmployeeTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

    // Filter by search term
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.taskName.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      if (filters.dateSort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.dateSort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.dateSort === 'due-soon') {
        const aDate = a.dueDate ? new Date(a.dueDate) : new Date(9999, 0, 0);
        const bDate = b.dueDate ? new Date(b.dueDate) : new Date(9999, 0, 0);
        return aDate - bDate;
      }
      return 0;
    });

    return filtered;
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1>Task Tracking System</h1>
        </div>
        <div className="nav-right">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>My Tasks</h2>

        {tasks.length > 0 && (
          <div className="filter-section">
            <div className="filter-group">
              <label>Search Task:</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Filter by Status:</label>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="All">All Statuses</option>
                <option value="To-do">To-do</option>
                <option value="In-progress">In-progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Filter by Priority:</label>
              <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By:</label>
              <select value={filters.dateSort} onChange={(e) => setFilters({ ...filters, dateSort: e.target.value })}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="due-soon">Due Soon</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading tasks...</p>
        ) : getFilteredTasks().length === 0 ? (
          <p>{tasks.length === 0 ? 'No tasks assigned yet.' : 'No tasks match your filters.'}</p>
        ) : (
          <div className="tasks-grid">
            {getFilteredTasks().map((task) => (
              <div key={task._id} className={`task-card priority-${task.priority.toLowerCase()}`}>
                <div className="task-header">
                  <h3>{task.taskName}</h3>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                {task.dueDate && (
                  <p className="task-duedate">
                    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                {task.assignedBy && (
                  <p className="task-assignedby">
                    <strong>Assigned by:</strong> {task.assignedBy.name}
                  </p>
                )}
                {task.attachments.length > 0 && (
                  <div className="attachments">
                    <strong>Attachments:</strong>
                    <ul>
                      {task.attachments.map((att, index) => (
                        <li key={index}>
                          <a href={att.filePath} target="_blank" rel="noopener noreferrer">
                            {att.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="status-selector">
                  <label>Status:</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="To-do">To-do</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
