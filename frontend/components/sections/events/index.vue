<template>
  <div :class="$style.events">
    <div :class="$style.head"></div>
    <div :class="$style.title">Events</div>
    <div :class="$style.data">
      <div v-for="event in events" :key="event.id">
        <div :class="$style.event" v-if="event.event === 'Vip'">
          <div :class="$style.icon">👟</div>
          <div :class="$style.step">{{ event.data.step }}</div>
          <div :class="$style.icon">🏵</div>
          <div :class="$style.name">Vip</div>
          <div :class="$style.address">{{ address(event.data.chair) }}</div>
          <div :class="$style.value">
            <img :class="$style.coin" src="~/assets/images/coin.png" />
            {{ event.data.value }}
          </div>
        </div>
        <div :class="$style.event" v-else-if="event.event === 'Reward'">
          <div :class="$style.icon">👟</div>
          <div :class="$style.step">{{ event.data.step }}</div>
          <div :class="$style.icon">🏅</div>
          <div :class="$style.name">Reward</div>
          <div :class="$style.address">{{ address(event.data.chair) }}</div>
          <div :class="$style.value">
            <img :class="$style.coin" src="~/assets/images/coin.png" />
            {{ event.data.value }}
          </div>
        </div>
        <div :class="$style.event" v-else-if="event.event === 'ChangeChair'">
          <div :class="$style.icon">👟</div>
          <div :class="$style.step">{{ event.data.step }}</div>
          <div :class="$style.icon">♻️</div>
          <div :class="$style.name">Drop</div>
          <div :class="$style.address">{{ address(event.data.enter) }}</div>
          <div :class="$style.icon">🧹</div>
          <div :class="$style.address">{{ address(event.data.leave) }}</div>
          <div :class="$style.value">
            <img :class="$style.coin" src="~/assets/images/coin.png" />
            {{ event.data.price }}
          </div>
        </div>
        <div :class="$style.event" v-else>
          🏆 {{ event }}
        </div>
      </div>
      <div v-if="!isFull" v-observe-visibility="{ callback: visibilityChanged }">
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SectionEvents',
  data () {
    return {
      events: [],
      loading: false,
      isFull: false
    }
  },
  computed: {
    ...mapState('account', ['account'])
  },
  methods: {
    async init () {
      // this.$web3.game.addEventsListener(this.onEvent)
      // await this.getPastEvents()
    },
    async getPastEvents () {
      if (this.loading) {
        return
      }
      try {
        this.loading = true
        const toBlock = this.getLastBlockNumber()
        this.$spinner.start()
        const events = await this.$web3.game.getPastEvents({ toBlock })
        this.events = this.events.concat(events)
        if (!events.length) {
          this.isFull = true
        }
      } finally {
        this.loading = false
        this.$spinner.stop()
      }
    },
    getLastBlockNumber () {
      if (this.events.length) {
        return this.events[this.events.length - 1].blockNumber - 1
      } else {
        return null
      }
    },
    onEvent (data) {
      this.events.unshift(data)
    },
    visibilityChanged (isVisible) {
      if (isVisible) {
        this.getPastEvents()
      }
    },
    address (address) {
      if (this.account && this.account.address.toUpperCase() === address.toUpperCase()) {
        return 'My account'
      } else {
        const _max = Math.min(20, address.length)
        const _end = Math.min(_max - 5, 5)
        const tail = address.slice(_end * -1)
        return address.slice(0, 2) + '...' + tail
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" module>
.events {
  border: 10px solid #000;
  background: #fff;
}
.head {
  margin: 20px;
  border-top: 40px dotted #e08331;
}
.data {
  padding: 20px;
  overflow: auto;
  height: 40vh;
}
.title {
  text-transform: uppercase;
  font-size: 24px;
  margin-left: 20px;
}
.event {
  display: flex;
  font-size: 16px;
  padding: 5px 0;
}
.icon {}
.name {
  font-weight: bold;
  width: 70px;
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
.address {
  margin: 0 5px;
}
</style>
