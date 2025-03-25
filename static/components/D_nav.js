// Define Dashboard component as a new constant
export default {
    template: `
      <div>
        <!-- Dashboard Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">Welcome, {{ userData.username || 'User' }}</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#dashboardNavbar" aria-controls="dashboardNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
    
          <div class="collapse navbar-collapse" id="dashboardNavbar">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <router-link to="/Dashboard" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/search" class="nav-link">Search</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/summary" class="nav-link">Summary</router-link>
              </li>
            </ul>
            <button class="btn btn-outline-danger my-2 my-sm-0" @click="logout">Logout</button>
          </div>
        </nav>
    </div>
    
    `,
    data() {
      return {
        userData: {}
      };
    },
    mounted() {
      this.userData = { username: localStorage.getItem('username')  };
    },
    methods: {
      logout() {
        // Remove authentication details and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        this.$router.push('/login');
      }
    }
  };
  