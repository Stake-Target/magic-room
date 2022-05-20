export const state = () => ({
  room: null
})

export const getters = {
  roomIsActive: state => state.room && (state.room.active && state.room.lastActionTime + (24 * 60 * 60) > Date.now())
}

export const actions = {
  async init ({ commit }) {
    const room = await this.$web3.game.getCurrentRoom()
    commit('room', room)
  },
  changeChair ({ commit, state }, data) {
    if (state.room.roomId === data.roomId) {
      commit('update', {
        bank: data.bank,
        price: data.price,
        step: data.step
      })
    }
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
