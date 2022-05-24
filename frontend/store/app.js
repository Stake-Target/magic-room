export const state = () => ({
  mute: false
})
export const actions = {}
export const mutations = {
  setMute (state, value = false) {
    state.mute = value
  }
}
