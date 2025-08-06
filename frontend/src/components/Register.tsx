import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, bio);
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
            🚀 Join ProNetwork
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Connect with professionals worldwide
          </p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">👤 Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
              placeholder="Create a secure password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">📝 Professional Bio (Optional)</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about your professional background..."
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? '⏳ Creating Account...' : '🎉 Create Account'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          paddingTop: '24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{ color: '#666', margin: '0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ 
              color: '#0a66c2', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
