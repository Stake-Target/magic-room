export const state = () => ({
  list: [],
  filter: {
    network: '',
    address: ''
  },
  pagination: {
    total: 0,
    nextKey: undefined
  }
})

export const getters = {
  fullLoad: state => (state.pagination.nextKey && !state.pagination.nextKey.length)
}

export const actions = {
  async REQUEST ({ state, commit }) {
    const result = await this.$cosmos({ name: state.filter.network }).getValidatorDelegations(
      state.filter.address,
      state.pagination.nextKey
    )
    commit('ADD_ITEMS', result.list)
    commit('PAGINATION', result.pagination)
  },
  async getDelegations ({ dispatch, state, commit }, { network, address }) {
    commit('SET_FILTER', { network, address })
    commit('PAGINATION', { total: 0, nextKey: undefined })
    commit('CLEAR_ITEMS')
    await dispatch('REQUEST')
  },
  async getDelegationsMore ({ dispatch, getters, commit }) {
    if (!getters.fullLoad) {
      await dispatch('REQUEST')
    }
  }
}

export const mutations = {
  CLEAR_ITEMS (state) {
    state.list = []
  },
  ADD_ITEMS (state, data = []) {
    state.list = state.list.concat(data)
  },
  PAGINATION (state, { total, nextKey }) {
    state.pagination = { total, nextKey }
  },
  SET_FILTER (state, { network, address, nextKey }) {
    state.filter = { network, address, nextKey }
  }
}
