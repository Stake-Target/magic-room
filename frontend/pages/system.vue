<template>
  <div :class="$style.app">
    <div>
      <a target="_blank" :href="$web3.getGameExplorerUrl()">Explorer game contract</a>
    </div>
    <div>
      <a target="_blank" :href="$web3.getTokenExplorerUrl()">Explorer token contract</a>
    </div>
    <div>
      account:
      <pre>{{ account }}</pre>
    </div>
    <div>
      room:
      <pre>{{ room }}</pre>
    </div>
    <section-loading />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SectionLoading from "~/components/sections/loading"
import detectEthereumProvider from '@metamask/detect-provider'

export default {
  layout: 'page',
  name: 'SystemPage',
  components: {
    SectionLoading
  },
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room'])
  },
  methods: {
    ...mapActions('room', { loadRoom: 'init' }),
    ...mapActions('account', ['initAddress']),
    async init () {
      this.$spinner.start()
      try {
        await this.loadRoom()

        const provider = await detectEthereumProvider()
        window.ethereum.on('chainChanged', _chainId => window.location.reload())

        if (typeof window.ethereum !== 'undefined') {
          await this.$web3.switchChain()
          await this.initAddress(provider.selectedAddress)
        }
      } finally {
        this.$spinner.stop()
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" module>
.app {
  font-family: "Comic Sans MS";
  min-height: 100vh;
  background-color: rgba(236, 133, 75, 0.94);
  font-size: 20px;
  padding: 50px;
  a {
    color: #e2e24d;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
