export default {
    template: ` <div> hello</div>
    `,
    data() {
      return {
        service_id: null,
        service_name: '',
        service_description: '',
        service_price: '',
        service_category: '',
        error: ''
      };
    },
    mounted() {
      // Assuming the service id is passed as a route paramete
      this.service_id = this.$route.params.id;
  
      // Fetch the existing service details
      fetch(`/api/get_service/${this.service_id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(response => response.json())
        .then(data => {
          // Populate the form fields with the service data
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
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || "Failed to update service");
            });
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          // Optionally, redirect to the dashboard or another page
          this.$router.push('/Dashboard');
        })
        .catch(err => {
          this.error = err.message;
        });
      }
    }
  };
  