import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#0a66c2', fontSize: '32px', marginBottom: '8px' }}>
            💼 Welcome Back
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Sign in to your professional network
          </p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          paddingTop: '24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{ color: '#666', margin: '0' }}>
            New to ProNetwork?{' '}
            <Link to="/register" style={{ 
              color: '#0a66c2', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
