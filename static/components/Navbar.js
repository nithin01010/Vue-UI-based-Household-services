export default {
    template: `
    <div class="row border-bottom py-3 align-items-center">
        <!-- Branding or Logo Section -->
        <div class="col-8 d-flex align-items-center">
            <h2 class="mb-0">Hiuse hild</h2>
        </div>

        <!-- Navigation Links -->
        <div class="col-3 text-end">
            <router-link class="btn btn-outline-success me-2" to="/login">Login</router-link>
            <router-link class="btn btn-outline-warning me-2" to="/C_register">Create Account</router-link>
            <router-link class="btn btn-outline-warning me-2" to="/P_register">Register as Professional</router-link>
        </div>
    </div>
    `
};
