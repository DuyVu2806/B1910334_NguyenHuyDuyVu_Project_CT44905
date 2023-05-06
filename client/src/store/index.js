import { createStore } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

export default createStore({
  state: {
    isLoggedIn: false,
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    isLoggedCusIn: false,
    currentCus: JSON.parse(localStorage.getItem("currentCus")) || null,
    cartItemCount: 0,
    cart: [],
    myorderItemCount: 0,
    myorder: [],
    loading: true,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    isLoggedInLocal: () => localStorage.getItem("isLoggedIn") === "true",
    isLoggedCusIn: (state) => state.isLoggedCusIn,
    isLoggedCusInLocal: () => localStorage.getItem("isLoggedInCus") === "true",
    cartItemCount: (state) => state.cartItemCount,
    cartItems: (state) => state.cart,
    myorderItemCount: (state) => state.myorderItemCount,
    myorderItems: (state) => state.myorder,
  },
  mutations: {
    SET_IS_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
      localStorage.setItem("isLoggedIn", value);
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_IS_LOGGED_IN_CUS(state, value) {
      state.isLoggedCusIn = value;
      localStorage.setItem("isLoggedInCus", value);
    },
    SET_CURRENT_CUS(state, user) {
      state.currentCus = user;
    },
    setCartItemCount(state, count) {
      state.cartItemCount = count;
    },
    setCart(state, cartItems) {
      state.cart = cartItems;
    },
    setMyOrderItemCount(state, count) {
      state.myorderItemCount = count;
    },
    setMyOrder(state, myorderItems) {
      state.cart = myorderItems;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    updateCartItem(state, updatedItem) {
      const index = state.cart.findIndex(
        (item) => item._id === updatedItem._id
      );
      if (index !== -1) {
        state.cart.splice(index, 1, updatedItem);
      }
    },
    resetCartItemCount(state) {
      state.cartItemCount = 0;
    },
    resetOrderItemCount(state) {
      state.myorderItemCount = 0;
    },
    removeFromCart(state, { productId, userId }) {
      const index = state.cart.findIndex(
        (item) => item._id === productId && item.userId._id === userId
      );
      if (index !== -1) {
        state.cart.splice(index, 1);
        state.cartItemCount--;
      }
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
  },

  actions: {
    setCurrentUser({ commit }, user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      commit("SET_CURRENT_USER", user);
    },
    setCurrentCus({ commit }, user) {
      localStorage.setItem("currentCus", JSON.stringify(user));
      commit("SET_CURRENT_CUS", user);
    },
    async fetchCartItemCount({ commit }, userId) {
      if (userId) {
        const response = await axios.get(
          `http://localhost:5000/api/cart/count/${userId}`
        );
        commit("setCartItemCount", response.data.count);
      } else {
        commit("setCartItemCount", 0);
      }
    },
    async fetchCart({ commit }, userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/${userId}`
        );
        const cartItems = response.data;
        commit("setCart", cartItems);
      } catch (error) {
        console.log(error);
      }
    },

    async fetchMyOrderItemCount({ commit }, userId) {
      if (userId) {
        const response = await axios.get(
          `http://localhost:5000/api/order/count/${userId}`
        );
        commit("setMyOrderItemCount", response.data.count);
      } else {
        commit("setMyOrderItemCount", 0);
      }
    },

    async fetchMyOrder({ commit }, userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/get/userorders${userId}`
        );
        const orderItems = response.data;
        commit("setMyOrder", orderItems);
      } catch (error) {
        console.log(error);
      }
    },

    async clearCart({ commit }, userId) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/cart/customer/${userId}`)
        commit('CLEAR_CART')
        commit('resetCartItemCount')
      } catch (error) {
        console.log(error)
      }
    },
    async addToCartAction({ dispatch }, { userId, productId, quantity }) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/check/${userId}/${productId}`
        );
        console.log(response.data.message);
        if (response.data.message) {
          Swal.fire({
            icon: "warning",
            title: "Sản phẩm đã tồn tại trong giỏ hàng",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const response = await axios.post("http://localhost:5000/api/cart", {
            userId,
            productId,
            quantity,
          });
          const newProduct = response.data;
          console.log(newProduct);
          await dispatch("fetchCartItemCount", userId);
          Swal.fire({
            icon: "success",
            title: "Thêm sản phẩm thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateCartItemQuantity({ commit }, { itemId, quantity }) {
      try {
        const response = await axios.patch(
          `http://localhost:5000/api/cart/${itemId}`,
          { quantity }
        );
        commit("updateCartItem", response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async removeFromCart({ commit, state }, { productId, userId }) {
      const itemIndex = state.cart.findIndex(
        (item) => item._id === productId && item.userId._id === userId
      );
      if (itemIndex >= 0) {
        try {
          await axios.delete(`http://localhost:5000/api/cart/${productId}`);
          Swal.fire({
            icon: "success",
            title: "Xóa sản phẩm thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          commit("removeFromCart", { productId, userId });
        } catch (error) {
          console.log(error);
        }
      }
    },
    
  },
  modules: {},
});
