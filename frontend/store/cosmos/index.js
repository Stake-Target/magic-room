export const state = () => ({
  network: null
})

export const actions = {
  watchBlocks ({ dispatch }, network) {
    this.$cosmos({ name: network }).addNewBlockListener((preview) => {
      dispatch('blocks/addNewBlock', preview)
    })
  },
  unwatchBlocks (store, network) {
    this.$cosmos({ name: network }).removeNewBlockListener()
  },
  async getInfo ({ state, commit, dispatch }, network) {
    const res = await this.$cosmos({ name: network }).getInfo()
    res.name = network
    commit('info', res)
  }
}

export const mutations = {
  info (state, data) {
    state.network = data
  }
}
