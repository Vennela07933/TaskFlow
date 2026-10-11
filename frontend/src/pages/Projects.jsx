import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjectsApi, createProjectApi } from '../api/projectApi';
import ProjectModal from '../components/ProjectModal';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Plus, Users, MessageSquare, ArrowRight } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await getUserProjectsApi();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (name, description) => {
    try {
      await createProjectApi(name, description);
      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Team Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Collaborate with team members, manage tasks, and chat in project workspace
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsProjectModalOpen(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state" style={{ background: '#ffffff', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          <FolderKanban size={48} />
          <p style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 600 }}>No projects found</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Create your first project to start assigning tasks to your team!
          </p>
          <button className="btn btn-primary" onClick={() => setIsProjectModalOpen(true)}>
            <Plus size={18} /> Create First Project
          </button>
        </div>
      ) : (
        <div className="task-grid">
          {projects.map((proj) => {
            const isOwner = proj.owner?.id === user?.id;
            return (
              <div key={proj.id} className="task-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${proj.id}`)}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="task-title" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                      {proj.name}
                    </h3>
                    <span className="badge" style={{ backgroundColor: isOwner ? 'var(--primary-light)' : '#f1f5f9', color: isOwner ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {isOwner ? 'Owner' : 'Member'}
                    </span>
                  </div>

                  <p className="task-desc" style={{ marginBottom: '16px' }}>
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                <div className="task-footer">
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {proj.members ? proj.members.length : 1} Members
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${proj.id}/chat`);
                      }}
                      title="Project Chat"
                    >
                      <MessageSquare size={14} /> Chat
                    </button>
                    <button className="btn btn-primary btn-sm">
                      View <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
