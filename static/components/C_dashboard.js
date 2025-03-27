export default {
  template: `
    <div class="container mt-4">
      <!-- Available Services Section -->
      <section class="mb-5">
        <h2 class="text-primary mb-3 text-center">Looking For?</h2>
        <div class="row g-3 mt-2">
          <div v-for="service in services" :key="service" class="col-md-4">
            <div 
              class="card h-100 shadow" 
              @click="navigateToBooking(service)" 
              style="cursor: pointer;"
            >
              <div class="card-body">
                <h5 class="card-title text-center">
                  <router-link :to="'/C_booking/' + service" style="text-decoration: none;">
                    {{ service }}
                  </router-link>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Service History Section -->
      <section>
        <h2 class="text-primary mb-3 text-center">Service History</h2>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Professional Name</th>
                <th>Phone No.</th>
                <th>Date of Request</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in serviceHistory" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.service_name }}</td>
                <td>{{ item.professional.fullname }}</td>
                <td>{{ item.professional.number }}</td>
                <td>{{ item.date_request }}</td>
                <td>
                  <router-link v-if="item.status === 'Accepted'" 
                    class="btn btn-primary btn-sm" :to="'/request_view/' + item.id">
                    Close it?
                  </router-link>
                  <span v-else>
                    {{ item.status }}  
                    <button class="btn btn-danger btn-sm" @click="deleteRequest(item.id)" v-if="item.status === 'Requested'">
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  data() {
    return {
      serviceHistory: [],
      userData: {},  
      services: ["Plumbing", "Electrical", "Cleaning", "AC", "TV repair", "Others"],
    };
  },
  mounted() {
      this.userdata();
      this.userservices();
  },
  methods: {
      deleteRequest(id) {
          fetch(`/api/delete_request/${id}`, {
              method: 'DELETE',
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("auth_token")
              }
          })
          .then(response => response.json())
          .then(data => {
              alert(data.message);
              this.userservices(); 
          })
      },
      userdata() {
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
      },
      userservices() {
          fetch('/api/get_requests', {
              method: 'GET',
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem('auth_token')
              }
          })
          .then(response => response.json())
          .then(data => {
              this.serviceHistory = data;
          })
      }
  }
}
