<template>
    <section class="vh-100 card card-body shadow m-5">
        <div class="container py-5 h-100">
            <div class="row d-flex align-items-center justify-content-center h-100">
                <div class="col-md-8 col-lg-7 col-xl-6">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                        class="img-fluid" alt="Phone image">
                </div>
                <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                    <form @submit.prevent="login">
                        <h3 class="mb-4 text-center">SIGN IN ADMIN</h3>
                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <input type="email" id="email" v-model="email" required class="form-control form-control-lg" />
                            <label class="form-label" for="form1Example13">Email address</label>
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-4">
                            <input type="password" id="password" v-model="password" required class="form-control form-control-lg" />
                            <label class="form-label" for="form1Example23">Password</label>
                        </div>

                        <!-- Submit button -->
                        <button type="submit" class="btn btn-primary btn-lg btn-block">Sign in</button>

                        
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
export default {
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        setCurrentUser(user) {
            this.$store.commit('SET_CURRENT_USER', user)
            localStorage.setItem('currentUser', JSON.stringify(user));
        },
        async login() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                });

                const responseData = await response.json();

                if (response.ok) {
                    // Lưu token vào localStorage
                    localStorage.setItem('token', responseData.token);
                    const token = localStorage.getItem('token')
                    if (token) {
                        const decoded = jwt_decode(token)
                        this.currentUser = decoded.username
                        this.setCurrentUser(decoded.username)
                        // Lấy username từ token giải mã được
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đăng nhập thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // Chuyển hướng đến trang chính
                    this.$store.commit('SET_IS_LOGGED_IN', true);

                    this.$router.push('/dashboard');
                } else {
                    throw new Error(responseData.message);
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Đăng nhập không thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }
}
</script>

<style>
.form-login {
    width: 600px;
    margin: auto;
}
</style>
  