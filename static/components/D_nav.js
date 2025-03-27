export default {
  template: `
    <div>
      <!-- Dashboard Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Welcome</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#dashboardNavbar" aria-controls="dashboardNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="dashboardNavbar">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link :to="dashboard" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="search" class="nav-link">Search</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="summary" class="nav-link">Summary</router-link>
            </li>
            <div v-if="userData.role==='admin'">
            </div>
            <div v-else>
              <router-link :to="profile" class="nav-link">Profile</router-link>
            </div>
          </ul>
          <button class="btn btn-outline-danger my-2 my-sm-0" @click="logout">Logout</button>
        </div>
      </nav>
    </div>
  `,
  data() {
    return {
      userData: {},
      dashboard: '',
      search: '',
      summary: '',
      profile:''
    };
  },
  mounted() {
    this.userData = {
      username: localStorage.getItem('username'),
      id : localStorage.getItem('id'),
      role: localStorage.getItem('role')
    };

    const role = this.userData.role;
    const id = this.userData.id

    if (role === 'customer') {
      this.dashboard = '/C_dashboard';
      this.search = '/C_search';
      this.summary = '/C_summary';
      this.profile = '/C_profile/'+id;
    } else if (role === 'admin') {
      this.dashboard = '/Dashboard';
      this.search = '/Search';
      this.summary = '/Summary';
    } else {
      this.dashboard = '/P_dashboard';
      this.search = '/P_search';
      this.summary = '/P_summary';
      this.profile = '/A_professionalprofile/'+id;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.$router.push('/login');
    }
  }
};
