import Vue from 'vue'

export const state = () => ({
  account: null,
  names: {}
})

export const getters = {
  name: state => state.account ? state.names[state.account.address] : ''
}

export const actions = {
  async signin ({ dispatch }) {
    const result = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return result[0]
  },
  async initAddress ({ commit }, address) {
    if (address) {
      const balance = await this.$web3.token.getBalance(address)
      const tokenApproved = await this.$web3.token.allowance(this.$web3.game.address, address)
      commit('account', { address, balance, tokenApproved })
    }
  },
  async updateBalance ({ commit, state }) {
    if (state.account) {
      const balance = await this.$web3.token.getBalance(state.account.address)
      commit('balance', balance)
    }
  },
  addApprovedTokens ({ commit }, amount) {
    commit('addApprovedTokens', amount)
  },
  setName ({ commit, state }, name) {
    commit('name', { address: state.account.address, name })
  }
}

export const mutations = {
  account (state, data = null) {
    state.account = data
  },
  balance (state, balance = 0) {
    state.account.balance = balance
  },
  name (state, { address, name }) {
    Vue.set(state.names, address, name)
  },
  addApprovedTokens (state, amount) {
    state.account.tokenApproved = state.account.tokenApproved + amount
  }
}
