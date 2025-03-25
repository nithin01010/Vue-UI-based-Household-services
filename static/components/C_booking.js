export default {
    template: `
      <div class="container mt-5">
        <h2 class="text-center text-primary mb-4">Best {{ cato }} Packages</h2>

        <div v-if="services.length" class="table-responsive">
            <form @submit.prevent="book">
                <table class="table table-striped table-bordered table-hover rounded-3 overflow-hidden">
                    <thead class="bg-info text-white">
                        <tr>
                            <th>Service Name</th>
                            <th>Price ($)</th>
                            <th>Description</th>
                            <th>Rating</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id">
                            <td>{{ service.name }}</td>
                            <td>{{ service.price }}</td>
                            <td>{{ service.description || 'No description available' }}</td>
                            <td>{{ service.rating || 'No rating' }}</td>
                            <td>
                                <button 
                                    type="submit" 
                                    @click="selectedService = service.id" 
                                    class="btn btn-primary btn-sm rounded-pill">
                                    Book
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>

        <p v-else class="text-warning text-center">Sorry! Services are not available for {{ cato }} at this time.</p>
    </div>
    `,
    data() {
      return {
        services: [],
        searchQuery: '',
        cato: ''
      };
    },
    mounted() {
      this.cato = this.$route.params.cat;
      this.fetchServices();
    },
    methods: {
      fetchServices() {
        fetch('/api/customer_search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            query: this.cato,
            category: 'category'
          })
        })
          .then(response => response.json())
          .then(data => {
            this.services = data;
          })
      },
  
      book(id) {
        fetch('/api/create_request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem('auth_token')
          },
          body: JSON.stringify({
            service_id: id
          })
        })
          .then(response => response.json())
          .then(data => {
            alert('Booking successful!')
            this.$router.push('C_dashboard')
          })
      }
    }
  };
  