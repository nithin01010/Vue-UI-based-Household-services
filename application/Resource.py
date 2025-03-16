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
parser.add_argument('Service_name')
parser.add_argument('Service_description')
parser.add_argument('Service_price')
parser.add_argument('Service_category')


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
        request = Request(customer_id=current_user.id,service_id=args["service_id"],
                            status="Requested", date_request=date.today())
        db.session.add(request)
        db.session.commit()
        return {"message": "Request added successfully"}, 201

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
        service = Service(name=args.Service_name, description=args.Service_description,price=args.Service_price)
        db.session.add(service)
        db.session.commit()
        return {"message": "Request added successfully"}, 201




api.add_resource(Requests,'/api/get_requests','/api/create_requests')

























