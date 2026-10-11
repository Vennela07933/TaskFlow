import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { getAllUsersApi } from '../api/userApi';

const MemberModal = ({ isOpen, onClose, onAddMember, existingMembers = [] }) => {
  const [email, setEmail] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllUsersApi()
        .then((users) => setRegisteredUsers(users))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      setEmail('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    onAddMember(email.trim());
  };

  const existingEmails = existingMembers.map((m) => m.email.toLowerCase());

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} /> Add Project Member
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Registered User</label>
            <select
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              <option value="">-- Choose from existing registered users --</option>
              {registeredUsers
                .filter((u) => !existingEmails.includes(u.email.toLowerCase()))
                .map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          </div>

          <div style={{ textAlign: 'center', margin: '10px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            - OR -
          </div>

          <div className="form-group">
            <label className="form-label">Enter User Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. teammate@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
