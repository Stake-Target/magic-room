export const state = () => ({
  page: null
})

export const actions = {
  async fetchPage ({ commit }) {
    const document = await this.$prismic.api.getSingle('landing', {
      fetchLinks: [
        'project.title',
        'project.short',
        'project.image'
      ]
    })
    commit('page', document)
  }
}

export const mutations = {
  page (state, document = null) {
    state.page = document
  }
}
