export default {
    template: `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-primary text-center mb-4">Customer</h2>
              <form>
                <div class="mb-3">
                  <label for="fullname" class="form-label fw-bold">Full Name:</label>
                  <input type="text" class="form-control" id="fullname" v-model="fullname">
                </div>
  
                <div class="mb-3">
                  <label for="phone" class="form-label fw-bold">Phone:</label>
                  <input type="tel" class="form-control" id="phone" v-model="phone">
                </div>
  
                <div class="mb-3">
                  <label for="address" class="form-label fw-bold">Location:</label>
                  <input type="text" class="form-control" id="address" v-model="address">
                </div>
  
  
                <div class="mb-3">
                  <label for="pincode" class="form-label fw-bold">Pincode:</label>
                  <input type="text" class="form-control" id="pincode" v-model="pincode">
                </div>
  
                <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
                <div v-if="role==='admin'">
                    <div class="text-center">
                    <button 
                        v-if="status === 'Active'" 
                        @click="blockcustomer" 
                        class="btn btn-danger mx-2">
                        Block
                    </button>
                    <button 
                        v-if="status === 'Blocked'" 
                        @click="unblockcustomer" 
                        class="btn btn-success">
                        Unblock
                    </button>
                    </div>
                </div>
                <div v-else>
                    <div @click="update" class="btn btn-primary">Update</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        customer_id: null,
        fullname: '',
        phone: '',
        address: '',
        pincode: '',
        status: '',
        error: '',
        role:'',
      };
    },
    mounted() {
      this.customer_id = this.$route.params.id;
      this.fetchProfessionalDetails();
      this.role = localStorage.getItem('role')
    },
    methods: {
      fetchProfessionalDetails() {
        fetch(`/api/view_customer/${this.customer_id}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
          .then(response => response.json())
          .then(data => {
            this.fullname = data.fullname;
            this.phone = data.number;
            this.address = data.address;
            this.pincode = data.pincode;
            this.status = data.status;
          })
          .catch(error => {
            this.error = "Error fetching professional details: " + error.message;
          });
      },
      blockcustomer() {
        fetch(`/api/Block_customer/${this.customer_id}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
          .then(response => response.json)
          .then(data => {
            alert("Customer blocked successfully!");
            this.$router.push('/C_dashboard')
          })
      },
      unblockcustomer() {
        fetch(`/api/Unblock_customer/${this.customer_id}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
          .then(response => response.json())
          .then(data => {
            alert("Customer unblocked successfully!");
            this.$router.push('/C_dashboard')
          })
      },
      update() {
        fetch(`/api/cutomer_profile`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify({
            fullname: this.fullname,
            number: this.phone,
            address: this.address,
            pincode: this.pincode
          })
        })
         .then(response => response.json())
         .then(data => {
            alert("Customer updated successfully!");
            this.$router.push('/C_dashboard')
          })
        }
    }
}
  