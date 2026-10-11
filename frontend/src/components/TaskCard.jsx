import React from 'react';
import { Calendar, User, Edit3, Trash2, Folder } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, currentUserId }) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-completed';
      case 'IN_PROGRESS': return 'badge-in-progress';
      default: return 'badge-todo';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      default: return 'To Do';
    }
  };

  const isCreatorOrOwner = (task.createdBy?.id === currentUserId) || (task.projectOwnerId === currentUserId);

  return (
    <div className="task-card">
      <div>
        <div className="task-header">
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority} Priority
          </span>
          <select
            className={`badge ${getStatusBadgeClass(task.status)}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <h3 className="task-title">{task.title}</h3>
        <p className="task-desc">{task.description || 'No description provided.'}</p>

        <div className="task-meta">
          {task.projectName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Folder size={14} /> {task.projectName}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={14} /> Assigned to: <strong>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</strong>
          </span>
          {task.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Due: {task.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="task-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          By: {task.createdBy?.name || 'User'}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {onEdit && isCreatorOrOwner && (
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(task)} title="Edit Task Details">
              <Edit3 size={14} />
            </button>
          )}
          {onDelete && isCreatorOrOwner && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)} title="Delete Task">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
