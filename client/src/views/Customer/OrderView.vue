<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card shadow">
                    <div class="card-header">
                        <h3>Order List
                        </h3>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered table-triped">
                            <thead>
                                <tr>
                                    <td>STT</td>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody v-for="(item, index) in orders" :key="item._id">
                                <tr>
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.user.username }}</td>
                                    <td>{{ item.status }}</td>
                                    <td>{{ formatDate(item.dateOrdered) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal"
                                            v-bind:data-bs-target="'#modal-' + item._id">View Details</button>
                                    </td>
                                    <!-- START MODAL -->
                                    <div class="modal fade" :id="'modal-' + item._id" data-bs-backdrop="static"
                                        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
                                        aria-hidden="true">
                                        <div class="modal-dialog modal-xl modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">View Details
                                                    </h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <table class="table table-bordered table-triped">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Image</th>
                                                                <th>Quantity</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody v-for="(item, itemIndex) in item.orderItems"
                                                            :key="itemIndex">
                                                            <tr>
                                                                <td>{{ item.product.name }}</td>
                                                                <td>
                                                                    <img :src="item.product.image" alt=""
                                                                        style="width:30px;height:30px;" />
                                                                </td>
                                                                <td>{{ item.quantity }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END MODAL -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode'
export default {
    data() {
        return {
            orders: [],
            loading: true,
            formatDate(date) {
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                if (date instanceof Date && !isNaN(date)) {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                } else {
                    return '';
                }
            },
        }

    },
    created() {
        const tokens = localStorage.getItem('tokenCustomer')
        const userId = jwt_decode(tokens).userId;
        if (userId) {
            this.$store.dispatch('fetchCartItemCount', userId);
            this.userId = userId;
        }
    },
    mounted() {
        axios.get(`http://127.0.0.1:5000/api/order/get/userorders/${this.userId}`).then(response => {
            this.orders = response.data;
            this.loading = false;
        }).catch(error => {
            console.log(error);
            this.loading = false;
        });
    }
}
</script>

<style scoped></style>