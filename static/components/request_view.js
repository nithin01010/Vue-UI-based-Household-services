export default {
    template: `
      <div class="container py-4">
          <div class="row justify-content-center">
              <div class="col-md-6">
                  <div class="card shadow">
                      <div class="card-body">
                          <h2 class="card-title text-center mb-4">Request Details</h2>
                          
                          <div v-if="service">
                              <div class="mb-3">
                                  <label class="form-label">Service Id:</label>
                                  <input type="number" class="form-control" :value="service.id" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Service Name:</label>
                                  <input type="text" class="form-control" :value="service.service_name" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Customer Name:</label>
                                  <input type="text" class="form-control" :value="service.customer_name" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Professional Name:</label>
                                  <input type="text" class="form-control" :value="service.professional_name" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Request Date:</label>
                                  <input type="text" class="form-control" :value="service.date_request" readonly>
                              </div>
                              <div class="mb-3" v-if="service.date_close">
                                  <label class="form-label">Closed Date:</label>
                                  <input type="text" class="form-control" :value="service.date_close" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Rating:</label>
                                  <input type="number" class="form-control" :value="service.rating" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Remarks:</label>
                                  <input type="text" class="form-control" :value="service.remarks" readonly>
                              </div>
                              <button @click="blockRequest" class="btn btn-danger mt-3">Block Request</button>
                          </div>
  
                          <div v-else>
                              <p>Loading service details...</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `,
    data() {
      return {
        service: null,
        serviceId: null,
      };
    },
    mounted() {
      this.serviceId = this.$route.params.id;
      this.fetchServiceDetails();
    },
    methods: {
      fetchServiceDetails() {
        fetch(`/api/view_request/${this.serviceId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth_token'),
          }
        })
          .then(response => {
            if (!response.ok) throw new Error("Failed to fetch service details");
            return response.json();
          })
          .then(data => {
            this.service = data;
          })
          .catch(error => {
            console.error("Error fetching service details:", error);
          });
      },
      blockRequest() {
        fetch('/api/Block_request', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ id: this.serviceId }),
        })
          .then(response => {
            if (!response.ok) throw new Error("Failed to block the request");
            alert("Request blocked successfully.");
            this.$router.push("/dashboard");
          })
          .catch(error => {
            console.error("Error blocking request:", error);
          });
      },
    },
  };
  