from flask_restful import Api,Resource,reqparse
from .models import *
from datetime import date
from flask_security import auth_required,roles_required,current_user,roles_accepted

api=Api()

def roles_list(roles):
    list=[]
    for i in roles:
        list.append(i.name)
    return list

parser = reqparse.RequestParser()
parser.add_argument('service_id')
parser.add_argument('service_name')
parser.add_argument('service_description')
parser.add_argument('service_price')
parser.add_argument('service_category')


class Requests(Resource):
    @auth_required('token')
    @roles_accepted('customer','admin','professional')
    def get(self):
        request_json=[]
        if "admin" in roles_list(current_user.roles):
            requests=Request.query.all()
        elif "customer" in roles_list(current_user.roles):
            requests=Request.query.filter_by(customer_id=current_user.id).all()
        else:
            requests=Request.query.filter_by(professional_id=current_user.id).all()
        for request in requests:
            this_tran={}
            this_tran["id"]=request.id
            this_tran["customer_id"]=request.customer_id
            this_tran["professional_id"]=request.professional_id
            this_tran["service_id"]=request.service_id
            this_tran["status"]=request.status
            this_tran["date_request"]=request.date_request 
            this_tran["rating"]=request.rating
            this_tran["remark"]=request.remarks
            this_tran["date_close"]=request.date_close
            request_json.append(this_tran)
        if request_json :
            return request_json
        return {
            "message": "No requests found"
        },404
    @auth_required('token')
    @roles_accepted('customer','professional')
    def post(self):
        args= parser.parse_args()
        try:
            request = Request(customer_id=current_user.id,service_id=args["service_id"],
                                status="Requested", date_request=date.today())
            db.session.add(request)
            db.session.commit()
        except:
            return {"message": "Error occured while adding"}, 404
        return {"message": "Request added successfully"}, 201
    @auth_required('token')
    @roles_accepted('customer')
    def put(self,id):
        args= parser.parse_args()
        request = Request.query.get(id)
        if not request:
            return {"message": "Request not found"}, 404
        request.name= args.service_name
        db.session.commit()
        return {"message": "Request updated successfully"}, 200
    
    @auth_required('token')
    @roles_accepted('customer')
    def C_delete(self,id):
        request = Request.query.get(id)
        if not request:
            return {"message": "Request not found"}, 404
        if request.status!="pending":
            return {"message": "Cannot delete completed/accepted request"}, 403
        db.session.delete(request)
        db.session.commit()
        return {"message": "Request deleted successfully"}, 200
    @auth_required('token')
    @roles_accepted('professional')
    def P_delete(self,id):
        request = Request.query.get(id)
        if not request:
            return {"message": "Request not found"}, 404
        request.professional_id=None
        request.status="Request was cancelled by professional"
        db.session.commit()
        return {"message": "Request deleted successfully"}, 200
    
    @auth_required('token')
    @roles_accepted('admin')
    def A_delete(self,id):
        request = Request.query.get(id)
        if not request:
            return {"message": "Request not found"}, 404
        request.status="Request was cancelled by Admin"
        db.session.commit()
        return {"message": "Request deleted successfully"}, 200
    
class service(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    def get(self):
        services=Service.query.all()
        service_json=[]
        for service in services:
            this_service={}
            this_service["id"]=service.id
            this_service["name"]=service.name
            this_service["price"]=service.price
            this_service["rating"]=service.rating
            this_service["date_added"]=service.date_added
            service_json.append(this_service)
        if service_json :
            return service_json
        return {
            "message": "No services found"
        },404
    @auth_required('token')
    @roles_accepted('admin')
    def post(self):
        args= parser.parse_args()
        service = Service(name=args.service_name, description=args.service_description,
                            price=args.service_price,category=args.service_category)
        db.session.add(service)
        db.session.commit()
        return {"message": "Service added successfully"}, 201
    @auth_required('token')
    @roles_accepted('admin')
    def put(self,id):
        args= parser.parse_args()
        service = Service.query.get(id)
        if not service:
            return {"message": "Service not found"}, 404
        service.name= args.service_name
        service.description= args.service_description
        service.price=args.service_price
        service.category=args.service_category
        db.session.commit()
        return {"message": "Service updated successfully"}, 200
    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self,id):
        service = Service.query.get(id)
        if not service:
            return {"message": "Service not found"}, 404
        db.session.delete(service)
        db.session.commit()
        return {"message": "Service deleted successfully"}, 200




api.add_resource(Requests,'/api/get_requests','/api/create_request','/api/update/<int:id>',
                 '/api/C_delete/<int:id>','/api/P_delete/<int:id','/api/A_delete/<int:id>')

api.add_resource(service,'/api/get_services','/api/create_service')

























