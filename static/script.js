import Home from './components/Home.js';
import Login from './components/login.js';
import C_register from './components/C_register.js';
import P_register from './components/P_register.js';
import Dashboard from './components/Dashboard.js';
import Footer from './components/Footer.js';
import new_service from './components/new_service.js';
import LoginNavbar from './components/Navbar.js';
import DashboardNavbar from './components/D_nav.js';
import update_service from './components/update_service.js';
import A_P_profile from './components/A_P_profile.js';
import C_Dashboard from './components/C_dashboard.js';
Vue.use(VueRouter);

// Define your routes (you can add meta properties if needed)
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/C_register', component: C_register },
  { path: '/P_register', component: P_register },
  { path: '/Dashboard', component: Dashboard },
  {path: '/new_service', component: new_service},
  {path : '/update_service/:id', component: update_service},
  {path: '/A_professionalprofile/:id' , component: A_P_profile},
  {path : '/C_dashboard', component: C_Dashboard},
];

const router = new VueRouter({
  routes: routes
});

new Vue({
  el: '#app',
  router,
  components: {
    'login-navbar': LoginNavbar,
    'dashboard-navbar': DashboardNavbar,
    'footer-bar': Footer
  },
  computed: {
    // Check the current route and return the appropriate navbar component name
    navbarComponent() {
      // For example, if you're on the login, register, or home page, show LoginNavbar,
      // if on Dashboard (or its sub-routes), show DashboardNavbar.
      const path = this.$route.path;
      if (path === '/login' || path === '/C_register' || path === '/P_register' || path === '/') {
        return 'login-navbar';
      } else  {
        return 'dashboard-navbar';
      }
    }
  },
  template: `
    <div class="container">
      <component :is="navbarComponent"></component>
      <router-view></router-view>
      <footer-bar></footer-bar>
    </div>
  `
});
