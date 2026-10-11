import React, { useState, useEffect } from 'react';
import { getAllTasksApi, createTaskApi, updateTaskApi, updateTaskStatusApi, deleteTaskApi } from '../api/taskApi';
import { getUserProjectsApi } from '../api/projectApi';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter } from 'lucide-react';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasksApi(statusFilter, searchQuery);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const projData = await getUserProjectsApi();
      setProjects(projData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const ownedProjects = projects.filter((p) => p.owner?.id === user?.id);

  const handleCreateTaskClick = () => {
    setTaskToEdit(null);
    if (ownedProjects.length > 0) {
      setSelectedProjectMembers(ownedProjects[0].members || []);
    }
    setIsTaskModalOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setTaskToEdit(task);
    const proj = projects.find((p) => p.id === task.projectId);
    setSelectedProjectMembers(proj ? proj.members : []);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await updateTaskApi(taskToEdit.id, taskData);
      } else {
        await createTaskApi(taskData);
      }
      setIsTaskModalOpen(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDeleteId) {
      try {
        await deleteTaskApi(taskToDeleteId);
        setIsDeleteModalOpen(false);
        setTaskToDeleteId(null);
        fetchTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Task Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            View, search, edit, and assign tasks across your projects
          </p>
        </div>
        {ownedProjects.length > 0 && (
          <button className="btn btn-primary" onClick={handleCreateTaskClick}>
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px' }}>
          <Filter size={18} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state" style={{ background: '#ffffff', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          <p>No tasks match your criteria.</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTaskClick}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        projects={taskToEdit ? projects : ownedProjects}
        members={selectedProjectMembers}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default MyTasks;
