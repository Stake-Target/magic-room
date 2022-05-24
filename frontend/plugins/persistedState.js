import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'storage',
    paths: ['account.names', 'mute']
  })(store)
}
