<template>
    <div class="container">
        <div v-if="isLoading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12">
                    <div class="card card-registration card-registration-2 shadow" style="border-radius: 15px;">
                        <div class="card-body p-0" style="margin: 0 0.9em; ">
                            <div class="row">
                                <div class="col-lg-8">
                                    <div class="p-5">
                                        <div class="d-flex justify-content-between align-items-center mb-5">
                                            <h1 class="fw-bold mb-0 text-black">Shopping Cart</h1>
                                            <h6 class="mb-0 text-muted">{{ cartItemCount }} items</h6>
                                        </div>
                                        <hr class="my-4">
                                        <div v-if="cartItemCount === 0"
                                            class="row d-flex justify-content-center align-items-center h-100">
                                            <h3 class="text-muted">No product</h3>
                                        </div>
                                        <div class="row mb-4 d-flex justify-content-between align-items-center"
                                            v-for="item in cartItems" :key="item._id">
                                            <div class="col-md-2 col-lg-2 col-xl-2">
                                                <img :src="item.productId.image" class="img-fluid rounded-3"
                                                    alt="Cotton T-shirt">
                                            </div>
                                            <div class="col-md-3 col-lg-3 col-xl-3 ">
                                                <h6 class="prodname">
                                                    <router-link :to="'/customer/product/' + item.productId._id"
                                                        class="text-info">{{ item.productId.name }}</router-link>
                                                </h6>
                                            </div>
                                            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                <button type="button" class="btn btn-link px-2"
                                                    @click="decrementItem(item)">
                                                    <i class="fa fa-minus"></i>
                                                </button>
                                                <input type="text"
                                                    class="input-quantity form-control form-control-sm text-center"
                                                    style="width: 50px;" v-model="item.quantity" disabled />
                                                <button type="button" class="btn btn-link px-2"
                                                    @click="incrementItem(item)">
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <div class="col-md-2 col-lg-2 col-xl-2 offset-lg-1">
                                                <h6 class="mb-0">${{ item.productId.price }}</h6>
                                            </div>
                                            <div class="col-md-2 col-lg-1 col-xl-1 text-end">
                                                <a href="#!" @click="removeCartItem(item)" class="text-danger"><i
                                                        class="fa fa-times"></i></a>
                                            </div>
                                        </div>
                                        <hr class="my-4">
                                        <div class="pt-5">
                                            <h6 class="mb-0">
                                                <router-link to="/" class="text-info">Back to shop</router-link>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 bg-grey"
                                    style="border-top-right-radius: 16px;border-bottom-right-radius: 16px;">
                                    <div class="p-5">
                                        <h3 class="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                                        <hr class="my-4">
                                        <div class="d-flex justify-content-between mb-5">
                                            <h5 class="text-uppercase">Total price</h5>
                                            <h5>${{ totalPrice }}</h5>
                                        </div>
                                        <router-link v-if="cartItems.length > 0" to="/customer/checkout"
                                            class="btn btn-lg btn-warning btn-block w-100 text-light">Checkout</router-link>
                                        <button type="button" v-if="cartItems.length == 0"
                                            class="btn btn-lg btn-warning btn-block w-100 text-light"
                                            disabled>Checkout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import jwt_decode from 'jwt-decode'
export default {
    created() {
        const tokens = localStorage.getItem('tokenCustomer')
        const userId = jwt_decode(tokens).userId;
        if (userId) {
            this.$store.dispatch('fetchCartItemCount', userId);
            this.userId = userId;
        }
        this.getCartItemCount();
    },
    computed: {
        ...mapGetters(['cartItems']),
        isLoading() {
            return this.$store.state.cart.loading;
        },
        totalPrice() {
            return this.cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        },
        cartItemCount() {
            return this.$store.state.cartItemCount;
        },
        ...mapGetters(['cartItemCount'])
    },
    mounted() {
        const token = localStorage.getItem('tokenCustomer')
        if (token) {
            const decoded = jwt_decode(token)
            this.userId = decoded.userId
        }
        this.$store.dispatch('fetchCart', this.userId).then(() => {
            this.$store.commit('setLoading', false);
        });

    },
    methods: {
        ...mapActions(['fetchCartItemCount', 'removeFromCart']),
        async getCartItemCount() {
            await this.fetchCartItemCount(this.userId);
        },
        incrementItem(item) {
            this.$store.dispatch('updateCartItemQuantity', { itemId: item._id, quantity: item.quantity + 1 });
        },
        decrementItem(item) {
            if (item.quantity > 1) {
                this.$store.dispatch('updateCartItemQuantity', { itemId: item._id, quantity: item.quantity - 1 });
            }
        },
        async removeCartItem(item) {
            this.$store.dispatch('removeFromCart', { productId: item._id, userId: this.userId });
        }
    }
}
</script>

<style scoped></style>