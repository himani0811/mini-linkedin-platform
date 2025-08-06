<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for LinkedIn Clone Project

This is a full-stack Mini LinkedIn-like Community Platform built with React (TypeScript) frontend and Flask backend.

## Project Context

- **Frontend**: React 18 with TypeScript, React Router, Axios
- **Backend**: Flask with SQLAlchemy, JWT authentication, Flask-CORS
- **Database**: SQLite (development), easily configurable for PostgreSQL (production)
- **Architecture**: RESTful API design with JWT-based authentication

## Code Style Guidelines

### Frontend (React/TypeScript)
- Use functional components with React hooks
- Implement proper TypeScript typing for all props and state
- Follow React best practices for state management
- Use CSS classes following LinkedIn-inspired design patterns
- Implement proper error handling and loading states

### Backend (Flask/Python)
- Follow Flask blueprint pattern for route organization
- Use SQLAlchemy ORM for database operations
- Implement proper error handling with appropriate HTTP status codes
- Follow REST API conventions
- Use JWT for secure authentication

## Key Features to Maintain
- User authentication (register/login)
- Profile management with bio support
- Post creation and viewing
- Public feed with chronological ordering
- Responsive, professional UI design

## Development Practices
- Maintain separation between frontend and backend
- Use proper CORS configuration for cross-origin requests
- Implement proper validation on both client and server sides
- Follow security best practices for authentication and data handling
