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
                  <h5 class="card-title text-center">{{ service }}</h5>
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
                <tr v-for="item in serviceHistory" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.service_name }}</td>
                  <td>{{ item.professional_name }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.date_request }}</td>
                  <td>
                    <button 
                      v-if="item.status === 'close it'" 
                      class="btn btn-primary btn-sm"
                      @click="redirectToRemarks(item.id)"
                    >
                      {{ item.status }}
                    </button>
                    <span v-else>{{ item.status }}</span>
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
        services: ["Plumbing", "Electrical", "Cleaning","AC","TV repair","others"],
      };
    },
    mounted() {
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
            }),
        fetch('/get_requests',{
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem('auth_token')
            }
          })
          .then(response => response.json())
          .then(data => {
              this.serviceHistory = data;
            });
        },
    methods: {
      navigateToBooking(service) {
        this.$router.push('/open/' + service);
      },
      redirectToRemarks(requestId) {
        this.$router.push('/remarks/' + requestId);
      }
    }
  };
  