<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <h1>
            <span v-if="collapsed">
                <i class="fa-solid fa-earth-americas"></i>
            </span>
            <span v-else>DV Store</span>
        </h1>
        <SidebarLink to="/dashboard" icon="fas fa-chart-bar" class="mb-2">Doashboard</SidebarLink>
        <SidebarLink to="/product" icon="fa-brands fa-product-hunt" class="mb-2">Product</SidebarLink>
        <SidebarLink to="/category" icon="fas fa-columns" class="mb-2">Category</SidebarLink>
        <SidebarLink to="/order" icon="fa fa-list" class="mb-2">Order</SidebarLink>
        <SidebarLink to="/customer" icon="fa fa-user-nurse" class="mb-2">Customer</SidebarLink>
        <SidebarLink to="/register" icon="fas fa-users" class="mb-2 d-flex align-items-end">Register Admin</SidebarLink>
        <SidebarLink v-if="!isLoggedIn" to="/login" icon="fa-solid fa-user-lock" class="mb-2 login-link">Login</SidebarLink>
        <SidebarLink v-if="isLoggedIn" to="#" icon="fa-solid fa-user" class="mb-2 login-link">
            {{ currentUser }}
            <a href="#" @click="logout">
                <i class="ms-2 fa-solid fa-arrow-right-from-bracket"></i>
            </a>
        </SidebarLink>

        <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left" />
        </span>
    </div>
</template>

<script>
import SidebarLink from './SidebarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'
import { mapState } from 'vuex'
export default {
    name: 'SidebarView',
    props: {},
    components: { SidebarLink },
    setup() {
        return { collapsed, toggleSidebar, sidebarWidth }
    },
    created() {
        const token = localStorage.getItem('token')
        if (token) {
            this.$store.commit('SET_IS_LOGGED_IN', true) // set state isLoggedIn trong store là true
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn // Sử dụng state isLoggedIn
        },
        ...mapState(['currentUser'])
    },
    methods: {
        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('currentUser') // Xóa token khỏi localStorage
            this.$store.commit('SET_IS_LOGGED_IN', false)// Cập nhật state isLoggedIn
            this.$router.push('/login') 
        }
    }

}

</script>

<style>
:root {
    --sidebar-bg-color: #2f855a;
    --sidebar-item-hover: #38a169;
    --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
    color: white;
    background-color: var(--sidebar-bg-color);
    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;
    transition: 0.3s ease;
    display: flex;
    flex-direction: column;
}

.sidebar h1 {
    height: 2.5em;
}

.collapse-icon {
    position: absolute;
    top: 8%;
    right: 0;
    padding: 0.75em;
    color: rgba(255, 255, 255, 0.7);
    transition: 0.2s linear;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
}

.login-link {
    margin-top: auto;
}
</style>