const state = {
  accounts: [],
  lastId: 0,
};

const mutations = {
  ADD_ACCOUNT(state, account) {
    state.accounts.push({
      id: state.lastId,
      ...account,
    });
    state.lastId += 1;
  },
  REMOVE_ACCOUNT(state, id) {
    const index = state.accounts.findIndex(a => a.id === id);
    state.accounts.splice(index, 1);
  },
  CLEAR_ALL(state) {
    state.accounts = [];
  },
};

const actions = {
  addAccount({ commit }, account) {
    commit('ADD_ACCOUNT', account);
  },
  deleteAccount({ commit }, id) {
    commit('REMOVE_ACCOUNT', id);
  },
};

const getters = {
  accounts: state => state.accounts,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
