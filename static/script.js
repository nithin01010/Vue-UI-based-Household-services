import Home from './components/Home.js';
import Login from './components/login.js';
import C_register from './components/C_register.js';
import P_register from './components/P_register.js';
import Footer from './components/Footer.js';
import Navbar from './components/Navbar.js';
import Dashboard from './components/Dashboard.js';

// Define Routes
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/C_register', component: C_register },
    { path: '/P_register', component: P_register },
    { path: '/dashboard', component: Dashboard }
];

// Create Router Instance
const router = new VueRouter({
    routes: routes
});

// Create Vue Instance
const app = new Vue({
    el: '#app',
    router,
    template: `
        <div class="container">
            <nav-bar></nav-bar>
            <router-view></router-view>
            <footer-bar></footer-bar>
        </div>
    `,
    components: {
        'nav-bar': Navbar,
        'footer-bar': Footer
    }
});
