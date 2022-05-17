export const state = () => ({
  network: '',
  blocks: [],
  block: null
})

export const getters = {
  latestBlockHeight: (state, getters) => getters.latestBlock && getters.latestBlock.header.height,
  latestBlock: state => state.blocks[0]
}

export const actions = {
  async getBlock ({ dispatch, state, commit }, { network, height }) {
    const block = await this.$cosmos({ name: network }).getBlock(height)
    commit('BLOCK', block)
  },
  async getBlocks ({ dispatch, state, commit }, network) {
    commit('CLEAR_BLOCKS')
    commit('SET_NETWORK', network)
    const blocks = await this.$cosmos({ name: network }).getBlocks()
    commit('ADD_BLOCKS', blocks)
  },
  async getMoreBlocks({ state, dispatch, commit }) {
    const lastBlock = state.blocks[state.blocks.length - 1]
    if (lastBlock) {
      const blocks = await this.$cosmos({ name: state.network }).getBlocks(
        lastBlock.header.height - 20,
        lastBlock.header.height - 1
      )
      commit('ADD_BLOCKS', blocks)
    }
  },
  addNewBlock ({ commit }, data) {
    commit('ADD_NEW_BLOCK', data)
  }
}

export const mutations = {
  ADD_BLOCKS (state, blocks = []) {
    state.blocks = state.blocks.concat(blocks)
  },
  ADD_NEW_BLOCK (state, data) {
    state.blocks.unshift(data)
  },
  CLEAR_BLOCKS (state) {
    state.blocks = []
  },
  BLOCK (state, data) {
    state.block = data
  },
  SET_NETWORK (state, value) {
    state.network = value
  }
}
