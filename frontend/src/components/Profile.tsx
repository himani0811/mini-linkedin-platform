import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { User, Post } from '../types';
import PostList from './PostList';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    job_title: '',
    location: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdToFetch = userId || currentUser?.id?.toString();
        console.log('Profile - userId from params:', userId);
        console.log('Profile - currentUser:', currentUser);
        console.log('Profile - userIdToFetch:', userIdToFetch);
        
        if (!userIdToFetch) {
          console.error('Profile - No user ID found');
          setError('User ID not found');
          setLoading(false);
          return;
        }

        console.log('Profile - Fetching user data for ID:', userIdToFetch);
        
        // Fetch user data from the correct endpoint
        const userResponse = await api.get(`/users/${userIdToFetch}`);
        console.log('Profile - User data received:', userResponse.data);
        setUser(userResponse.data);
        setEditForm({
          name: userResponse.data.name || '',
          bio: userResponse.data.bio || '',
          job_title: userResponse.data.job_title || '',
          location: userResponse.data.location || '',
          avatar: userResponse.data.avatar || ''
        });

        // Fetch user's posts
        console.log('Profile - Fetching posts for user ID:', userIdToFetch);
        const postsResponse = await api.get(`/posts/user/${userIdToFetch}`);
        console.log('Profile - Posts received:', postsResponse.data);
        setPosts(postsResponse.data);
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        console.error('Profile fetch error response:', err.response);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', editForm);
      setUser(response.data);
      updateUser(response.data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">User not found</div>;

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="container">
      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          {user.job_title && <p className="profile-job-title">{user.job_title}</p>}
          {user.location && (
            <p className="profile-location">
              📍 {user.location}
            </p>
          )}
          <p className="profile-email">{user.email}</p>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-number">{posts.length}</span>
              <span className="profile-stat-label">Posts</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-number">{posts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}</span>
              <span className="profile-stat-label">Likes</span>
            </div>
          </div>

          {isOwnProfile && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(!isEditing)}
              style={{ marginTop: '20px' }}
            >
              {isEditing ? 'Cancel' : '✏️ Edit Profile'}
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleEditSubmit} style={{ marginTop: '20px', textAlign: 'left' }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={editForm.job_title}
                onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                placeholder="e.g. Software Engineer at Company"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              💾 Save Changes
            </button>
          </form>
        )}
      </div>

      {isOwnProfile && (
        <div className="card">
          <h2>Your Posts</h2>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Share your first thought with the community!</p>
            </div>
          )}
        </div>
      )}

      {!isOwnProfile && posts.length > 0 && (
        <div className="card">
          <h2>{user.name}'s Posts</h2>
          <PostList posts={posts} />
        </div>
      )}
    </div>
  );
};

export default Profile;
