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

@app.route('/api/Accept_professional',methods=['POST'])
def Accept_professional():
    data = request.get_json()
    request=Professional.query.get(data['id'])
    request.status = "close it"
    db.session.commit()
    return jsonify({"message": "Request accepted successfully"}), 201



@app.route('/api/view_customers',method=['POST'])
@auth_required('token')
@roles_required('admin')
def view_customers():
    customers = Customer.query.all()
    result = []
    for customer in customers:
        result.append({
            "id": customer.id,
            "fullname": customer.fullname,
            "address": customer.address,
            "pincode": customer.pincode,
            "number": customer.number,
            "status": customer.status
        })
    return jsonify(result)

@app.route('/api/view_professionals',method=['POST'])
@auth_required('token')
@roles_required('admin')
def view_professionals():
    professionals = Professional.query.all()
    result = []
    for professional in professionals:
        result.append({
            "id": professional.id,
            "fullname": professional.fullname,
            "address": professional.address,
            "pincode": professional.pincode,
            "number": professional.number,
            "status": professional.status,
            "experince": professional.experince,
            "service_id": professional.service_id
        })
    return jsonify(result)

@app.route('/api/view_requests',method=['POST'])
@auth_required('token')
@roles_required('admin')
def view_requests():
    requests = Request.query.all()
    result = []
    for request in requests:
        result.append({
            "id": request.id,
            "customer_id": request.customer_id,
            "professional_id": request.professional_id,
            "service_id": request.service_id,
            "date_time": request.date_time,
            "status": request.status,
            "remarks": request.remarks,
            "rating": request.rating
        })
    return jsonify(result)

@app.route('/api/Admin_search',method=['POST'])
@auth_required('token')
@roles_required('admin')
def Admin_search():
    data = request.get_json()
    category = data['category']
    query = data['query'].lower()
    if category == 'service':
        if query=='closed':
            results = Request.query.filter(Request.status=='closed').all()
        elif query=='open':
            results = Request.query.filter(Request.status=='close it' or Request.status=='requested').all()
        else:
            return jsonify({"message": "Please enter only Closed or Open"}), 400
    elif category == 'customers':
        results=Customer.query.filter(Customer.fullname.ilike(f'%{query}%')).all()
    elif category == 'professionals':
        results = Professional.query.filter(Professional.fullname.ilike(f'%{query}%')).all()
    return jsonify(results)


@app.route("route")
@auth_required('token')
@roles_required('/api/Block_customer')
def Block_customer():
    data = request.get_json()
    user=app.security.datastore.find_user(email=data['email'])
    user.active='Blocked'
    db.session.commit()
    return jsonify({"message": "User blocked successfully"}), 201


@app.route("route")
@auth_required('token')
@roles_required('/api/Unblock_customer')
def Unblock_customer():
    data = request.get_json()
    user=app.security.datastore.find_user(email=data['email'])
    user.active='Active'
    db.session.commit()
    return jsonify({"message": "User unblocked successfully"}), 201

@app.route('/api/Block_professional', methods=['POST'])
@auth_required('token')
@roles_required('user')
def Block_professional():
    data = request.get_json()
    user=app.security.datastore.find_user(email=data['email'])
    user.active='Blocked'
    db.session.commit()
    return jsonify({"message": "User blocked successfully"}), 201

@app.route('/api/Unblock_professional', methods=['POST'])
@auth_required('token')
@roles_required('user')
def Unblock_professional():
    data = request.get_json()
    user=app.security.datastore.find_user(email=data['email'])
    user.active='Active'
    db.session.commit()
    return jsonify({"message": "User unblocked successfully"}), 201

#--------------------------------------------------------------------------------------------------------------------------------------------------




@app.route('/api/review',method=['POST'])
@auth_required('token')
@roles_required('user')
def Review():
    data = request.get_json()
    request=Request.query.get(data['id'])
    request.remarks= data['remarks']
    request.rating = data['rating']
    service= Service.query.get(request.id)
    service
    db.session.commit()
    return jsonify({"message": "Review added successfully"}), 201





















