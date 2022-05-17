export const state = () => ({
  account: null
})

export const actions = {
  async signin ({ dispatch }) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    dispatch('change', accounts[0])
  },
  async change ({ commit }, address) {
    const balance = await this.$web3.token.getBalance(address)
    const tokenApproved = await this.$web3.token.allowance(this.$web3.game.address, address)
    const owner = await this.$web3.game.isOwner(address)
    commit('account', { address, balance, tokenApproved, owner })
  }
}

export const mutations = {
  account (state, data = null) {
    state.account = data
  }
}
