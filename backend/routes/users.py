from flask import Blueprint, jsonify
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    from app import User  # Lazy import
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch user'}), 500

