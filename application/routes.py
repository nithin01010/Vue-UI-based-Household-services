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
            role = UsersRoles.query.filter_by(user_id=user.id).first()  
            if role:
                role_name = Role.query.get(role.role_id)
                if role_name=="customer" :
                    c=Customer.query.filter_by(login_id=user.id).first()
                    if c.status =='Blocked':
                        return jsonify({"message":"Account is Blocked by admin"})
                if role_name=="professional":
                    p=Professional.query.filter_by(login_id=user.id).first()
                    if p.status =='Blocked':
                        return jsonify({"message":"Account is Blocked by admin"})
                    if p.status=='Under Verification':
                        return jsonify({"message":"Your account is under verification"})
                return jsonify({
                    "id": user.id,
                    "name": user.username,
                    "token": user.get_auth_token(),
                    "role": role_name.name
                }), 200
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
                email=data.get("email"),            
                username=data.get("username"),
                password=generate_password_hash(data.get("password", "")),
                roles=["professional"]
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

@app.route("/api/view_service/<int:id>")
@auth_required('token')
@roles_required('admin')
def view_servie(id):
    service = Service.query.get(id)
    return jsonify({"name": service.name, "description": service.description, "price": service.price,"category": service.category}), 200

@app.route("/api/Block_request", methods=["POST"])
@auth_required('token')
@roles_required('admin')  
def Block_request():
    data = request.get_json()
    request1 = Request.query.get(data['id'])
    
    if request1:
        request1.status = "blocked by admin"
        db.session.commit()
        return jsonify({"message": "Request blocked successfully"}), 200
    else:
        return jsonify({"message": "Request not found"}), 404

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

@app.route('/api/view_customer/<int:id>')
@auth_required('token')
@roles_required('admin')
def view_customer(id):
    customer = Customer.query.get(id)
    return jsonify({"id": customer.id, "fullname": customer.fullname, "address": customer.address,
                   "pincode": customer.pincode, "number": customer.number, "status": customer.status}), 200

@app.route('/api/view_request/<int:id>')
@auth_required('token')
@roles_accepted('admin','customer')
def view_request(id):
    request = Request.query.get(id)
    if request.date_close:
        date=request.date_close.strftime('%Y-%m-%d')
    else:
        date=None
    c=Customer.query.filter_by(login_id=request.customer_id).first()
    p=Professional.query.filter_by(login_id=request.professional_id).first()
    if p is None:
        fullname="Not Assigned"
    else:
        fullname=p.fullname
    s=Service.query.filter_by(id=request.service_id).first()
    return jsonify({"id": request.id, "customer_name": c.fullname, "professional_name": fullname,
                   "service_name": s.name, "status": request.status, "date_request": request.date_request.strftime('%Y-%m-%d')
                   ,"date_close": date}), 200

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
            "experience": professional.experience,
            "service_id": professional.service_id
        })
    return jsonify(result)

@app.route('/api/view_professional/<int:id>')
@auth_required('token')
@roles_required('admin')
def view_professional(id):
    professional = Professional.query.get(id)
    return jsonify({"id": professional.id, "fullname": professional.fullname, "address": professional.address,
                   "pincode": professional.pincode, "number": professional.number, "status": professional.status,
                   "experience": professional.experience, "service_name": professional.service.name}), 200

@app.route('/api/Admin_search',methods=['POST'])
@auth_required('token')
@roles_required('admin')
def Admin_search():
    data = request.get_json()
    category = data['category']
    query = data['query'].lower()
    if category == 'service':
        if query=='closed':
            requests = Request.query.filter(Request.status=='completed').all()
        elif query=='open':
            requests = Request.query.filter(Request.status=='close it' or Request.status=='Requested').all()
        else:
            return jsonify({"message": "Please enter only Closed or Open"}), 400
        request_json=[]
        for request1 in requests:
                this_tran={}
                this_tran["id"]=request1.id
                this_tran["status"]=request1.status
                service=Service.query.get(request1.service_id)
                this_tran["service_name"]=service.name
                this_tran["service_price"]=service.price
                id=request1.customer_id
                customer=Customer.query.filter_by(login_id=id).first()
                this_tran["customer_name"]=customer.fullname
                professional= Professional.query.filter_by(login_id=request1.professional_id).first()
                if professional:
                    this_tran["professional_name"]=professional.fullname
                else:
                    this_tran["professional_name"]="Not Assigned"
                request_json.append(this_tran)
        return jsonify(request_json),200
    elif category == 'customers':
        customers=Customer.query.filter(Customer.fullname.ilike(f'%{query}%')).all()
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
    elif category == 'professionals':
        professionals = Professional.query.filter(Professional.fullname.ilike(f'%{query}%')).all()
        result = []
        for professional in professionals:
            service=Service.query.get(professional.service_id)
            result.append({
            "id": professional.id,
            "fullname": professional.fullname,
            "address": professional.address,
            "pincode": professional.pincode,
            "number": professional.number,
            "status": professional.status,
            "experience": professional.experience,
            "service_id": professional.service_id,
            "service_name": service.name
        })
    return jsonify(result)


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
        
@app.route("/api/customer_review", methods=["POST"])
@auth_required('token')
@roles_required('customer')
def customer_review():
        data= request.get_json()
        print(data)
        request1 = Request.query.get(data["id"])
        request1.remarks = data["remarks"]
        request1.rating = data["rating"]
        request1.status = "completed"
        service = Service.query.get(request1.service_id)
        if service.rating:
            service.rating = (service.rating +  float(data["rating"]))/2
        else:
            service.rating = data["rating"]
        db.session.commit()
        return {"message" : " Remarks added successfully"}



@app.route("/api/customer_search", methods=['POST'])
@auth_required('token')
@roles_required('customer')
def customer_search():
    data = request.get_json()
    query = data['query'].lower()
    category = data['category'].lower()
    if category == 'service':
        services = Service.query.filter(Service.name.ilike(f'%{query}%')).all()
    elif category == 'category':
        print("sdfghj")
        services = Service.query.filter(Service.category.ilike(f'%{query}%')).all()
    service_json=[]
    for service in services:
            this_service={}
            this_service["id"]=service.id
            this_service["name"]=service.name
            this_service["price"]=service.price
            this_service["rating"]=service.rating
            this_service["description"]=service.description
            this_service["category"]=service.category
            service_json.append(this_service)
    return jsonify(service_json)

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

@app.route("/api/update_professional", methods=["POST"])
@auth_required('token')
@roles_required('professional')
def update_professional():
    professional = Professional.query.filter_by(login_id=current_user.id)
    data = request.get_json()
    professional.fullname = data['name']
    professional.address = data['address']
    professional.phone = data['phone']
    professional.pincode = data['pincode']
    professional.service_id = data['service_id']
    professional.experience = data['experience']
    db.session.commit()
    return jsonify("Profile updated successfully")

@app.route("/api/prof_services")
@auth_required('token')
@roles_required('professional')
def prof_services():
        professional = Professional.query.filter_by(login_id=current_user.id).first()
        requests = Request.query.filter(
            Request.service_id == professional.service_id,
            ~Request.hidden_from_professionals.contains(professional)
        ).all()
        
        request_json = []
        for request in requests:
            if request.status == 'Requested':
                this_tran = {
                    "id": request.id,
                    "customer_id": request.customer_id,
                    "professional_name": request.professional.fullname if request.professional else "Not assigned yet",
                    "phone": request.professional.number if request.professional else "Not assigned yet",
                    "service_id": request.service_id,
                    "status": request.status,
                    "date_request": request.date_request.strftime('%Y-%m-%d'),
                    "rating": request.rating,
                    "remark": request.remarks,
                    "service_name": request.service.name if request.service else "Unknown",
                    "professional_id": request.professional_id,
                    "date_close": request.date_close.strftime('%Y-%m-%d') if request.date_close else "Not closed yet"
                }

                customer = Customer.query.filter_by(login_id=request.customer_id).first()
                if customer:
                    this_tran["customer"] = {
                        "fullname": customer.fullname,
                        "address": customer.address,
                        "pincode": customer.pincode,
                        "number": customer.number
                    }
                else:
                    this_tran["customer"] = {"fullname": "Unknown", "address": "", "pincode": "", "number": ""}

                request_json.append(this_tran)

        return jsonify(request_json)

@app.route("/api/reject_request", methods=["POST"])
@auth_required('token')
@roles_required('professional')
def reject_request():
    id=request.get_json()
    request1 = Request.query.get(id)
    professional = Professional.query.filter_by(login_id=current_user.id).first()
    if professional is not None:
        request1.hidden_from_professionals.append(professional)
        db.session.commit()
    
    all_professionals = Professional.query.filter_by(service_id=request1.service_id).all()
    all_rejected = all(pro in request1.hidden_from_professionals for pro in all_professionals)
    
    if all_rejected:
        request1.status = "rejected"
        db.session.commit()
    
    return {"message": "Request rejected successfully"}


@app.route("/api/accept_request", methods=["POST"])
@auth_required('token')
@roles_required('professional')
def accept_request():
    id=request.get_json()
    request1 = Request.query.get(id)
    request1.professional_id= current_user.id
    request1.status="Accepted"
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

















