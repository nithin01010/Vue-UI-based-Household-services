export default {
    template: `
      <div class="container mt-5">
        <!-- Services Table -->
        <section class="mb-5">
          <h2>Services</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Base Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(service, index) in services" :key="service.id">
                <td>
          <router-link  :to="'/update_service/'+ service.id" >{{ service.id }}</router-link>
                </td>
                <td>{{ service.name }}</td>
                <td>{{ service.price * 1000 }}</td>
              </tr>
            </tbody>
          </table>
          <router-link class="btn btn-success" to="/new_service" >+ Add new Service</router-link>
        </section>
    
        <!-- Professionals Table -->
        <section class="mb-5">
          <h2>Professionals</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Experience (Yrs)</th>
                <th>Service Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(professional, index) in professionals" :key="professional.id">
                <td><router-link :to="'/A_professionalprofile/'+professional.login_id " >{{index+1}}</router-link>
                </td>
                <td>{{ professional.fullname }}</td>
                <td>{{ professional.experience }}</td>
                <td>{{ getServiceName(professional.service_id) || 'Unknown Service' }}</td>
                <td>
                  <span v-if="professional.status === 'Under Verification'">
                    <a @click="accept_professional(professional.id)" class="btn btn-primary" style="cursor: pointer;">Accept</a> |
                    <a @click="block_professional(professional.id)"  class="btn btn-warning" style="cursor: pointer;">Reject</a>
                  </span>
                  <span v-else>{{ professional.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
    
        <!-- Service Requests Table -->
        <section>
          <h2>Service Requests</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Customer Name</th>
                <th>Assigned Professional</th>
                <th>Status (R/A/C)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(request, index) in requests" :key="request.id">
                <td><router-link  :to="'/request_view/'+request.id">{{ index + 1 }}</router-link></td>
                <td>{{ request.service_name  }}</td>
                <td>{{ request.customer.fullname}}</td>
                <td>{{ request.professional.fullname  }}</td>
                <td>{{ request.status === 'close it' ? 'Accepted' : request.status }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `,
    
    data() {
      return {
        userData: {},
        services: [],
        requests: [],
        professionals: []
      };
    },
    
    mounted() {
      // Fetch User Data
      fetch('/api/home', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
        .then(response => response.json())
        .then(data => {
          this.userData = data;
        })
    
      // Fetch Services
      fetch('/api/get_services', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => response.json())
        .then(data => {
          this.services = data;
        })
        .catch(error => console.error("Error fetching services:", error));
    
      // Fetch Service Requests
      fetch('/api/get_requests', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => response.json())
        .then(data => {
          this.requests = data;
        })
        .catch(error => console.error("Error fetching service requests:", error));
    
      // Fetch Professionals
      this.loaduser()
    },
    
    methods: {
      getServiceName(service_id) {
        const service = this.services.find(s => s.id === service_id);
        return service ? service.name : null;
      },
    
      accept_professional(prof_id) {
        fetch(`/api/accept_professional/${prof_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
        .then(response => {
          if (response.ok) {
            this.loaduser()
          }
        })
        .catch(error => console.error("Error accepting professional:", error));
      },
    
      block_professional(prof_id) {
        fetch(`/api/Block_professional/${prof_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
        .then(response => {
          if (response.ok) {
            this.loaduser()
          }
        })
        .catch(error => console.error("Error blocking professional:", error))
        },

        loaduser(){
        fetch('/api/view_professionals', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => response.json())
        .then(data => {
          this.professionals = data;
        })
        .catch(error => console.error("Error fetching professionals:", error));
        }
      }
    }
  
  