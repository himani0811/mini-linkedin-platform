from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from sqlalchemy import desc

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('', methods=['GET'])
def get_all_posts():
    from app import Post  # Lazy import
    try:
        posts = Post.query.order_by(desc(Post.created_at)).all()
        return jsonify([post.to_dict() for post in posts]), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch posts'}), 500

@posts_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    from app import Post  # Lazy import
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        if not data.get('content'):
            return jsonify({'message': 'Content is required'}), 400

        post = Post(
            content=data['content'],
            author_id=user_id
        )

        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except Exception as e:
        return jsonify({'message': 'Failed to create post'}), 500

@posts_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_posts(user_id):
    from app import Post  # Lazy import
    try:
        posts = Post.query.filter_by(author_id=user_id).order_by(desc(Post.created_at)).all()
        return jsonify([post.to_dict() for post in posts]), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch user posts'}), 500
