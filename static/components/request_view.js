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
                            <div v-if="role==='admin'">
                              <div class="mb-3">
                                  <label class="form-label">Rating:</label>
                                  <input type="number" class="form-control" :value="service.rating || 0" readonly>
                              </div>
                              <div class="mb-3">
                                  <label class="form-label">Remarks:</label>
                                  <input type="text" class="form-control" :value="service.remarks || 'Request not over' " readonly>
                              </div>
                            </div>
                            <div v-else>
                              <div class="mb-3">
                                <label for="rating" class="form-label">Service Rating:</label>
                                <select class="form-select" id="rating" name="rating" v-model="rating" required>
                                    <option value="1">♦</option>
                                    <option value="2">♦♦</option>
                                    <option value="3">♦♦♦</option>
                                    <option value="4">♦♦♦♦</option>
                                    <option value="5">♦♦♦♦♦</option>
                                </select>
                            </div>
                              <div class="mb-3">
                                  <label class="form-label">Remarks:</label>
                                  <input type="text" class="form-control" v-model="remarks " required>
                              </div>
                            </div>
                              <div v-if="role==='admin' && service.status!='completed'">
                                <button @click="blockRequest" class="btn btn-danger mt-3">Block Request</button>
                              </div>
                              <div v-if="role==='customer'">
                                <div @click="remark" class="btn btn-danger" >Submit Remarks</div>
                              </div>
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
        service: [],
        serviceId: null,
        remarks:"",
        rating:3,
        role:""
      };
    },
    mounted() {
      this.serviceId = this.$route.params.id;
      this.fetchServiceDetails();
      this.role = localStorage.getItem('role')
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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth_token'),
          },
          body: JSON.stringify({ id: this.serviceId }),
        })
          .then(response => response.json())
          .then(data=>{
            alert("Request blocked successfully.");
            this.$router.push("/dashboard");
          })
          .catch(error => {
            console.error("Error blocking request:", error);
          });
      },
      remark(){
        fetch('/api/customer_review'
          , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth_token'),
            },
            body: JSON.stringify({
              id: this.serviceId,
              remarks: this.remarks,
              rating : this.rating
            })
          })
         .then(response => response.json())
         .then(data=>{
            alert("Request updated successfully.");
            this.$router.push("/C_dashboard");
          })
      }
    },
  };
  