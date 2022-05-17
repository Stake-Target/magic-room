<template>
  <div :class="classes">
    <section-signin :class="$style.signin" />
    <section-events :class="$style.events" />
    <section-room-info v-if="room" :class="$style.roomInfo" />
    <section-room-chairs v-if="room" :class="$style.chairs" />
    <section-form :class="$style.form" />
    <section-bubbles />
    <section-help />
    <section-loading />

    <div v-if="account && account.owner" :class="$style.system">
      <button :class="$style.btn" v-if="!room || !room.active" @click="onCreateRoom"><span>Create room</span></button>
      <button :class="$style.btn" v-if="room && room.active" @click="onFinishRoom"><span>Finish room</span></button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SectionEvents from "~/components/sections/events"
import SectionSignin from "~/components/sections/signin"
import SectionRoomInfo from "~/components/sections/room/info"
import SectionRoomChairs from "~/components/sections/room/chairs"
import SectionBubbles from "~/components/sections/bubbles"
import SectionHelp from "~/components/sections/help"
import SectionForm from "~/components/sections/form"
import SectionLoading from "~/components/sections/loading"

export default {
  layout: 'page',
  name: 'GameMagicRoomPage',
  components: {
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
    ...mapActions('account', ['signin']),
    async onCreateRoom () {
      await this.$web3.game.createRoom(this.account.address)
      await this.initGame()
    },
    async onFinishRoom () {
      await this.$web3.game.finishRoom(this.account.address)
    }
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
  background-color: rgba(248, 142, 82, 0.94);
  position: relative;
  --decor-size: 30px;
}
.signin {
  position: fixed;
  z-index: 2;
  top: 70px;
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
  top: 80%;
  left: 5%;
  transition: top 0.6s $transition-bounce;
  transition-delay: 50ms;
  .authorized & {
    top: 10%;
  }
}
.chairs {
  position: fixed;
  top: 15%;
  left: 5%;
  width: 100vh;
  bottom: 20%;
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

.btn {
  text-align: center;
  display: flex;
  align-items: center;
  border: 10px solid #e08331;
  padding: 10px 20px;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  span {
    width: 150px;
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
  }
  &:after {
    content: "";
    margin: auto 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    background-color: #eaa366;
    transform: scale(0);
    transition: transform 0.4s ease;
    z-index: 1;
  }
  &:hover {
    color: #fff;
    transform: rotate(5deg) scale(1.4);
    img {
      transform: scale(2) rotate(-4deg);
    }
    &:after {
      transform: scale(8);
    }
    span {
      transform: translate(10px, 0);
    }
  }
  img {
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    margin-right: 15px;
    z-index: 3;
    position: relative;
  }
}
.system {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 40px;
  left: 45%;
  .btn + .btn {
    margin-left: 40px;
  }
}
</style>
