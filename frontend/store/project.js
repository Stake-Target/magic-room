export const state = () => ({
  page: null
})

export const actions = {
  async fetchPage ({ commit }, uid) {
    const document = await this.$prismic.api.getByUID('project', uid, {
      fetchLinks: []
    })
    commit('page', document)
  }
}

export const mutations = {
  page (state, document = null) {
    state.page = document
  }
}
