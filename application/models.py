from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model, UserMixin):
    # required for flask security
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    roles = db.relationship('Role', backref='bearer', secondary='users_roles')


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)

# many-to-many
class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
#---------------------------------------------------------------------------------------------------------------------------------
# Customer Model
class Customer(db.Model):
    __tablename__ = 'Customer'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    login_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    fullname = db.Column(db.String(150), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    pincode = db.Column(db.Integer, nullable=False)
    number = db.Column(db.Integer, nullable=False, unique=True)
    status = db.Column(db.String(20), nullable=True)
    user = db.relationship('User', backref='customers')

hidden_requests = db.Table('hidden_requests',
    db.Column('request_id', db.Integer, db.ForeignKey('request.id'), primary_key=True),
    db.Column('professional_id', db.Integer, db.ForeignKey('Professional.id'), primary_key=True),
    extend_existing=True 
)
# Professional Model
class Professional(db.Model):
    __tablename__ = 'Professional'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    login_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    fullname = db.Column(db.String(150), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(250), nullable=False)
    pincode = db.Column(db.Integer, nullable=False)
    number = db.Column(db.Integer, nullable=False, unique=True)
    service = db.relationship('Service', backref='Professionals')
    status = db.Column(db.String(20), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    resume_url = db.Column(db.String, nullable=True)
    
# New Service
class Request(db.Model):
    __tablename__ = 'request'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('Customer.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('Professional.id'), nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    remarks = db.Column(db.String(600), nullable=True)
    date_request = db.Column(db.Date, nullable=True)
    date_close = db.Column(db.Date, nullable=True)
    # Relationships
    hidden_from_professionals = db.relationship('Professional', secondary=hidden_requests, backref='hidden_requests') 
    customer = db.relationship('Customer', backref='requests')
    professional = db.relationship('Professional', backref='requests')
    service = db.relationship('Service', backref='requests')

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    categorie = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=True)