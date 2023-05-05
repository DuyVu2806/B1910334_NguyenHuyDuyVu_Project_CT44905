<template>
    <div class="container">
        <div v-if="loading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <section style="background-color: #eee;">
                <div class="container mt-4 py-5">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="card mb-4">
                                <div class="card-body text-center">
                                    <img src="https://cdn.lazi.vn/storage/uploads/users/avatar/1587962225_1585288013_anonymous_512.png"
                                        alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
                                    <h5 class="my-3">{{ customer.username }}</h5>
                                    <p class="text-muted mb-1">Profession</p>
                                    <p class="text-muted mb-4">{{ customer.address ? customer.address : 'No address' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Full Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{{ customer.username }}</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Email</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{{ customer.email }}</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Phone</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{{ customer.phone ? customer.phone : 'No phone' }}</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{{ customer.address ? customer.address : 'No address' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop">
                                Update Profile
                            </button>

                            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                                tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered modal-lg">
                                    <div class="modal-content">
                                        <form @submit.prevent="updateProfile">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="staticBackdropLabel">Update Profile</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-2">
                                                    <label for="">username</label>
                                                    <input type="text" name="username" class="form-control"
                                                        v-model="customer.username">
                                                </div>
                                                <div class="mb-2">
                                                    <label for="">email</label>
                                                    <input type="text" name="email" class="form-control"
                                                        v-model="customer.email" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label for="">Phone</label>
                                                    <input type="text" name="phone" class="form-control"
                                                        v-model="customer.phone">
                                                </div>
                                                <div class="mb-2">
                                                    <label for="">Address</label>
                                                    <input type="text" name="address" class="form-control"
                                                        v-model="customer.address">
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-sm btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-sm btn-primary">Update profile</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode'
export default {
    data() {
        return {
            customer: [],
            loading: true,
        }

    },
    methods: {
        async updateProfile() {
            try {
                const response = await axios.put(`http://127.0.0.1:5000/api/customer/${this.userId}`, this.customer, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokenCustomer')}`
                    }
                })
                this.customer = response.data
                alert('Profile updated successfully.')
            } catch (error) {
                alert('Failed to update profile.')
            }
        }
    },
    mounted() {
        const token = localStorage.getItem('tokenCustomer')
        if (token) {
            const decoded = jwt_decode(token)
            this.userId = decoded.userId
        } else {
            this.$router.push('/customer/login');
        }
        axios.get(`http://127.0.0.1:5000/api/customer/${this.userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('tokenCustomer')}`,
            },
        }).then(response => {
            this.customer = response.data;
            this.loading = false;
        }).catch(error => {
            console.log(error);
            this.loading = false;
        })
    }
}
</script>

<style scoped></style>