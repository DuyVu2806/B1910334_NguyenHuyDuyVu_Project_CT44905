import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


// createApp(App)
//   .use(router)
//   .use(store)
//   .mount('#app')

const app = createApp(App);
app.use(store);
app.use(router);

// Kiểm tra giá trị của isLoggedIn trong localStorage
const isLoggedIn = store.getters.isLoggedInLocal;
const isLoggedCusIn = store.getters.isLoggedCusInLocal;
if (isLoggedIn) {
  store.commit("SET_IS_LOGGED_IN", true);
}
if (isLoggedCusIn) {
  store.commit("SET_IS_LOGGED_IN_CUS", true);
}

app.mount("#app");
