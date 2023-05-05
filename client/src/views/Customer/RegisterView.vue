<template>
    <div class="container">
        <section class="vh-100">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col col-xl-10">
                        <div class="card" style="border-radius: 1rem;">
                            <div class="row g-0">
                                <div class="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src="https://www.allen.ac.in/apps2324/assets/images/login.jpg" alt="login form"
                                        class="img-fluid d-flex item-align"
                                        style="height: 670px;;border-radius: 1rem 0 0 1rem;" />
                                </div>
                                <div class="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div class="card-body p-4 p-lg-5 text-black">
                                        <form @submit.prevent="register">
                                            <div class="d-flex align-items-center mb-3 pb-1">
                                                <i class="fa fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                                                <span class="h1 fw-bold mb-0">Welcome to Again !</span>
                                            </div>
                                            <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">
                                                Register your account
                                            </h5>

                                            <div class="form-outline mb-4">
                                                <input type="text" id="username" v-model="username" required
                                                    class="form-control form-control-lg " />
                                                <label class="form-label" for="form2Example17">Name</label>
                                            </div>
                                            <div class="form-outline mb-4">
                                                <input type="email" id="email" v-model="email" required
                                                    class="form-control form-control-lg " />
                                                <label class="form-label" for="form2Example17">Email address</label>
                                            </div>

                                            <div class="form-outline mb-4">
                                                <input type="password" id="password" v-model="password" required
                                                    class="form-control form-control-lg " />
                                                <label class="form-label" for="form2Example27">Password</label>
                                            </div>

                                            <div class="form-outline mb-4">
                                                <input type="password" id="confirm_password" v-model="confirm_password"
                                                    required class="form-control form-control-lg " />
                                                <label class="form-label" for="form2Example17">Confirm
                                                    Password</label>
                                            </div>

                                            <div class="pt-1 mb-4">
                                                <button class="btn btn-dark btn-lg btn-block"
                                                    type="submit">Register</button>
                                            </div>
                                            <p class="mb-3 pb-lg-2" style="color: #393f81;">Do have an account?
                                                <router-link to="/customer/login" style="color: #393f81;">Login
                                                    here</router-link>
                                            </p>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    },

    methods: {
        setCurrentCus(user) {
            this.$store.commit('SET_CURRENT_CUS', user)
            localStorage.setItem('currentCus', JSON.stringify(user));
        },
        async register() {
            if (this.password !== this.confirm_password) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Passwords do not match',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
            try {
                const checkEmail = await fetch(`http://127.0.0.1:5000/api/customer/check/check-email?email=${this.email}`);
                const data = await checkEmail.json();
                if (data.message) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Email Already Used',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                } else {
                    const response = await fetch('http://127.0.0.1:5000/api/customer/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: this.username,
                            email: this.email,
                            password: this.password,
                        }),
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        // Lưu token vào localStorage
                        localStorage.setItem('tokenCustomer', responseData.token);
                        const token = localStorage.getItem('tokenCustomer')
                        if (token) {
                            const decoded = jwt_decode(token)
                            this.currentCus = decoded.username
                            this.setCurrentCus(decoded.username)
                            // Lấy username từ token giải mã được
                        }
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Register Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        // Chuyển hướng đến trang chính
                        this.$store.commit('SET_IS_LOGGED_IN_CUS', true);

                        this.$router.push('/');
                    } else {
                        throw new Error(responseData.message);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        },
    },
}
</script>

<style scoped></style>