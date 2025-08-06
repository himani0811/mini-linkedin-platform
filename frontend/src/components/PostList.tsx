import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { user } = useAuth();

  const handleLike = async (postId: number) => {
    if (!user) return;
    
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes_count: response.data.likes_count,
              liked_by_user: response.data.liked_by_user 
            }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!user || !window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📄</div>
        <h3>No posts found</h3>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <div className="post-avatar">
              {post.author_avatar ? (
                <img 
                  src={post.author_avatar} 
                  alt={post.author_name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                />
              ) : (
                getInitials(post.author_name || 'Unknown')
              )}
            </div>
            <div className="post-author-info">
              <Link to={`/profile/${post.author_id}`} className="post-author">
                {post.author_name}
              </Link>
              {post.author_job_title && (
                <div className="post-job-title">{post.author_job_title}</div>
              )}
              <div className="post-date">{formatDate(post.created_at)}</div>
            </div>
            {user && user.id === post.author_id && (
              <button 
                onClick={() => handleDelete(post.id)}
                className="btn-like"
                style={{ color: '#e74c3c', marginLeft: 'auto' }}
                title="Delete post"
              >
                🗑️
              </button>
            )}
          </div>
          
          <div className="post-content">{post.content}</div>
          
          <div className="post-actions">
            <button 
              className={`btn-like ${post.liked_by_user ? 'liked' : ''}`}
              onClick={() => handleLike(post.id)}
              disabled={!user}
            >
              {post.liked_by_user ? '❤️' : '🤍'} {post.likes_count || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
