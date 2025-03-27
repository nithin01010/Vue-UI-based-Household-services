export default {
    template: `
      <div class="container d-flex justify-content-center align-items-center">
        <div class="card shadow-sm" style="width: 30rem;">
          <div class="card-body">
            <h2 class="card-title text-center text-primary">Service Professional Signup</h2>
            <form  enctype="multipart/form-data" class="mt-4">
              <div class="mb-3">
                <label for="email" class="form-label">Email ID (Username):</label>
                <input type="email" id="email" class="form-control" v-model="formData.email" placeholder="Enter your email" required>
              </div>
  
              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" id="password" class="form-control" v-model="formData.password" placeholder="Enter your password" required>
              </div>
  
              <div class="mb-3">
                <label for="fullname" class="form-label">Fullname:</label>
                <input type="text" id="fullname" class="form-control" v-model="formData.username" placeholder="Enter your full name" required>
              </div>
  
              <div class="mb-3">
                <label for="service" class="form-label">Service Name:</label>
                <select class="form-select" name="service" id="service" v-model="formData.service_id">
                  <option disabled value="">Please select a service</option>
                  <option v-for="service in services" :key="service.id" :value="service.id">
                    {{ service.name }}
                  </option>
                </select>
              </div>
  
              <div class="mb-3">
                <label for="experience" class="form-label">Experience (in yrs):</label>
                <input type="number" id="experience" class="form-control" v-model="formData.experience" placeholder="Enter your experience in years" required>
              </div>
  
              <div class="mb-3">
                <label for="address" class="form-label">Address:</label>
                <textarea id="address" class="form-control" v-model="formData.address" rows="3" placeholder="Enter your address" required></textarea>
              </div>
  
              <div class="mb-3">
                <label for="pincode" class="form-label">Pin Code:</label>
                <input type="number" id="pincode" class="form-control" v-model="formData.pincode" placeholder="Enter your pin code" required>
              </div>
  
              <div class="mb-3">
                <label for="number" class="form-label">Phone Number:</label>
                <input type="tel" id="number" class="form-control" v-model="formData.number" placeholder="Enter your phone number" required>
              </div>
  
              <!-- Display error if exists -->
              <div v-if="error" class="alert alert-danger text-center mt-3">
                {{ error }}
              </div>
              <button @click="register" class="btn btn-primary w-100">Register</button>
              <div class="text-center mt-3">
                <router-link class="btn btn-outline-success me-2" to="/login">Login</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,
    data: function() {
      return {
        formData: {
          email: "",
          password: "",
          username: "",
          service_id: "",
          experience: "",
          address: "",
          pincode: "",
          number: ""
        },
        services: [],
        error: ""
      }
    },
    mounted() {
      fetch('/api/get_services', {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        this.services = data;
      })
      .catch(err => console.error('Error fetching services:', err));
    },
    methods: {
        register: function() {
          fetch('/api/P_register', {
            method: 'POST',
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify(this.formData)
          })
          
        .then(response => response.json())
        .then(data => {
          alert("Account Created Successfully");
          this.$router.push('/login');
      })
        }
      }
      
  }
  