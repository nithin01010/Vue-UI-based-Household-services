export default {
    template: `
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-primary text-center mb-4">Update Service</h2>
              <form >
                <div class="mb-3">
                  <label for="service-name" class="form-label fw-bold">Service Name:</label>
                  <input type="text" class="form-control" id="service-name" v-model="service_name">
                </div>
                
                <div class="mb-3">
                  <label for="description" class="form-label fw-bold">Description:</label>
                  <textarea class="form-control" id="description" v-model="service_description" rows="4" ></textarea>
                </div>
                
                <div class="mb-3">
                  <label for="base-price" class="form-label fw-bold">Base Price:</label>
                  <input type="number" class="form-control" id="base-price" v-model="service_price" >
                </div>

                <div class="mb-3">
                  <label for="category" class="form-label fw-bold">Category:</label>
                  <select class="form-select" id="category" v-model="service_category" >
                    <option v-for="cat in categories" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                
                <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
                
                <div class="text-center">
                  <button @click="updateService" class="btn btn-primary">Update</button>
                  <button @click="deleteservice" class="btn btn-warning">Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        service_id: null,
        service_name: '',
        service_description: '',
        service_price: '',
        service_category: '',
        // Provide categories as needed or fetch them from an API
        categories: ["Plumbing", "Electrical", "Cleaning","AC","TV repair","others"],
        error: ''
      };
    },
    mounted() {
      // Assume the service ID is passed as a route parameter
      this.service_id = this.$route.params.id;
      
      // Fetch the existing service details to pre-populate the form
      fetch(`/api/view_service/${this.service_id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
      .then(response => response.json())
      .then(data => {
        this.service_name = data.name;
        this.service_description = data.description;
        this.service_price = data.price;
        this.service_category = data.category;
      })
      .catch(error => {
        this.error = "Error fetching service details: " + error.message;
      });
    },
    methods: {
      updateService() {
        fetch(`/api/update_service/${this.service_id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify({
            service_name: this.service_name,
            service_description: this.service_description,
            service_price: this.service_price,
            service_category: this.service_category
          })
        })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          this.$router.push('/Dashboard');
        })
        .catch(err => {
          this.error = err.message;
        });
      },
      deleteservice(){
        fetch(`/api/delete_service/${this.service_id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
       .then(response => response.json())
       .then(data => {
          alert(data.message);
          this.$router.push('/Dashboard');
        })
      }
    }
  };
  