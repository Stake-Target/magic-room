export const state = () => ({
  list: [],
  filter: {
    network: '',
    address: '',
    nextKey: undefined
  }
})

export const getters = {
  fullLoad: state => (state.filter.nextKey && !state.filter.nextKey.length)
}

export const actions = {
  async REQUEST ({ state, commit }) {
    const result = await this.$cosmos({ name: state.filter.network }).getValidatorUnbondingDelegations(
      state.filter.address,
      state.filter.nextKey
    )
    commit('ADD_ITEMS', result.list)
    commit('SET_FILTER', {
      network: state.filter.network,
      address: state.filter.address,
      nextKey: result.pagination.nextKey
    })
  },
  async getDelegations ({ dispatch, state, commit }, { network, address }) {
    commit('SET_FILTER', { network, address, nextKey: undefined })
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
  SET_FILTER (state, { network, address, nextKey }) {
    state.filter = { network, address, nextKey }
  }
}
