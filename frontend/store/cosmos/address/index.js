export const state = () => ({
  address: null
})

export const actions = {
  async getAddress ({ dispatch, state, commit }, { network, address }) {
    const result = await this.$cosmos({ name: network }).getAddress(address)
    commit('ADDRESS', result)
  }
}

export const mutations = {
  ADDRESS (state, data) {
    state.address = data
  }
}
