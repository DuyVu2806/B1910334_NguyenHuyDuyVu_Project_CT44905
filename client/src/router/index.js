import { createRouter, createWebHistory } from "vue-router";
import ProductView from "../views/Admin/Product/ProductView.vue";
import store from "../store";

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/Admin/DashboardView.vue"),
    meta: {
      title: "Product Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/product",
    name: "product",
    component: ProductView,
    meta: {
      title: "Product Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/product/add",
    name: "addproduct",
    component: () => import("../views/Admin/Product/AddProductView.vue"),
    meta: {
      title: "Add Product Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/product/edit/:id",
    name: "editproduct",
    component: () => import("../views/Admin/Product/EditProductView.vue"),
    meta: {
      title: "Edit Product Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/category",
    name: "category",
    component: () => import("../views/Admin/Category/CategoryView.vue"),
    meta: {
      title: "Category Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/category/add",
    name: "Addcategory",
    component: () => import("../views/Admin/Category/AddCategoryView.vue"),
    meta: {
      title: "Add Category Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/category/edit/:id",
    name: "Editcategory",
    component: () => import("../views/Admin/Category/EditCategoryView.vue"),
    meta: {
      title: "Edit Category Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/order",
    name: "order",
    component: () => import("../views/Admin/Order/OrderView.vue"),
    meta: {
      title: "Order Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/customer",
    name: "customer",
    component: () => import("../views/Admin/Customer/CustomerView.vue"),
    meta: {
      title: "Customer Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Admin/LoginView.vue"),
    meta: {
      title: "Login Page",
      navbar: "navbar1",
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Admin/RegisterView.vue"),
    meta: {
      title: "Register Page",
      requiresAuth: true,
      navbar: "navbar1",
    },
  },
  {
    path: "/customer/login",
    name: "customerlogin",
    component: () => import("../views/Customer/LoginView.vue"),
    meta: {
      title: "Login Page",
      navbar: "navbar2",
    },
  },
  {
    path: "/",
    name: "customerhome",
    component: () => import("../views/Customer/HomePageView.vue"),
    meta: {
      title: "Home Page",
      navbar: "navbar2",
    },
  },
  {
    path: "/customer/register",
    name: "customerregister",
    component: () => import("../views/Customer/RegisterView.vue"),
    meta: {
      title: "Register Page",
      navbar: "navbar2",
    },
  },
  {
    path: "/customer/product/:id",
    name: "productdetail",
    component: () => import("../views/Customer/ProductDetailView.vue"),
    meta: {
      title: "Product Detail Page",
      navbar: "navbar2",
    },
  },
  {
    path: "/customer/cart",
    name: "cart",
    component: () => import("../views/Customer/CartView.vue"),
    meta: {
      title: "Cart Page",
      navbar: "navbar2",
      requiresAuth: true,
    },
  },
  {
    path: "/customer/checkout",
    name: "checkout",
    component: () => import("../views/Customer/CheckOutView.vue"),
    meta: {
      title: "CheckOut Page",
      navbar: "navbar2",
      requiresAuth: true,
    },
  },
  {
    path: "/customer/profile",
    name: "profile",
    component: () => import("../views/Customer/ProfileView.vue"),
    meta: {
      title: "Profile Page",
      navbar: "navbar2",
      requiresAuth: true,
    },
  },
  {
    path: "/customer/order",
    name: "orderCustomer",
    component: () => import("../views/Customer/OrderView.vue"),
    meta: {
      title: "Order Page",
      navbar: "navbar2",
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.meta.navbar === 'navbar1' && !store.getters.isLoggedIn) {
      next("/login");
    } else if (to.meta.navbar === "navbar2" && !store.getters.isLoggedCusIn) {
      
      next("/customer/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || "My App";
});

export default router;
