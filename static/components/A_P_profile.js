export default {
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="card-title text-primary text-center mb-4">Professional</h2>
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
                <label for="Service" class="form-label fw-bold">Service Name:</label>
                <input type="text" class="form-control" id="Service" v-model="service_name" readonly>
              </div>

              <div class="mb-3">
                <label for="pincode" class="form-label fw-bold">Pincode:</label>
                <input type="text" class="form-control" id="pincode" v-model="pincode">
              </div>

              <div class="mb-3">
                <label for="experience" class="form-label fw-bold">Experience (Years):</label>
                <input type="number" class="form-control" id="experience" v-model="experience">
              </div>
            <div v-if="role==='admin'">
              <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
              <div 
              <div class="text-center">
                <button 
                  v-if="status === 'Active'" 
                  @click="blockProfessional" class="btn btn-danger mx-2">
                  Block
                </button>
                <button 
                  v-if="status === 'Blocked'" @click="unblockProfessional" 
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
      professional_id: null,
      fullname: '',
      phone: '',
      address: '',
      pincode: '',
      experience: '',
      service_name:'',
      service_id:'',
      status: '',
      error: '',
      role : '',
    };
  },
  mounted() {
    this.professional_id = this.$route.params.id;
    this.fetchProfessionalDetails();
    this.role = localStorage.getItem('role')
  },
  methods: {
    fetchProfessionalDetails() {
      fetch(`/api/view_professional/${this.professional_id}`, {
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
          this.experience = data.experience;
          this.status = data.status;
          this.service_name=data.service_name;
          this.service_id=data.service_id;
        })
        .catch(error => {
          this.error = "Error fetching professional details: " + error.message;
        });
    },
    blockProfessional() {
      fetch(`/api/Block_professional/${this.professional_id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to block professional");
          alert("Professional blocked successfully!");
          this.$router.push('/Dashboard')
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    unblockProfessional() {
      fetch(`/api/Unblock_professional/${this.professional_id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to unblock professional");
          alert("Professional unblocked successfully!");
          this.$router.push('/Dashboard')
        })
    },
    update() {
      fetch(`/api/update_professional`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify({
          fullname: this.fullname,
          number: this.phone,
          address: this.address,
          pincode: this.pincode,
          experience: this.experience,
          service_id: this.service_id
        })
      })
       .then(response => response.json())
       .then(data => {
          alert(data.message);
          this.$router.push('/P_dashboard');
        })
    }
  }
};
