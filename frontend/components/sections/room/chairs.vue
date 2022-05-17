<template>
  <div :class="$style.room">
    <div :class="$style.chair" v-for="chair in chairs" :key="chair.index">
      <img src="~/assets/images/chair.full.png" alt="" />
      <template v-if="chair.isMy">My</template>
      <template v-if="chair.isEmpty">Empty</template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SectionRoomChairs',
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room']),
    chairs () {
      const emptyAddress = '0x0000000000000000000000000000000000000000'
      return this.room.chairs.map((chair, i) => {
        return {
          index: i,
          isEmpty: emptyAddress === chair,
          isMy: this.account && this.account.address.toUpperCase() === chair.toUpperCase(),
          address: chair
        }
      })
    }
  }
}
</script>

<style lang="scss" module>
.room {}
.chair {
  position: absolute;
  width: 18%;
  &:nth-child(1) {
    top: 10%;
    left: 0;
  }
  &:nth-child(2) {
    top: 8%;
    left: 24%;
    transform: rotate(10deg);
  }
  &:nth-child(3) {
    top: 0;
    left: 48%;
  }
  &:nth-child(4) {
    top: -2%;
    left: 72%;
    transform: rotate(-10deg);
  }

  &:nth-child(5) {
    top: 42%;
    left: 5%;
  }
  &:nth-child(6) {
    top: 39%;
    left: 34%;
  }
  &:nth-child(7) {
    top: 35%;
    left: 56%;
    transform: rotate(8deg);
  }

  &:nth-child(8) {
    top: 74%;
    left: 2%;
    transform: rotate(6deg);
  }
  &:nth-child(9) {
    top: 72%;
    left: 28%;
    transform: rotate(-5deg);
  }
  &:nth-child(10) {
    top: 75%;
    left: 60%;
  }
  img {
    width: 100%;
  }
}
</style>
