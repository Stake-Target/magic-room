<template>
  <div :class="$style.event">
    <div :class="$style.icon">👟</div>
    <div :class="$style.step">{{ step || '' }}</div>
    <div :class="$style.icon">{{ icon }}</div>
    <div :class="$style.name">{{ eventName }}</div>
    <template v-if="reward">
      <div :class="$style.account">{{ reward.member.name }}</div>
      <div :class="$style.value" v-if="reward">
        <img :class="$style.coin" src="~/assets/images/coin.png" alt="" />
        {{ reward.value }}
      </div>
    </template>
    <template v-if="chairChanges">
      <div :class="$style.account" :title="chairChanges.enter.name">{{ chairChanges.enter.name }}</div>
      <div :class="$style.icon">🧹</div>
      <div :class="$style.account" :title="chairChanges.leave.name">{{ chairChanges.leave.name || '👻' }}</div>
    </template>
    <div :class="$style.space"></div>
    <div :class="$style.date">
      <ui-date :value="timestamp" update :timeout="3000" to-ms format="past" />
    </div>
  </div>
</template>

<script>
import UiDate from "~/components/ui/date"

export default {
  name: 'SectionEventsEvent',
  components: {
    UiDate
  },
  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 0
    },
    reward: {
      type: Object,
      default: null
    },
    chairChanges: {
      type: Object,
      default: null
    }
  },
  computed: {
    icon () {
      switch (this.type) {
        case 'Vip': return '🏵'
        case 'Reward': return '🏅'
        case 'Winner': return '🏆'
        case 'ChangeChair': return '♻️'
        case 'StartRoom': return '🚨️'
        case 'FinishRoom': return '🏁'
        default: return ''
      }
    },
    eventName () {
      switch (this.type) {
        case 'ChangeChair': return 'Entered'
        case 'StartRoom': return 'New game'
        case 'FinishRoom': return 'Game finished'
        default: return this.type
      }
    }
  }
}
</script>

<style lang="scss" module>
.event {
  display: flex;
  font-size: 16px;
  padding: 5px 0;
  width: 100%;
  white-space: nowrap;
}
.icon {}
.name {
  font-weight: bold;
  min-width: 70px;
  margin-left: 5px;
}
.step {
  width: 40px;
}
.value {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
.coin {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
.account {
  margin: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
.space {
  flex: 1 1;
}
.date {
  color: #a8a8a8;
}
</style>
