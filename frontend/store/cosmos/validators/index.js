export const state = () => ({
  network: '',
  validators: [],
  validator: null
})

export const getters = {
  validatorsByStatus: state => (status) => {
    return state.validators.filter(item => item.status === status)
  }
}

export const actions = {
  async getValidator ({ dispatch, state, commit }, { network, address }) {
    const validator = await this.$cosmos({ name: network }).getValidator(address)
    commit('VALIDATOR', validator)
  },
  async getValidators ({ dispatch, state, commit }, network) {
    if (state.network !== network || !state.validators.length) {
      commit('SET_NETWORK', network)
      commit('CLEAR_VALIDATORS')
      const $validators = await this.$cosmos({ name: network }).getValidatorsCache()
      commit('ADD_VALIDATORS', $validators.getValidators())
    }
  }
}

export const mutations = {
  ADD_VALIDATORS (state, validators = []) {
    state.validators = validators
  },
  CLEAR_VALIDATORS (state) {
    state.validators = []
  },
  VALIDATOR (state, data) {
    state.validator = data
  },
  SET_NETWORK (state, value) {
    state.network = value
  }
}
