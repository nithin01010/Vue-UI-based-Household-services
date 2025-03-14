from flask_restful import Api,Resource,reqparse
from .models import *
from flask_security import auth_required,roles_required,current_user,roles_accepted

api=Api()

def roles_list(roles):
    list=[]
    for i in roles:
        list.append(i.name)
    return list

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



api.add_resource(Requests,'/api/get_requests')

























