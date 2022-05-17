export const actions = {
  nuxtClientInit({ dispatch }) {
    dispatch('room/init')
    window.ethereum.on('accountsChanged', (accounts) => {
      dispatch('account/change', accounts[0])
    })
  }
}
