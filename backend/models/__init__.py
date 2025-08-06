from datetime import datetime
import hashlib

def init_db(db):
    class User(db.Model):
        __tablename__ = 'users'
        
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(100), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password_hash = db.Column(db.String(128), nullable=False)
        bio = db.Column(db.Text)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # Relationship with posts
        posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete-orphan')
        
        def set_password(self, password):
            # Simple hash for demo purposes - use proper bcrypt in production
            self.password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        def check_password(self, password):
            # Simple hash check for demo purposes - use proper bcrypt in production
            return self.password_hash == hashlib.sha256(password.encode()).hexdigest()
        
        def to_dict(self):
            return {
                'id': self.id,
                'name': self.name,
                'email': self.email,
                'bio': self.bio,
                'created_at': self.created_at.isoformat()
            }

    class Post(db.Model):
        __tablename__ = 'posts'
        
        id = db.Column(db.Integer, primary_key=True)
        content = db.Column(db.Text, nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        
        def to_dict(self):
            return {
                'id': self.id,
                'content': self.content,
                'created_at': self.created_at.isoformat(),
                'author_id': self.author_id,
                'author_name': self.author.name
            }
    
    return User, Post
