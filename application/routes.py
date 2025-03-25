from flask import current_app as app,jsonify,request,render_template
from .models import *
from flask_login import login_user
from flask_security import hash_password,auth_required,roles_required,current_user,roles_accepted
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from .database import db
@app.route('/')
def home():
    return render_template("index.html")

@app.route("/api/home", methods=["GET"])
@auth_required('token')
@roles_accepted('customer','admin','professional')
def home12():
    user=current_user
    return jsonify({"username": user.username,"email": user.email , "password" : user.password,"token": user.get_auth_token()}), 200


@app.route("/api/login" , methods=["POST"])
def login():
    data = request.get_json()
    user = app.security.datastore.find_user(email=data["email"])
    if user :
        if check_password_hash(user.password, data["password"]):
            login_user(user)
            return jsonify({"id": user.id,"name" : user.username, "token": user.get_auth_token()}), 200
        else:
            return jsonify({"message" : "Wrong password"}),400
    return jsonify({"message": "Account Not found"}), 400

@app.route("/api/C_register", methods=["POST"])
def C_register():
    data = request.get_json()
    if not app.security.datastore.find_user(email=data["email"]):
        try:
            app.security.datastore.create_user(
                email=data.get("email"),            # Use .get() to avoid KeyError
                username=data.get("username"),
                password=generate_password_hash(data.get("password", "")),
                roles=["customer"]
            )
            db.session.commit()
        except IntegrityError:
            db.session.rollback()  # Rollback to maintain DB integrity
            return jsonify({"message": "Username or email already exists"}), 400
        user1=app.security.datastore.find_user(email=data["email"]).id
        try:
            customer = Customer(fullname=data['username'], address=data['address'], pincode=data['pincode'], login_id=user1,
                                number=data['number'] ,status="Active")
            db.session.add(customer)
            db.session.commit()
            return jsonify({"message": "User created successfully"}), 200
        
        except Exception as e:
            return jsonify({"message": "Enter valid details"}),500
        
    return jsonify({"message": "User Already exists"}), 400


@app.route("/api/P_register", methods=["POST"])
def P_register():
    data = request.get_json()
    if not app.security.datastore.find_user(email=data["email"]):
        try:
            app.security.datastore.create_user(
                email=data.get("email"),            # Use .get() to avoid KeyError
                username=data.get("username"),
                password=generate_password_hash(data.get("password", "")),
                roles=["customer"]
            )
            db.session.commit()
        except IntegrityError:
            db.session.rollback()  # Rollback to maintain DB integrity
            return jsonify({"message": "Username or email already exists"}), 400
        user1=app.security.datastore.find_user(email=data["email"]).id
        try:
            professional = Professional(fullname=data['username'], address=data['address'], pincode=data['pincode'],
                                        login_id=user1,number=data['number'] ,status="Under Verification",experience = data['experience'],
                                        service_id= data['service_id'])
            db.session.add(professional)
            db.session.commit()
        except Exception as e:
            db.session.rollback() 
            return jsonify({"message": "Enter valid details"}),500
        return jsonify({"message": "User created successfully"}), 200
    return jsonify({"message": "User Already exists"}), 400
#-------------------------------------------------------------ADMIN APIs----------------------------------------------------------------------

@app.route("/api/accept_professional/<int:id>", methods=['POST'])
@auth_required('token')
@roles_required('admin')
def accept_professional(id):
    professional = Professional.query.get(id)
    professional.status = "Active"
    db.session.commit()
    return jsonify({"message": "Professional Accepted successfully"}), 200

@app.route('/api/view_customers')
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

@app.route('/api/view_professionals')
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
            "experince": professional.experience,
            "service_id": professional.service_id
        })
    return jsonify(result)

@app.route('/api/view_requests')
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

@app.route('/api/Admin_search',methods=['POST'])
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


@app.route('/api/Block_customer/<int:id>', methods=['POST'])
@auth_required('token')
@roles_required("admin")
def Block_customer(id):
    customer = Customer.query.get(id)
    user=app.security.datastore.find_user(id=customer.login_id)
    user.active=False
    customer.status="Blocked"
    db.session.commit()
    return jsonify({"message": "User blocked successfully"}), 201


@app.route('/api/Unblock_customer/<int:id>', methods=['POST'])
@auth_required('token')
@roles_required('admin')
def Unblock_customer(id):
    customer = Customer.query.get(id)
    user=app.security.datastore.find_user(id=customer.login_id)
    user.active=True
    customer.status="Active"
    db.session.commit()
    return jsonify({"message": "User unblocked successfully"}), 201

@app.route('/api/Block_professional/<int:id>', methods=['POST'])
@auth_required('token')
@roles_required('admin')
def Block_professional(id):
    data = Professional.query.get(id)
    user=app.security.datastore.find_user(id=data.login_id)
    user.active=False
    data.status="Blocked"
    db.session.commit()
    return jsonify({"message": "User blocked successfully"}), 201

@app.route('/api/Unblock_professional/<int:id>', methods=['POST'])
@auth_required('token')
@roles_required('admin')
def Unblock_professional(id):
    data = Professional.query.get(id)
    user=app.security.datastore.find_user(id=data.login_id)
    user.active=True
    data.status="Active"
    db.session.commit()
    return jsonify({"message": "User unblocked successfully"}), 201

#--------------------------------------------------------------CUST APIS----------------------------------------------------------------------------

@app.route("/api/cutomer_profile",methods=['GET','POST'])
@auth_required('token')
@roles_required('customer')
def cutomer_profile():
    customer= Customer.query.get(current_user.id)
    if request.method=='POST':
        data= request.get_json()
        customer.fullname = data['fullname']
        customer.address = data['address']
        customer.phone = data['phone']
        customer.pincode = data['pincode']
        customer.address = data['address']
        db.session.commit()
        return jsonify("Profile updated successfully")
    return jsonify(customer.to_dict())
        
@app.route("/api/customer_review/<int:id>", methods=["POST"])
@auth_required('token')
@roles_required('customer')
def customer_review(self,id):
        data= request.get_json()
        request = Request.query.get(id)
        request.remarks = data["request_remarks"]
        request.rating = data["request_rating"]
        request.status = "completed"
        service = Service.query.get(request.service_id)
        service.rating = (service.rating +  data["request_rating"])/2
        db.session.commit()
        return {"message" : " Remarks added successfully"}



@app.route("/api/customer_search", methods=['POST'])
@auth_required('token')
@roles_required('customer')
def customer_search():
    data = request.get_json()
    query = data['query'].lower()
    category = data['category'].lower()
    if category == 'professional':
        results = Professional.query.filter(Professional.fullname.ilike(f'%{query}%')).all()
    elif category == 'service':
        results = Service.query.filter(Service.name.ilike(f'%{query}%')).all()
    elif category == 'category':
            results = Service.query.filter(Service.categorie.ilike(f'%{query}%')).all()
            results = [s for s in results if Professional.query.filter_by(service_id=s.id).first()]
    return jsonify(results)





#---------------------------------------------------------------PROF APIS---------------------------------------------------

@app.route("/api/professional_profile", methods=["POST","GET"])
@auth_required('token')
@roles_required('professional') 
def professional_profile():
    professional = Professional.query.get(current_user.id)
    if request.method=='POST':
        data= request.get_json()
        professional.fullname = data['fullname']
        professional.address = data['address']
        professional.phone = data['phone'] 
        professional.pincode = data['pincode']
        professional.experience = data['experience']
        db.session.commit()
        return jsonify("Profile updated successfully")
    return jsonify(professional.to_dict())

@app.route("/api/reject_request/<int:id>", methods=["POST"])
@auth_required('token')
@roles_required('professional')
def reject_request(id):
    request = Request.query.get(id)
    professional = Professional.query.filter_by(login_id=current_user.id).first()
    if professional is not None:
        request.hidden_from_professionals.append(professional)
        db.session.commit()
    
    all_professionals = Professional.query.filter_by(service_id=request.service_id).all()
    all_rejected = all(pro in request.hidden_from_professionals for pro in all_professionals)
    
    if all_rejected:
        request.status = "rejected"
        db.session.commit()
    
    return {"message": "Request rejected successfully"}


@app.route("/api/accept_request/<int:id>", methods=["POST"])
@auth_required('token')
@roles_required('professional')
def accept_request(self,id):
    request = Request.query.get(id)
    request.professional_id= current_user.id
    request.status=""
    db.session.commit()
    return {"message": "Request Accepted successfully"}, 200

@app.route("/api/professional_search")
@auth_required('token')
@roles_required('professional')
def professional_search():
    service_id = current_user.service_id
    hidden_request_ids = db.session.query(hidden_requests.c.request_id).filter(hidden_requests.c.professional_id == current_user.id)
    if request.method == 'POST':
        category = request.form.get('category')
        query = request.form.get('query').lower()
        if category == 'location':
            results = Request.query.join(Customer).filter(Request.service_id == service_id,Request.status == 'requested', 
                Customer.address.ilike(f'%{query}%'),~Request.id.in_(hidden_request_ids)).all()
        elif category == 'pincode':
            results = Request.query.join(Customer).filter(Request.service_id == service_id,Request.status == 'requested',
                    Customer.pincode.ilike(f'%{query}%'),~Request.id.in_(hidden_request_ids) ).all()
    return




















@app.route('/api/Accept_request',methods=['POST'])
@auth_required('token')
@roles_required('professional')
def Accept_request():
    data = request.get_json()
    request=Professional.query.get(data['id'])
    request.status = "close it"
    db.session.commit()
    return jsonify({"message": "Request accepted successfully"}), 201

















