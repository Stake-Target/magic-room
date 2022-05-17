<template>
  <div :class="$style.room">
    <div :class="$style.item">
      <div :class="$style.value">
        <span>{{ room.step | number }}/165</span>
      </div>
      <div :class="$style.title">Step</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.value">
        <img :class="$style.coin" src="~/assets/images/coin.png" />
        <span>{{ room.price | number }}</span>
      </div>
      <div :class="$style.title">Ticket price</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.value">
        <img :class="$style.coin" src="~/assets/images/coin.png" />
        <span>{{ room.bank | number }}</span>
      </div>
      <div :class="$style.title">Bank</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SectionRoomInfo',
  methods: {},
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room'])
  }
}
</script>

<style lang="scss" module>
.room {
  display: flex;
  align-items: center;
}
.item {
  padding: 20px;
  font-weight: bold;
  &:nth-child(1) {
    transform: rotate(2deg);
  }
  &:nth-child(2) {
    transform: rotate(-4deg);
  }
  &:nth-child(3) {
    transform: rotate(4deg);
  }
}
.title {
  font-size: 16px;
  text-transform: uppercase;
  margin-top: 10px;
}
.value {
  display: flex;
  align-items: center;
  font-size: 24px;
}
.coin {
  width: 26px;
  height: 26px;
  margin-right: 8px;
}
</style>
