from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta
import hashlib
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///linkedin_clone.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
cors = CORS(app)

# Create tables
with app.app_context():
    db.create_all()

# Root endpoint for testing
@app.route('/')
def home():
    return jsonify({'message': 'Mini LinkedIn API is running', 'version': '1.0'}), 200

# Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    avatar = db.Column(db.String(255), default='')
    job_title = db.Column(db.String(100), default='')
    location = db.Column(db.String(100), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with posts
    posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete-orphan')
    liked_posts = db.relationship('PostLike', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        # Simple hash for demo purposes - use proper bcrypt in production
        self.password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password):
        # Simple hash check for demo purposes - use proper bcrypt in production
        return self.password_hash == hashlib.sha256(password.encode()).hexdigest()
    
    def to_dict(self, include_counts=False):
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'bio': self.bio or '',
            'avatar': self.avatar or '',
            'job_title': self.job_title or '',
            'location': self.location or '',
            'created_at': self.created_at.isoformat()
        }
        if include_counts:
            data['posts_count'] = len(self.posts)
        return data

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship with likes
    likes = db.relationship('PostLike', backref='post', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, current_user_id=None):
        likes_count = len(self.likes)
        liked_by_user = False
        
        if current_user_id:
            liked_by_user = any(like.user_id == current_user_id for like in self.likes)
        
        return {
            'id': self.id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author_id': self.author_id,
            'author_name': self.author.name,
            'author_avatar': self.author.avatar or '',
            'author_job_title': self.author.job_title or '',
            'likes_count': likes_count,
            'liked_by_user': liked_by_user
        }

class PostLike(db.Model):
    __tablename__ = 'post_likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a user can only like a post once
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),)

# Routes

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            bio=data.get('bio', ''),
            job_title=data.get('job_title', ''),
            location=data.get('location', ''),
            avatar=data.get('avatar', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict(include_counts=True)
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'message': 'Email and password required'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                'token': access_token,
                'user': user.to_dict(include_counts=True)
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Login failed'}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_counts=True)), 200
        
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'message': 'Failed to get profile'}), 500

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            user.name = data['name']
        if 'bio' in data:
            user.bio = data['bio']
        if 'job_title' in data:
            user.job_title = data['job_title']
        if 'location' in data:
            user.location = data['location']
        if 'avatar' in data:
            user.avatar = data['avatar']
        
        db.session.commit()
        
        return jsonify(user.to_dict(include_counts=True)), 200
        
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({'message': 'Failed to update profile'}), 500

# Post Routes
@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    try:
        # Get current user ID if authenticated
        current_user_id = None
        try:
            if request.headers.get('Authorization'):
                from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
                verify_jwt_in_request(optional=True)
                current_user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
        
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return jsonify([post.to_dict(current_user_id) for post in posts]), 200
    except Exception as e:
        print(f"Get posts error: {e}")
        return jsonify({'message': 'Failed to fetch posts'}), 500

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        data = request.get_json()
        # Get user ID from JWT token
        user_id = int(get_jwt_identity())
        
        if not data.get('content'):
            return jsonify({'message': 'Content is required'}), 400
        
        post = Post(
            content=data['content'],
            author_id=user_id
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify(post.to_dict(user_id)), 201
        
    except Exception as e:
        print(f"Create post error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to create post: {str(e)}'}), 500

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def toggle_like_post(post_id):
    try:
        # Get user ID from JWT token
        user_id = int(get_jwt_identity())
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        
        # Check if user already liked this post
        existing_like = PostLike.query.filter_by(user_id=user_id, post_id=post_id).first()
        
        if existing_like:
            # Unlike the post
            db.session.delete(existing_like)
            db.session.commit()
            liked = False
        else:
            # Like the post
            new_like = PostLike(user_id=user_id, post_id=post_id)
            db.session.add(new_like)
            db.session.commit()
            liked = True
        
        # Get updated post data
        updated_post = post.to_dict(user_id)
        
        return jsonify({
            'post': updated_post,
            'liked': liked,
            'likes_count': updated_post.get('likes_count', 0),
            'liked_by_user': updated_post.get('liked_by_user', False)
        }), 200
        
    except Exception as e:
        print(f"Toggle like error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to toggle like: {str(e)}'}), 500

@app.route('/api/posts/user/<int:user_id>', methods=['GET'])
def get_user_posts(user_id):
    try:
        # Get current user ID if authenticated
        current_user_id = None
        try:
            if request.headers.get('Authorization'):
                from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
                verify_jwt_in_request(optional=True)
                current_user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
        
        posts = Post.query.filter_by(author_id=user_id).order_by(Post.created_at.desc()).all()
        return jsonify([post.to_dict(current_user_id) for post in posts]), 200
    except Exception as e:
        print(f"Get user posts error: {e}")
        return jsonify({'message': 'Failed to fetch user posts'}), 500

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    try:
        user_id = int(get_jwt_identity())
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        
        if post.author_id != user_id:
            return jsonify({'message': 'Not authorized to delete this post'}), 403
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({'message': 'Post deleted successfully'}), 200
        
    except Exception as e:
        print(f"Delete post error: {e}")
        return jsonify({'message': 'Failed to delete post'}), 500

# Search Routes
@app.route('/api/posts/search', methods=['GET'])
def search_posts():
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({'message': 'Search query is required'}), 400
        
        # Search posts by content or author name
        posts = Post.query.join(User).filter(
            db.or_(
                Post.content.ilike(f'%{query}%'),
                User.name.ilike(f'%{query}%')
            )
        ).order_by(Post.created_at.desc()).limit(20).all()
        
        # Get the current user ID from JWT token if available
        current_user_id = None
        try:
            if request.headers.get('Authorization'):
                from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
                verify_jwt_in_request(optional=True)
                current_user_id = int(get_jwt_identity()) if get_jwt_identity() else None
        except:
            pass
        
        return jsonify({
            'posts': [post.to_dict(current_user_id) for post in posts],
            'query': query,
            'count': len(posts)
        }), 200
        
    except Exception as e:
        print(f"Search error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Search failed: {str(e)}'}), 500

# User Routes
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_counts=True)), 200
        
    except Exception as e:
        print(f"Get user error: {e}")
        return jsonify({'message': 'Failed to fetch user'}), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.order_by(User.name).all()
        return jsonify([user.to_dict(include_counts=True) for user in users]), 200
    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({'message': 'Failed to fetch users'}), 500

@app.route('/api/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'users': [], 'posts': []}), 200
        
        # Search users by name or job title
        users = User.query.filter(
            db.or_(
                User.name.ilike(f'%{query}%'),
                User.job_title.ilike(f'%{query}%')
            )
        ).limit(10).all()
        
        # Search posts by content
        posts = Post.query.filter(
            Post.content.ilike(f'%{query}%')
        ).order_by(Post.created_at.desc()).limit(10).all()
        
        return jsonify({
            'users': [user.to_dict(include_counts=True) for user in users],
            'posts': [post.to_dict() for post in posts]
        }), 200
        
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({'message': 'Search failed'}), 500

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
