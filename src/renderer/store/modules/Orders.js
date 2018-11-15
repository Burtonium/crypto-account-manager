const state = {
  orders: [],
  lastId: 0,
};

const mutations = {
  ADD_ORDER(state, order) {
    state.orders.push({
      id: state.lastId,
      ...order,
    });
    state.lastId += 1;
  },
  REMOVE_ORDER(state, id) {
    const index = state.orders.findIndex(a => a.id === id);
    state.orders.splice(index, 1);
  },
  CLEAR_ALL(state) {
    state.orders = [];
  },
};

const actions = {
  addOrder({ commit }, order) {
    commit('ADD_ORDER', order);
  },
  deleteOrder({ commit }, id) {
    commit('REMOVE_ORDER', id);
  },
  clearAll({ commit }) {
    commit('CLEAR_ALL');
  },
};

const getters = {
  orders: state => state.orders,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
