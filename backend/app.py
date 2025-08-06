from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    
    # Initialize models
    from models import init_db
    global User, Post
    User, Post = init_db(db)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.posts import posts_bp
    from routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app('development')
    app.run(debug=True, port=5000)
