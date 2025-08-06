import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Post } from '../types';
import PostForm from './PostForm';
import PostList from './PostList';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchPosts();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err: any) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    try {
      setIsSearching(true);
      const response = await api.get(`/posts/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.posts || []);
    } catch (err: any) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  const displayPosts = searchQuery.trim() ? searchResults : posts;

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#0a66c2' }}>
          🌟 Professional Feed
        </h1>

        <div className="search-bar">
          <div style={{ position: 'relative' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search posts and people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <PostForm onPostCreated={handlePostCreated} />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        {searchQuery.trim() && (
          <h3 style={{ marginBottom: '20px', color: '#666' }}>
            {isSearching ? 'Searching...' : `Search results for "${searchQuery}"`}
          </h3>
        )}

        {displayPosts.length > 0 ? (
          <PostList posts={displayPosts} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              {searchQuery.trim() ? '🔍' : '📝'}
            </div>
            <h3>
              {searchQuery.trim() ? 'No results found' : 'No posts yet'}
            </h3>
            <p>
              {searchQuery.trim() 
                ? 'Try searching with different keywords' 
                : 'Be the first to share something professional!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
