import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="navbar">
      <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        College Project Demonstration
      </div>
      <div className="navbar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="user-avatar">{getInitial(user?.name)}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {user?.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout} title="Log Out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
