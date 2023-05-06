<template>
    <div class="container">
        <div class="card card-body shadow mt-3">
            <h2 class="mb-2">Checkout</h2>
            <form>
                <div class="mb-3">
                    <label for="phone">Phone:</label>
                    <input type="number" id="phone" class="form-control" v-model="phone" required>
                </div>
                <div class="mb-3">
                    <label for="address">Address:</label>
                    <textarea class="form-control" id="address" cols="30" rows="3" v-model="address" required></textarea>
                </div>
            </form>
            <table class="table table-bordered table-triped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartItems" :key="item._id">
                        <td>{{ item.productId.name }}</td>
                        <td>
                            <img :src="item.productId.image" alt="" style="width:30px;height:30px;">
                        </td>
                        <td>{{ item.quantity }}</td>
                        <td class="text-end">$ {{ item.productId.price }}</td>
                    </tr>
                    <tr>
                        <td colspan="4">Total: <span class="float-end">$ {{ totalPrice }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button v-if="cartItems.length > 0" type="submit" class="btn btn-outline-primary my-3 float-end shadow"
            @click.prevent="placeOrder">Place
            Order</button>
        <button v-if="cartItems.length == 0" class="btn btn-outline-primary my-3 float-end shadow" disabled>Place
            Order</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            address: '',
            phone: '',
        }
    },
    computed: {
        ...mapGetters(['cartItems']),
        totalPrice() {
            return this.cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        },
    },
    mounted() {
        const token = localStorage.getItem('tokenCustomer')
        if (token) {
            const decoded = jwt_decode(token)
            this.userId = decoded.userId
        }
        this.$store.dispatch('fetchCart', this.userId)
    },
    methods: {

        async placeOrder() {
            const form = document.querySelector('form');
            if (!form.checkValidity()) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Số điện thoại hoặc địa chỉ không được trống',
                    showConfirmButton: false,
                    timer: 1500
                })
                return;
            }
            const orderItems = this.cartItems.map(item => ({
                quantity: item.quantity,
                product: item.productId._id
            }));
            const data = {
                orderItems,
                shippingAddress1: this.address,
                phone: this.phone,
                status: 'Pending',
                user: this.userId,
                totalPrice: this.totalPrice,
            };
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/order', data);
                this.$store.dispatch('clearCart', this.userId)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đặt hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.$router.push('/');
                this.$store.dispatch('fetchMyOrderItemCount',this.userId);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped></style>