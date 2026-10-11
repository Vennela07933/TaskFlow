import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit, projects = [], members = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedToId: '',
    priority: 'MEDIUM',
    status: 'TO_DO',
    dueDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        projectId: taskToEdit.projectId || '',
        assignedToId: taskToEdit.assignedTo ? taskToEdit.assignedTo.id : '',
        priority: taskToEdit.priority || 'MEDIUM',
        status: taskToEdit.status || 'TO_DO',
        dueDate: taskToEdit.dueDate || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: projects.length > 0 ? projects[0].id : '',
        assignedToId: '',
        priority: 'MEDIUM',
        status: 'TO_DO',
        dueDate: ''
      });
    }
    setError('');
  }, [taskToEdit, isOpen, projects]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!formData.projectId) {
      setError('Please select a project');
      return;
    }
    onSave({
      ...formData,
      projectId: Number(formData.projectId),
      assignedToId: formData.assignedToId ? Number(formData.assignedToId) : null,
      dueDate: formData.dueDate || null
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Design Database Schema"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Detailed description of the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project *</label>
            <select
              className="form-control"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              disabled={!!taskToEdit}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To Member</label>
            <select
              className="form-control"
              value={formData.assignedToId}
              onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
            >
              <option value="">-- Unassigned --</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
