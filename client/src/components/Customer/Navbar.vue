<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link class="navbar-brand" to="/">DV store</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav mt-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/customer/cart" class="nav-link " aria-current="page">Cart
                            ({{ cartItemCount }})</router-link>
                    </li>
                    <li v-if="!isLoggedCusIn" class="nav-item">
                        <router-link to="/customer/login" class="nav-link " aria-current="page">Sign In</router-link>
                    </li>
                    <li v-if="!isLoggedCusIn" class="nav-item">
                        <router-link to="/customer/register" class="nav-link " aria-current="page">Register</router-link>
                    </li>
                    <li v-if="isLoggedCusIn" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            {{ currentCus }}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/customer/profile">Profile</router-link></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><router-link class="dropdown-item" to="/customer/order">My Order ({{ myorderItemCount }})</router-link></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a href="#" @click="logout" class="dropdown-item ">Sign Out <i
                                        class="fa-solid fa-arrow-right-from-bracket"></i></a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import jwt_decode from 'jwt-decode'
export default {
    name: 'NavbarView',
    created() {
        const token = localStorage.getItem('tokenCustomer')
        if (token) {
            this.$store.commit('SET_IS_LOGGED_IN_CUS', true) // set state isLoggedIn trong store là true
            const userId = jwt_decode(token).userId;
            if (userId) {
                this.$store.dispatch('fetchCartItemCount', userId);
                this.$store.dispatch('fetchMyOrderItemCount',userId);
                this.userId = userId;
            }
        }
        this.getCartItemCount();
        this.getOrderItemCount();
    },
    computed: {
        isLoggedCusIn() {
            return this.$store.state.isLoggedCusIn // Sử dụng state isLoggedIn
        },
        ...mapState(['currentCus']),
        cartItemCount() {
            return this.$store.state.cartItemCount;
        },
        myorderItemCount(){
            return this.$store.state.myorderItemCount;
        },
        ...mapGetters(['cartItemCount','myorderItemCount'])
    },
    methods: {
        ...mapActions(['fetchCartItemCount','fetchMyOrderItemCount']),

        async getCartItemCount() {
            await this.fetchCartItemCount(this.userId);
        },
        async getOrderItemCount() {
            await this.fetchMyOrderItemCount(this.userId);
        },
        logout() {
            try {
                localStorage.removeItem('tokenCustomer')
                localStorage.removeItem('currentCus') // Xóa token khỏi localStorage
                this.$store.commit('SET_IS_LOGGED_IN_CUS', false) // Cập nhật state isLoggedIn
                this.$store.commit("resetCartItemCount");
                this.$store.commit("resetOrderItemCount");
            } catch (error) {
                console.error(error);
            }

        }
    },


}
</script>

<style scoped></style>