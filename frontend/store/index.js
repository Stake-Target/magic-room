export const actions = {
  nuxtClientInit({ dispatch }) {
    window.ethereum.on('accountsChanged', (accounts) => {
      dispatch('account/change', accounts[0])
    })
    this.$web3.game.addEventsListener((event) => {
      if (['ChangeChair', 'FinishRoom'].includes(event.event)) {
        dispatch('room/changeChair', event.data)
      }
    })
  }
}
