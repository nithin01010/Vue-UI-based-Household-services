from flask import current_app as app,jsonify,request
from .models import *
from flask_security import hash_password,auth_required,roles_required,current_user
from .database import db
@app.route('/api/admin')
@auth_required('token') #Auth
@roles_required('admin') #RBAC
def admin():
    return {
        "msg" : "Admin here!"
    }

@app.route("/api/user")
@roles_required('user')
@auth_required('token') #Auth
def User_home():
    user = current_user
    return jsonify(
        {
            "username": user.username,
            "email": user.email,
            "password": user.password
        }
    )

@app.route("/api/C_register", methods=["POST"])
def C_register():
    data = request.get_json()
    if not app.security.datastore.find_user(email=data["email"]):
        app.security.datastore.create_user(
            email=data["email"],
            username=data["username"],
            password=hash_password(data["password"]),
            roles=["customer"]
        )
        user1=app.security.datastore.find_user(email=data["email"]).id
        customer = Customer(fullname=data['username'], address=data['address'], pincode=data['pincode'], login_id=user1,
                            number=data['number'] ,status="Pending")
        db.session.add(customer)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    return jsonify({"message": "User Already exists"}), 400


@app.route("/api/P_register", methods=["POST"])
def P_register():
    data = request.get_json()
    if not app.security.datastore.find_user(email=data["email"]):
        app.security.datastore.create_user(
            email=data["email"],
            username=data["username"],
            password=hash_password(data["password"]),
            roles=["customer"]
        )
        user1=app.security.datastore.find_user(email=data["email"]).id
        professional = Professional(fullname=data['username'], address=data['address'], pincode=data['pincode'],
                                     login_id=user1,number=data['number'] ,status="Pending",experince = data['experince'],
                                     service_id= data['service_id'])
        db.session.add(professional)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    return jsonify({"message": "User Already exists"}), 400