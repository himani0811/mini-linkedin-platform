# Deployment Guide

## Quick Start (Development)

1. **Start Backend**:
   ```bash
   cd backend
   .venv\Scripts\activate  # Windows
   python app.py
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```
   Server runs on: http://localhost:3000

## Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`

#### Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`
5. Add environment variables:
   ```
   SECRET_KEY=your-production-secret-key
   JWT_SECRET_KEY=your-production-jwt-secret
   DATABASE_URL=your-production-database-url
   FLASK_ENV=production
   ```

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend Deployment (Netlify)
1. Push code to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable in Netlify dashboard

#### Backend Deployment (Heroku)
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add buildpack: `heroku buildpacks:add heroku/python`
4. Set environment variables:
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set JWT_SECRET_KEY=your-jwt-secret
   heroku config:set DATABASE_URL=your-database-url
   ```
5. Deploy: `git push heroku main`

## Database Setup for Production

### Using PostgreSQL (Recommended)

1. **Get PostgreSQL URL** from provider (Render, Heroku, etc.)
2. **Update config.py**:
   ```python
   SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
   ```
3. **Install psycopg2** in production environment

### Environment Variables Required

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET_KEY=your-jwt-secret-key
FLASK_ENV=production
```

## Testing the Deployed Application

1. **Visit your frontend URL**
2. **Register a new account**
3. **Create some posts**
4. **Test profile viewing**
5. **Verify authentication flow**

## Common Issues & Solutions

### CORS Issues
- Ensure Flask-CORS is properly configured
- Check that frontend URL is allowed in backend CORS settings

### Database Connection
- Verify DATABASE_URL format
- Ensure database service is running
- Check connection credentials

### API Connectivity
- Verify REACT_APP_API_URL points to correct backend URL
- Ensure backend server is accessible publicly
- Check API endpoints are responding

## Live Demo URLs

After deployment, update README.md with:
- **Frontend URL**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com
- **Demo Credentials**: Create test accounts for demo

## Security Notes for Production

1. **Use strong secrets** for JWT and Flask secret keys
2. **Enable HTTPS** on both frontend and backend
3. **Use proper password hashing** (implement bcrypt properly)
4. **Validate all inputs** on both client and server
5. **Set up proper CORS** policies
6. **Use environment variables** for all sensitive data
