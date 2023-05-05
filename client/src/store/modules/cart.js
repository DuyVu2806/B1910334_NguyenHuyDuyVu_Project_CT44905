// store/modules/cart.js
import axios from "axios";
import jwt_decode from 'jwt-decode'

const state = {
  cartItemCount: 0,
};

const mutations = {
  setCartItemCount(state, count) {
    state.cartItemCount = count;
  },
};

const actions = {
  async fetchCartItemCount({ commit }, userId) {
    const response = await axios.get(
      `http://localhost:5000/api/cart/count/${userId}`
    );
    commit("setCartItemCount", response.data.count);
  },

  async updateCartItemCount({ commit}) {
    const token = localStorage.getItem("tokenCustomer");
    if (!token) return;

    const userId = jwt_decode(token).userId;

    const response = await axios.get(
      `http://localhost:5000/api/cart/count/${userId}`
    );
    commit("setCartItemCount", response.data.count);
  },
};

export default {
  state,
  mutations,
  actions,
};
