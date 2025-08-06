from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import app

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = app.User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Create new user
        user = app.User(
            name=data['name'],
            email=data['email'],
            bio=data.get('bio', '')
        )
        user.set_password(data['password'])
        
        app.db.session.add(user)
        app.db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'message': 'Email and password required'}), 400
        
        # Find user
        user = app.User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'token': access_token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'message': 'Login failed'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = app.User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get profile'}), 500
