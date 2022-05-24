<template>
  <div :class="classes">
    <section-signin :class="$style.signin" />
    <section-form :class="$style.form" />

    <template v-if="room">
      <section-room-info :class="$style.roomInfo" />
      <section-room-chairs :class="$style.chairs" />
      <section-events :class="$style.events" />
    </template>

    <section-signin-name :class="$style.name" />

    <section-bubbles />
    <section-help />
    <section-controls :class="$style.controls" />
    <section-loading :style="loadingStyle" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SectionEvents from "~/components/sections/events"
import SectionSignin from "~/components/sections/signin"
import SectionRoomInfo from "~/components/sections/room/info"
import SectionRoomChairs from "~/components/sections/room/chairs"
import SectionBubbles from "~/components/sections/bubbles"
import SectionHelp from "~/components/sections/help"
import SectionForm from "~/components/sections/form"
import SectionLoading from "~/components/sections/loading"
import SectionSigninName from "~/components/sections/signin/name"
import detectEthereumProvider from '@metamask/detect-provider'
import SectionControls from "~/components/sections/controls"
// import MetaMaskOnboarding from '@metamask/onboarding'

export default {
  layout: 'page',
  name: 'GameMagicRoomPage',
  components: {
    SectionControls,
    SectionSigninName,
    SectionLoading,
    SectionForm,
    SectionRoomChairs,
    SectionHelp,
    SectionBubbles,
    SectionRoomInfo,
    SectionSignin,
    SectionEvents
  },
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room']),
    classes () {
      return {
        [this.$style.app]: true,
        [this.$style.authorized]: this.account
      }
    },
    loadingStyle () {
      if (!this.room) {
        return { right: '50%', bottom: '50%' }
      } else {
        return {}
      }
    }
  },
  methods: {
    ...mapActions('room', { loadRoom: 'init' }),
    ...mapActions('account', ['initAddress']),
    async init () {
      this.$spinner.start()
      try {
        await this.loadRoom()
        const provider = await detectEthereumProvider()
        if (typeof window.ethereum !== 'undefined') {
          window.ethereum.on('chainChanged', _chainId => window.location.reload())
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
  --theme-bg: #78aca7;
  --decor-size: 30px;

  font-family: "Comic Sans MS";
  min-height: 100vh;
  background: var(--theme-bg) url("@/assets/images/sky.svg") no-repeat;
  background-size: 200%;
  position: relative;
}
.signin {
  position: fixed;
  z-index: 2;
  top: 50px;
  width: 30%;
  right: calc(100% - 30% - 10%);
  transition: right 0.6s $transition-bounce;
  transition-delay: 100ms;
  .authorized & {
    right: 18%;
  }
}
.events {
  z-index: 2;
  transform: rotate(3deg);
  position: fixed;
  top: 30%;
  right: 5%;
  width: 500px;
}
.roomInfo {
  position: fixed;
  z-index: 2;
  top: 84%;
  left: 5%;
  transition: top 0.6s $transition-bounce;
  transition-delay: 50ms;
  .authorized & {
    top: 5%;
  }
}
.chairs {
  position: fixed;
  top: 5%;
  left: 5%;
  width: 100vh;
  bottom: 25%;
}
.form {
  position: fixed;
  bottom: 20px;
  left: 10%;
  transition: transform 0.6s $transition-bounce;
  transform: translate(-200%, 0);
  .authorized & {
    transform: translate(0, 0);
  }
}
.controls {
  z-index: 50;
  position: fixed;
  top: 70px;
  right: 150px;
}
.name {}
</style>
