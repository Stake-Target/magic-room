export const actions = {
  nuxtClientInit({ dispatch }) {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        dispatch('account/initAddress', accounts[0])
      })
    }
    this.$web3.game.addUpdateListener(() => dispatch('account/updateBalance'))
    this.$web3.game.addEventsListener((event) => {
      if (['ChangeChair', 'FinishRoom'].includes(event.event)) {
        dispatch('room/changeChair', event.data)
      }
    })
  }
}
