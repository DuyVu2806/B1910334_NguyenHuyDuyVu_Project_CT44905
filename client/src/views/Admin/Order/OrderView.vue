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
                                    <th>Id order</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody v-for="(item, index) in orders" :key="item._id">
                                <tr>
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item._id }}</td>
                                    <td>{{ item.user ? item.user.username : '' }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-light" data-bs-toggle="modal"
                                            v-bind:data-bs-target="'#status-' + item._id">{{ item.status }}</button>
                                    </td>
                                    <td>{{ formatDate(item.dateOrdered) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal"
                                            v-bind:data-bs-target="'#modal-' + item._id">View Details</button>
                                    </td>
                                    <!-- START MODAL VIEW-->
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
                                    <!-- START MODAL STATUS-->
                                    <div class="modal fade" :id="'status-' + item._id" data-bs-backdrop="static"
                                        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
                                        aria-hidden="true">
                                        <div class="modal-dialog ">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">View Status
                                                    </h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body" style="min-height: 120px;">
                                                    <select class="form-select" v-model="selectedStatus"
                                                        aria-label="Default select example">
                                                        <option value="Pending">Pending</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                                        >Close</button>
                                                    <button type="submit"
                                                        @click="updateOrderStatus(item._id, this.selectedStatus)"
                                                        class="btn btn-primary">Save changes</button>
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
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            orders: [],
            loading: true,
            selectedStatus: '',
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
    methods: {
        async updateOrderStatus(orderId, status) {
            try {
                const response = await axios.put(`http://127.0.0.1:5000/api/order/${orderId}`, {
                    status: status,
                });
                const updatedOrder = response.data;
                const index = this.orders.findIndex(order => order._id === updatedOrder._id);
                if (index !== -1) {
                    this.orders[index].status = updatedOrder.status;
                }
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Status Updated Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
                
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        axios.get('http://127.0.0.1:5000/api/order', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => {
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