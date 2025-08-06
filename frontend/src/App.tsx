import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={user ? <Profile /> : <Login />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
