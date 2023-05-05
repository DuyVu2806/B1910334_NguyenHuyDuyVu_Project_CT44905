<template>
    <div class="container">
        <div class="mt-5 card shadow form-register">
            <h2 class="card-title text-center text-light pt-2 pb-2 bg-primary">Register</h2>
            <div class="card-body">
                <form @submit.prevent="register">
                    <div class="mb-2">
                        <label for="username">UserName:</label>
                        <input class="form-control" type="text" id="username" v-model="username" required>
                    </div>
                    <div class="mb-2">
                        <label for="email">Email:</label>
                        <input class="form-control" type="email" id="email" v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password">Password:</label>
                        <input class="form-control" type="password" id="password" v-model="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirm_password">Confirm Password:</label>
                        <input class="form-control" type="password" id="confirm_password" v-model="confirm_password"
                            required>
                    </div>
                    <button class="btn btn-outline-primary" type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>
  
<script>
import Swal from 'sweetalert2'
// import axios from "axios";
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
                const checkEmail = await fetch(`http://127.0.0.1:5000/api/user/check/check-email?email=${this.email}`);
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
                    const response = await fetch('http://127.0.0.1:5000/api/user/register', {
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
                    await response.json();
                    this.username = '';
                    this.email = '';
                    this.password = '';
                    this.confirmPassword = '';
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Register Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

            } catch (err) {
                console.error(err);

            }
        },
    },
};
</script>  

<style>
.form-register {
    width: 600px;
    margin: auto;
}
</style>