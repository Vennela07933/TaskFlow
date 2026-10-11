import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectByIdApi, addMemberApi } from '../api/projectApi';
import { getProjectTasksApi, createTaskApi, updateTaskApi, updateTaskStatusApi, deleteTaskApi } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberModal from '../components/MemberModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Plus, MessageSquare, ArrowLeft, Shield } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProjectAndTasks = async () => {
    try {
      const projData = await getProjectByIdApi(id);
      setProject(projData);

      const tasksData = await getProjectTasksApi(id);
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Access denied or project not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const isOwner = project?.owner?.id === user?.id;

  const handleAddMember = async (email) => {
    try {
      await addMemberApi(id, email);
      setIsMemberModalOpen(false);
      fetchProjectAndTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await updateTaskApi(taskToEdit.id, taskData);
      } else {
        await createTaskApi({ ...taskData, projectId: Number(id) });
      }
      setIsTaskModalOpen(false);
      fetchProjectAndTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchProjectAndTasks();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDeleteId) {
      try {
        await deleteTaskApi(taskToDeleteId);
        setIsDeleteModalOpen(false);
        setTaskToDeleteId(null);
        fetchProjectAndTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="empty-state">Loading project details...</div>;

  if (error) {
    return (
      <div>
        <Link to="/projects" className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="alert alert-danger" style={{ marginTop: '16px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/projects" style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{project.name}</h1>
              {isOwner && (
                <span className="badge badge-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={12} /> Project Owner
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isOwner && (
              <button className="btn btn-secondary" onClick={() => setIsMemberModalOpen(true)}>
                <UserPlus size={18} /> Add Member
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/chat`)}>
              <MessageSquare size={18} /> Project Chat
            </button>
            {isOwner && (
              <button className="btn btn-primary" onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}>
                <Plus size={18} /> Add Task
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} /> Project Members ({project.members?.length || 0}):
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.members?.map((m) => (
              <span key={m.id} className="badge" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-main)', textTransform: 'none', padding: '6px 12px', fontSize: '0.85rem' }}>
                {m.name} {m.id === project.owner?.id ? '👑' : ''} ({m.email})
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
          {isOwner ? `Project Tasks (${tasks.length})` : `Tasks Assigned to You (${tasks.length})`}
        </h2>

        {tasks.length === 0 ? (
          <div className="empty-state" style={{ background: '#ffffff', border: '1px dashed var(--border)', borderRadius: '12px' }}>
            <p>{isOwner ? 'No tasks created in this project yet.' : 'No tasks assigned to you in this project yet.'}</p>
            {isOwner && (
              <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}>
                <Plus size={16} /> Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
                onDelete={(taskId) => { setTaskToDeleteId(taskId); setIsDeleteModalOpen(true); }}
                onStatusChange={handleStatusChange}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        projects={[project]}
        members={project.members || []}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        existingMembers={project.members || []}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default ProjectDetails;
