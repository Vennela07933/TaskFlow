import React, { useState, useEffect } from 'react';
import { getDashboardSummaryApi } from '../api/dashboardApi';
import { updateTaskStatusApi } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardSummaryApi();
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  if (loading) {
    return <div className="empty-state">Loading dashboard stats...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>
          Welcome back, {summary?.userName || user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Here is an overview of your team projects and assigned tasks.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="stat-val">{summary?.totalTasks || 0}</div>
            <div className="stat-lbl">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="stat-val">{summary?.pendingTasks || 0}</div>
            <div className="stat-lbl">Pending (To Do)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{summary?.inProgressTasks || 0}</div>
            <div className="stat-lbl">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{summary?.completedTasks || 0}</div>
            <div className="stat-lbl">Completed</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
          Recent Tasks
        </h2>

        {!summary?.recentTasks || summary.recentTasks.length === 0 ? (
          <div className="empty-state" style={{ background: '#ffffff', border: '1px dashed var(--border)', borderRadius: '12px' }}>
            <p>No tasks found. Create a project and add tasks to get started!</p>
          </div>
        ) : (
          <div className="task-grid">
            {summary.recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
