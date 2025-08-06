# Mini LinkedIn-like Community Platform

A full-stack social media platform inspired by LinkedIn, built with React and Flask.

## 🚀 Features

- **User Authentication**: Register and login with email/password
- **User Profiles**: View user profiles with name, email, and bio
- **Post Creation**: Create and share text-based posts
- **Public Feed**: Browse all posts with author information and timestamps
- **Responsive Design**: Clean, LinkedIn-inspired UI

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling (LinkedIn-inspired design)

### Backend
- **Flask** with Python
- **SQLAlchemy** for database ORM
- **JWT** for authentication
- **Flask-CORS** for cross-origin requests
- **SQLite** database (easily configurable to PostgreSQL)

## 📁 Project Structure

```
Himani_project/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── services/        # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main App component
│   └── package.json
└── backend/                 # Flask API server
    ├── models/             # Database models
    ├── routes/             # API routes
    ├── app.py             # Flask application
    ├── config.py          # Configuration
    └── requirements.txt   # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Himani_project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Quick Start (Windows) - Recommended
For Windows users, use the provided batch script to start both servers automatically:

```bash
# From the project root directory
start-dev.bat
```

This will:
- Start the Flask backend server on http://localhost:5000
- Start the React frontend server on http://localhost:3000
- Open both in separate command windows

#### Option 2: Manual Start (All Platforms)

1. **Start the Backend Server**
   ```bash
   cd backend
   
   # Activate virtual environment (if not already active)
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   
   # Run Flask server
   python app.py
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///linkedin_clone.db
JWT_SECRET_KEY=your-jwt-secret-here
FLASK_ENV=development
FLASK_DEBUG=True
```

For production, update these values with secure secrets and a production database URL.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (requires auth)
- `GET /api/posts/user/:userId` - Get posts by specific user

### Users
- `GET /api/users/:userId` - Get user profile

## 🧪 Demo Users

The application starts with an empty database. You can:

1. Register new users through the frontend
2. Create demo accounts for testing:
   - Name: John Doe, Email: john@example.com, Password: password123
   - Name: Jane Smith, Email: jane@example.com, Password: password123

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to Vercel or Netlify
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

### Backend (Render/Heroku)
1. Update `config.py` with production database URL
2. Deploy to Render or Heroku
3. Set environment variables in deployment platform

## 🎨 Features in Detail

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### User Interface
- Clean, professional design inspired by LinkedIn
- Responsive layout for mobile and desktop
- Intuitive navigation and user experience

### Data Management
- SQLAlchemy ORM for database operations
- Proper foreign key relationships
- Efficient API design with proper status codes

## 🔮 Future Enhancements

- Image uploads for posts and profiles
- Like and comment system
- Real-time notifications
- Search functionality
- Email verification
- Password reset functionality
- Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`  
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Author

Created as a full-stack development project demonstrating modern web development practices with React and Flask.

---

**Built with ❤️ using React, TypeScript, Flask, and SQLAlchemy**
