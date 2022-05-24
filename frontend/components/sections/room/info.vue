<template>
  <div :class="$style.room">
    <div :class="$style.item">
      <div :class="$style.value">
        <span>{{ room.step | number }}/{{ room.steps | number }}</span>
      </div>
      <div :class="$style.title"><span :class="$style.emoji">👟</span> Step</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.value">
        <img :class="$style.coin" src="~/assets/images/coin.png" alt="" />
        <span>{{ room.price | number }}</span>
      </div>
      <div :class="$style.title"><span :class="$style.emoji">💵</span> Ticket</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.value">
        <img :class="$style.coin" src="~/assets/images/coin.png" alt="" />
        <span>{{ room.bank | number }}</span>
      </div>
      <div :class="$style.title"><span :class="$style.emoji">🏦</span> Bank</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.value">
        <ui-date :value="room.lastActionTime + 24 * 60 * 60"  to-ms format="future-time" update :timeout="1000" />
      </div>
      <div :class="$style.title"><span :class="$style.emoji">🕗</span> Timeout</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UiDate from "~/components/ui/date"

export default {
  name: 'SectionRoomInfo',
  components: {
    UiDate
  },
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
  background-color: rgba(#d6e8ff, 0.1);
  border-radius: 50px;
  margin: 0 5px;
  color: #fff;
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
.emoji {
  font-size: 24px;
}
.coin {
  width: 26px;
  height: 26px;
  margin-right: 8px;
}
</style>
