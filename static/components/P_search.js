export default {
    template: `
    <div class="container mt-5">
            <h2>Search Functionality</h2>
            <form @submit.prevent="searchRequests" class="form-inline mb-4">
                <label for="search-by" class="mr-2">Search by:</label>
                <select id="search-by" v-model="category" class="form-control mr-2">
                    <option value="location">Location</option>
                    <option value="pincode">Pin Code</option>
                </select>
                <input type="text" v-model="query" placeholder="Enter search text" required class="form-control mr-2">
                <button type="submit" class="btn btn-primary">Search</button>
            </form>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="start">
            <div v-if="results.length ">
                <h3>Search Results</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Contact Phone</th>
                            <th>Location (with Pin Code)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in results" :key="item.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.customer.fullname }}</td>
                            <td>{{ item.customer.number }}</td>
                            <td>{{ item.customer.address }}</td>
                            <td>
                                <button @click="acceptRequest(item.id)" class="btn btn-success btn-sm">Accept</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="text-danger">Sorry! Services are not requested this time.</p>
            </div>
            
    </div>
    `,

    data() {
        return {
            category: 'location',
            query: '',
            results: [],
            error: '',
            start: false
        };
    },
    methods: {
        searchRequests() {
            fetch('/api/professional_search', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ category: this.category, query: this.query })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    this.error = data.message;
                    this.results = [];
                } else {
                    this.error = '';
                    this.start = true;
                    this.results = data;
                }
            })
            .catch(err => this.error = "Error fetching data");
        },

        acceptRequest(id) {
            fetch('/api/Accept_request', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.$router.push('P_dashboard') 
            });
        },
    }
};