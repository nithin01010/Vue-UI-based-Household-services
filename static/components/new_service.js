export default {
    template: `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-primary text-center mb-4">Add New Service</h2>
              <form @submit.prevent="addService">
                <div class="mb-3">
                  <label for="service-name" class="form-label fw-bold">Service Name:</label>
                  <input type="text" class="form-control" id="service-name" v-model="service_name" required>
                </div>
                
                <div class="mb-3">
                  <label for="description" class="form-label fw-bold">Description:</label>
                  <textarea class="form-control" id="description" v-model="service_description" rows="4" required></textarea>
                </div>
                
                <div class="mb-3">
                  <label for="base-price" class="form-label fw-bold">Base Price:</label>
                  <input type="number" class="form-control" id="base-price" v-model="service_price" required>
                </div>
                
                <div class="mb-3">
                  <label for="category" class="form-label fw-bold">Category:</label>
                  <select class="form-select" id="category" v-model="service_category" required>
                    <option v-for="cat in categories" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                
                <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
                
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        service_name: '',
        service_description: '',
        service_price: '',
        service_category: '',
        // Replace this with your actual categories or fetch from an API.
        categories: ["Plumbing", "Electrical", "Cleaning"],
        error: ''
      };
    },
    methods: {
      addService() {
        fetch('/api/create_service', {  // Ensure your endpoint matches your backend route.
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            service_name: this.service_name,
            service_description: this.service_description,
            service_price: this.service_price,
            service_category: this.service_category
          })
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || "Failed to add service.");
            });
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          this.$router.push('/Dashboard');
        })
        .catch(err => {
          this.error = err.message;
        });
      }
    }
  };
  