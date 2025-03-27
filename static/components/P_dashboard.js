export default {
    template: `
        <div class="container py-4">
            <!-- Today's Services -->
            <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5>Services Requests</h5>
                </div>
                <div class="card-body">
                    <table v-if="requests.length" class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Service</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(request, index) in requests" :key="index">
                                <td>{{ request.id }}</td>
                                <td>{{ request.service_name }}</td>
                                <td>{{ request.customer.fullname }}</td>
                                <td>{{ request.customer.number }}</td>
                                <td>{{ request.customer.address }} ({{ request.customer.pincode }})</td>
                                <td>
                                    <button @click="rejectRequest(request.id)" class="btn btn-danger btn-sm">Reject</button>
                                    <button @click="acceptRequest(request.id)" class="btn btn-success btn-sm">Accept</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else>No Service Requests</p>
                </div>
            </div>

            <div class="card rounded-3 shadow-sm">
                <div class="card-header bg-secondary text-white">
                    <h5>Services history</h5>
                </div>
                <div class="card-body">
                    <table v-if="closed.length" class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Date Closed</th>
                                <th>Status</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(service, index) in closed" :key="index">
                                <td>{{ service.id }}</td>
                                <td>{{ service.customer.fullname }}</td>
                                <td>{{ service.customer.number }}</td>
                                <td>{{ service.customer.address }} ({{ service.customer.pincode }})</td>
                                <td>{{ service.date_close }}</td>
                                <td>{{ service.status === 'close it' ? 'Accepted' : service.status }}</td>
                                <td>{{ service.rating || 'No Rating' }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else>No History</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            requests: [],
            closed: []
        };
    },
    mounted() {
        this.fetchRequests();
        this.CurrentRequests();
    },
    methods: {
        fetchRequests() {
            // Fetch today's requests from an API endpoint
            fetch('/api/get_requests',
                {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                }
                )
                .then(response => response.json())
                .then(data => {
                    this.closed=data
                })
        },
        CurrentRequests(){
            fetch('/api/prof_services',
                {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                }
                )
               .then(response => response.json())
               .then(data => {
                    this.requests = data
                })
        },
        rejectRequest(id) {
            fetch('/api/reject_request',
                { 
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify({id})
                }).then(response => response.json())
                .then(data => {
                    this.fetchRequests();
                    this.CurrentRequests();
                })
        },
        acceptRequest(id) {
            fetch('/api/accept_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify({id})
        }).then(response => response.json)
        .then(data => {
            this.fetchRequests();
            this.CurrentRequests();
        })
            
        }
    }
};
