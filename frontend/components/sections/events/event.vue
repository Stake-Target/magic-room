<template>
  <div :class="$style.event">
    <div :class="$style.step" v-if="step && step !== prevStep">
      <div :class="$style.icon">STEP 👟 {{ step }}</div>
      <div :class="$style.space"></div>
      <div :class="$style.date">
        <ui-date :value="timestamp" update :timeout="3000" to-ms format="past" />
      </div>
    </div>

    <div :class="$style.data">
      <template v-if="chairChanges">
        <ui-pouf :class="$style.pouf" :empty="true" :priority="[1, 2, 3].includes(chairChanges.index)" />
      </template>
      <div v-else :class="$style.icon">{{ icon }}</div>
      <div :class="$style.name">{{ eventName }}</div>
      <template v-if="reward">
        <div :class="$style.account">{{ reward.member.name }}</div>
        <div :class="$style.space"></div>
        <div :class="$style.value" v-if="reward">
          <img :class="$style.coin" src="~/assets/images/coin.png" alt="" />
          {{ reward.value | number }}
        </div>
      </template>
      <template v-if="chairChanges">
        <div :class="$style.account" :title="chairChanges.enter.name">{{ chairChanges.enter.name }}</div>
        <div :class="$style.icon">🧹</div>
        <div :class="$style.account" :title="chairChanges.leave.name">{{ chairChanges.leave.name || '👻' }}</div>
        <div :class="$style.space"></div>
        <div :class="$style.value">
          <img :class="$style.coin" src="~/assets/images/coin.png" alt="" />
          {{ room.price | number }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UiDate from "~/components/ui/date"
import UiPouf from "~/components/ui/pouf"

export default {
  name: 'SectionEventsEvent',
  components: {
    UiPouf,
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
    room: {
      type: Object,
      default: null
    },
    step: {
      type: Number,
      default: 0
    },
    prevStep: {
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
        case 'StartRoom': return '🚨️'
        case 'FinishRoom': return '🏁'
        default: return ''
      }
    },
    eventName () {
      switch (this.type) {
        case 'ChangeChair': return 'Sits down'
        case 'StartRoom': return 'New game'
        case 'FinishRoom': return 'Game finished'
        case 'Vip': return 'VIP'
        default: return this.type
      }
    }
  }
}
</script>

<style lang="scss" module>
.event {
  font-size: 16px;
}
.data {
  display: flex;
  padding: 5px 0 5px 5px;
  width: 100%;
  white-space: nowrap;
  border-bottom: 1px dashed #bfbfbf;
  border-left: 1px dashed #bfbfbf;
}
.icon {}
.name {
  font-weight: bold;
  min-width: 70px;
  margin-left: 5px;
}
.pouf {
  width: 20px;
  height: 20px;
}
.step {
  display: flex;
  font-weight: bold;
  margin: 30px 0 10px;
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
  max-width: 100px;
}
.space {
  flex: 1 1;
}
.date {
  color: #a8a8a8;
  font-weight: normal;
}
</style>
