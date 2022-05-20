<template>
  <div :class="classes">
    <section-signin :class="$style.signin" />
    <section-events :class="$style.events" />
    <section-form :class="$style.form" />

    <template v-if="room">
      <section-room-info :class="$style.roomInfo" />
      <section-room-chairs :class="$style.chairs" />
    </template>

    <section-signin-name :class="$style.name" />

    <section-bubbles />
    <section-help />
    <section-loading />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SectionEvents from "~/components/sections/events"
import SectionSignin from "~/components/sections/signin"
import SectionRoomInfo from "~/components/sections/room/info"
import SectionRoomChairs from "~/components/sections/room/chairs"
import SectionBubbles from "~/components/sections/bubbles"
import SectionHelp from "~/components/sections/help"
import SectionForm from "~/components/sections/form"
import SectionLoading from "~/components/sections/loading"
import SectionSigninName from "~/components/sections/signin/name"

export default {
  layout: 'page',
  name: 'GameMagicRoomPage',
  components: {
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
  methods: {
    // newEvent (data) {
    //   if (data.event === 'ChangeChair') {
    //     this.room.bank = data.data.bank
    //     this.room.step = data.data.step
    //     this.room.price = data.data.price
    //   }
    // }
  },
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room']),
    classes () {
      return {
        [this.$style.app]: true,
        [this.$style.authorized]: this.account
      }
    }
  }
}
</script>

<style lang="scss" module>
.app {
  font-family: "Comic Sans MS";
  min-height: 100vh;
  background-color: rgba(236, 133, 75, 0.94);
  position: relative;
  --decor-size: 30px;
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
    right: 10%;
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
.name {}
.admin {
  position: fixed;
  bottom: 40px;
  left: 45%;
}
</style>
