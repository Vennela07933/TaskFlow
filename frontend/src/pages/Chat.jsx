import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectByIdApi } from '../api/projectApi';
import { getProjectMessagesApi, sendMessageApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, MessageSquare, Users } from 'lucide-react';

const Chat = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (isInitial = false) => {
    try {
      const msgs = await getProjectMessagesApi(projectId);
      setMessages(msgs);
      if (isInitial) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
      if (isInitial) {
        setError(err.response?.data?.message || 'Failed to load project chat');
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const proj = await getProjectByIdApi(projectId);
        setProject(proj);
        await fetchMessages(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Access denied or project not found');
      } finally {
        setLoading(false);
      }
    };

    init();

    // Simple 3-second periodic polling for live updates
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgToSend = newMessage.trim();
    setNewMessage('');

    try {
      await sendMessageApi(projectId, msgToSend);
      await fetchMessages(false);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="empty-state">Loading chat room...</div>;

  if (error) {
    return (
      <div>
        <Link to={`/projects/${projectId}`} className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Project
        </Link>
        <div className="alert alert-danger" style={{ marginTop: '16px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to={`/projects/${projectId}`} style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to {project?.name}
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={14} /> {project?.members?.length || 0} Members in Chat
        </span>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{project?.name} - Shared Team Chat</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Messages persist in MySQL and auto-refresh</span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet. Be the first to start the project discussion!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSentByMe = msg.sender?.id === user?.id;
              return (
                <div key={msg.id} className={`chat-bubble ${isSentByMe ? 'sent' : 'received'}`}>
                  <div className="chat-sender">{isSentByMe ? 'You' : msg.sender?.name}</div>
                  <div>{msg.message}</div>
                  <div className="chat-time">{formatTimestamp(msg.createdAt)}</div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
