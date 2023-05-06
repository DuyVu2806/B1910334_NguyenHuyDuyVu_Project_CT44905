<template >
  <template v-if="$route.meta.navbar === 'navbar1'">
    <Sidebar />
    <div :style="{ 'margin-left': sidebarWidth }">
      <router-view />
    </div>
  </template>
  <template v-if="$route.meta.navbar === 'navbar2'">
    <Navbar />
    <main>
      <router-view />
    </main>
    
    <Footer />
  </template>
</template>


<script>
import Sidebar from './components/Admin/Sidebar/Sidebar.vue';
import { sidebarWidth } from '@/components/Admin/Sidebar/state';
import Navbar from "@/components/Customer/Navbar.vue";
import Footer from "@/components/Customer/FooterView.vue"
export default {
  components: { Sidebar, Navbar, Footer },
  setup() {
    return { sidebarWidth }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
