export const state = () => ({
  room: null
})

export const getters = {
  roomIsActive: state => state.room && (state.room.active && (state.room.lastActionTime + (24 * 60 * 60)) * 1000 > Date.now())
}

export const actions = {
  async init ({ commit }) {
    const room = await this.$web3.game.getCurrentRoom()
    commit('room', room)
  },
  changeChair ({ commit, state }, data) {
    commit('update', data.room)
  }
}

export const mutations = {
  room (state, data = null) {
    state.room = data
  },
  update (state, data) {
    Object.keys(data).forEach((key) => {
      state.room[key] = data[key]
    })
  }
}
