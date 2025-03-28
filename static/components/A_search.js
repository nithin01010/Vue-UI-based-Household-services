export default {
    template: `
        <section class="container mt-4">
            <h2 class="text-center">Search Functionality</h2>

            <!-- Search Box -->
            <div class="search-box mb-4">
                <form @submit.prevent="searchServices" class="form-inline">
                    <label for="search" class="mr-2">Search by:</label>
                    <select v-model="searchCategory" id="search" class="form-control mr-2">
                        <option value="service">Service Request</option>
                        <option value="customers">Customers</option>
                        <option value="professionals">Professionals</option>
                    </select>
                    <input v-model="searchQuery" type="text" placeholder="Search text" class="form-control mr-2">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

            <!-- Search Results -->
            <div v-if="results.length">
                <h2 class="text-center">{{ searchCategory }}</h2>
                <table class="table table-bordered">
                    
                    <!-- Service Requests Table -->
                    <thead v-if="searchCategory === 'service'">
                        <tr>
                            <th>ID</th>
                            <th>Service Name</th>
                            <th>Customer Name</th>
                            <th>Assigned Professional</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody v-if="searchCategory === 'service'">
                        <tr v-for="(item,index) in results" :key="item.id">
                            <td><router-link  :to="'/request_view/'+item.id">{{ index + 1 }}</router-link></td>
                            <td>{{ item.service_name }}</td>
                            <td>{{ item.customer_fullname }}</td>
                            <td>{{ item.professional_fullname || "Not Assigned" }}</td>
                            <td>{{ item.service_price }}</td>
                            <td>{{ item.status === "close it" ? "Accepted" : item.status }}</td>
                        </tr>
                    </tbody>

                    <!-- Customers Table -->
                    <thead v-if="searchCategory === 'customers'">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Pincode</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody v-if="searchCategory === 'customers'">
                        <tr v-for="item in results" :key="item.id">
                            <td><router-link :to="'/C_profile/' + item.login_id">{{ item.id }}</router-link></td>
                            <td>{{ item.fullname }}</td>
                            <td>{{ item.address }}</td>
                            <td>{{ item.pincode }}</td>
                            <td>{{ item.number }}</td>
                            <td>{{ item.status }}</td>
                        </tr>
                    </tbody>

                    <!-- Professionals Table -->
                    <thead v-if="searchCategory === 'professionals'">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Service Name</th>
                            <th>Experience</th>
                            <th>Address</th>
                            <th>Pincode</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody v-if="searchCategory === 'professionals'">
                        <tr v-for="(item,index) in results" :key="item.id">
                            <td><router-link :to="'/A_professionalprofile/'+item.id " >{{index+1}}</router-link></td>
                            <td>{{ item.fullname }}</td>
                            <td>{{ item.service_name || "N/A" }}</td>
                            <td>{{ item.experience }}</td>
                            <td>{{ item.address }}</td>
                            <td>{{ item.pincode }}</td>
                            <td>{{ item.number }}</td>
                            <td>{{ item.status }}</td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <!-- No Results -->
            <div v-else-if="searchPerformed" class="alert alert-info text-center">
                Sorry! No results found for this category.
            </div>

        </section>
    `,
    data() {
        return {
            searchCategory: "service",
            searchQuery: "",
            results: [],
            searchPerformed: false,
            errorMessage: "",
        };
    },
    methods: {
        searchServices() {
            fetch('/api/Admin_search', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({
                    category: this.searchCategory,
                    query: this.searchQuery
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    this.errorMessage = data.message;
                    this.results = [];
                } else {
                    this.results = data;
                    this.errorMessage = "";
                }
                this.searchPerformed = true;
            })
            .catch(error => {
                console.error("Error:", error);
                this.errorMessage = "An error occurred while fetching data.";
            });
        }
    }
}
