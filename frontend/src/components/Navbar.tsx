import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            💼 ProNetwork
          </Link>
          <div className="navbar-nav">
            {user ? (
              <>
                <Link to="/">🏠 Feed</Link>
                <Link to={`/profile/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #0a66c2, #004182)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  {user.name}
                </Link>
                <button onClick={logout} className="btn btn-secondary" style={{ fontSize: '14px' }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">🔑 Login</Link>
                <Link to="/register">📝 Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
