from flask import Flask
from application.database import db
from application.models import  Customer, Professional, Request, Service, hidden_requests, User, Role
from application.Resource import api
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, hash_password

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name="admin", description="")
    app.security.datastore.find_or_create_role(name="customer", description="")
    app.security.datastore.find_or_create_role(name="professional", description="")
    db.session.commit()

    if not app.security.datastore.find_user(email="user@admin.com"):
        app.security.datastore.create_user(
            email="user@admin.com",
            username="admin01",
            password=hash_password("1234"),
            roles=["admin"] 
        )
    if not app.security.datastore.find_user(email="user1@user.com"):
        app.security.datastore.create_user(
            email="user1@user.com",
            username="user01",
            password=hash_password("1234"),
            roles=["customer"]
        )
    if not app.security.datastore.find_user(email="p@gmail.com"):
        app.security.datastore.create_user(
                email="p@gmail.com",
                username="P",
                password=hash_password("1234"),
                roles=["professional"]
            )
    db.session.commit()
from application.routes import *

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
