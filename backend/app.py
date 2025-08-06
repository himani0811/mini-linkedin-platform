from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from config import config

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    from routes.auth import auth_bp
    from routes.posts import posts_bp
    from routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    return app

# ✅ This block ensures compatibility with both local & Render deployment
if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app = create_app('development')
    app.run(host='0.0.0.0', port=port, debug=True)
