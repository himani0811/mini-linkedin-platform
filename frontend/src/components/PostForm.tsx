import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Post } from '../types';

interface PostFormProps {
  onPostCreated: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
        <p>Please log in to share your thoughts with the community.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/posts', { content: content.trim() });
      onPostCreated(response.data);
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div className="post-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
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
        
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <div className="form-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your professional thoughts..."
              rows={3}
              style={{ 
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                resize: 'vertical',
                minHeight: '80px'
              }}
              maxLength={1000}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '12px'
            }}>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {content.length}/1000 characters
              </span>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !content.trim()}
                style={{ minWidth: '100px' }}
              >
                {loading ? '📝 Posting...' : '📝 Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {error && <div className="error" style={{ marginTop: '12px' }}>{error}</div>}
    </div>
  );
};

export default PostForm;
