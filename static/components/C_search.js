export default {
    template: `
    <div class="container mt-5">
        <section class="search">
            <h2>Search Functionality</h2>
            <form @submit.prevent="search" class="form-inline mb-4">
                <label for="search-by" class="mr-2">Search by:</label>
                <select v-model="category" class="form-control mr-2">
                    <option value="service">Service</option>
                    <option value="category">Category</option>
                </select>
                <input type="text" v-model="query" placeholder="Enter search text" required class="form-control mr-2">
                <button type="submit" class="btn btn-primary">Search</button>
            </form>
            <div v-if="services.length" class="table-responsive">
            <form >
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
                                    @click="book(service.id)" 
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
        </section>
    </div>
    `,
    data() {
        return {
            query: '',
            category: 'service',
            services: [],
            start:0
        };
    },
    methods: {
        search() {
            fetch('/api/customer_search', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ query: this.query, category: this.category })
            })
            .then(response => response.json())
            .then(data => {
                this.services = data;
                this.start=1
            })
            .catch(error => {
                console.error("Error:", error);
            });
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
            this.$router.push('/C_dashboard')
          })
      }
    }
};
