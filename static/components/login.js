export default{
    template : `
    
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-sm" style="width: 22rem;">
      <div class="card-body">
        <h2 class="card-title text-center text-primary">A to Z Household Services</h2>
        
          <div class="mb-3">
            <label for="email" class="form-label">Registered Email ID:</label>
            <input type="email" class="form-control" v-model="email" id="email" placeholder="Enter your email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" class="form-control" v-model="password" id="password" placeholder="Enter your password" required>
          </div>
          <button @click="loginUser" class="btn btn-primary w-100">Login</button>

          {% if error %}
          <div class="alert alert-danger text-center mt-3">
            {{ error }}
          </div>
          {% endif %}
        <div class="d-flex justify-content-between mt-3">
            <router-link class="btn btn-primary " to="/P_register">Registeras Professional</router-link>
          
            <router-link class="btn btn-warning " to="/C_register">Create Account</router-link>
        </div>
      </div>
    </div>
  </div>
    `
  ,
    data: function() {
      return {
        formData:{
          email: '',
          password: ''
        }
      }
    },
    methods : {
      loginUser: function() {
        axios.post('api/login', this.formData)
         .then(response => {
            if(response.data.success){
              this.$router.push('/');
            } else {
              this.error = response.data.message;
            }
          })
         .catch(error => {
            this.error = error.message;
          });
      }
    }
}