export const state = () => ({
  room: null
})

export const actions = {
  async init ({ commit }) {
    const room = await this.$web3.game.getCurrentRoom()
    commit('room', room)
  }
}

export const mutations = {
  room (state, data = null) {
    state.room = data
  }
}
