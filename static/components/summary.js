export default {
    template: `
      <main class="container mt-4">
        <h2 class="text-center">Summary</h2>
        <div v-if="loading" class="text-center">
          <p>Loading summary data...</p>
        </div>
        <div v-else class="row justify-content-center">
          <div class="col-md-5 text-center" v-if="serviceImg">
            <h5>Service Requests</h5>
            <img :src="serviceImg" width="300" height="300" alt="Service Requests">
          </div>
          <div class="col-md-5 text-center" v-if="ratingImg">
            <h5>Customer Ratings</h5>
            <img :src="ratingImg" width="300" height="300" alt="Ratings">
          </div>
        </div>
      </main>
    `,
    data() {
      return {
        loading: true,
        serviceImg: null,
        ratingImg: null
      };
    },
    mounted() {
      this.fetchSummary();
    },
    methods: {
      fetchSummary() {
        const role = localStorage.getItem("role");
        let apiUrl = "";
  
        if (role === "admin") {
          apiUrl = "/api/A_summary";
        } else if (role === "customer") {
          const customerId = localStorage.getItem("user_id");
          apiUrl = `/api/C_summary`;
        } else if (role === "professional") {
          apiUrl = "/api/P_summary";
        }
  
        fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token"),
          },
        })
        .then(response => response.json())
        .then(data => {
          this.serviceImg = data.service_img;
          this.ratingImg = data.rating_img || null;
          this.loading = false;
        })
        .catch(error => {
          console.error("Error fetching summary:", error);
          this.loading = false;
        });
      }
    }
  };
  