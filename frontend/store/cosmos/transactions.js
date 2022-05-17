export const state = () => ({
  network: '',
  transaction: null,
  transactions: [],
  filter: {
    network: '',
    query: '',
    page: 1
  },
  meta: {
    total: 0
  }
})

export const getters = {
  fullLoad: state => (state.meta.total && state.transactions.length >= state.meta.total)
}

export const actions = {
  async REQUEST_LIST ({ state, commit }) {
    const result = await this.$cosmos({ name: state.filter.network }).getTransactions({
      query: state.filter.query,
      page: state.filter.page
    })
    commit('ADD_TXS', result.txs)
    commit('SET_META', { total: result.pagination.total })
  },
  async getTransactions ({ dispatch, state, commit }, { network, query }) {
    commit('SET_FILTER', { network, query, page: 1 })
    commit('CLEAR_TXS')
    await dispatch('REQUEST_LIST')
  },
  async getTransactionsMore ({ dispatch, getters, state, commit }) {
    if (!getters.fullLoad) {
      commit('SET_FILTER', {
        network: state.filter.network,
        query: state.filter.query,
        page: state.filter.page + 1
      })
      await dispatch('REQUEST_LIST')
    }
  },
  async getTransaction ({ commit }, { hash, network }) {
    const result = await this.$cosmos({ name: network }).getTransaction({ hash })
    commit('ADD_TX', result)
  }
}

export const mutations = {
  CLEAR_TXS (state) {
    state.transactions = []
  },
  ADD_TX (state, data = []) {
    state.transaction = data
  },
  ADD_TXS (state, data = []) {
    state.transactions = state.transactions.concat(data)
  },
  SET_FILTER (state, { network, query, page }) {
    state.filter = { network, query, page }
  },
  SET_META (state, { total }) {
    state.meta = { total }
  }
}
