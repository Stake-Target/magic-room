<template>
  <div :class="$style.events">
    <div :class="$style.head"></div>
    <div :class="$style.title">Events</div>
    <div :class="$style.data">
      <div v-for="event in events" :key="event.id">
        <section-events-event
          v-if="['Winner', 'FinishRoom', 'Vip', 'Reward', 'ChangeChair', 'StartRoom'].includes(event.event)"
          :type="event.event"
          :timestamp="event.timestamp"
          :step="event.data.step"
          :reward="event.data.reward"
          :chair-changes="event.data.chairChanges"
        />

        <template v-else>
          <div :class="$style.event">
            ===========
            <pre>{{ event }}</pre>
          </div>
        </template>
      </div>
      <div v-if="!isFull" v-observe-visibility="{ callback: visibilityChanged }">
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SectionEventsEvent from "~/components/sections/events/event"

export default {
  name: 'SectionEvents',
  components: {
    SectionEventsEvent
  },
  data () {
    return {
      events: [],
      loading: false,
      needLoad: false,
      fromBlock: null
    }
  },
  computed: {
    ...mapState('room', ['room']),
    ...mapState('account', ['account']),
    isFull () {
      return this.fromBlock === this.$web3.game.genesisBlock
    }
  },
  methods: {
    async init () {
      this.$web3.game.addEventsListener(this.onEvent)
      await this.getPastEvents()
    },
    async getPastEvents () {
      if (this.loading || !this.needLoad || this.isFull) {
        return
      }
      try {
        this.$spinner.start()
        this.loading = true
        // const toBlock = this.getLastBlockNumber()
        const { events, fromBlock } = await this.$web3.game.getPastEvents({ toBlock: this.fromBlock })
        this.fromBlock = fromBlock
        this.events = this.events.concat(events)
      } finally {
        this.loading = false
        this.$spinner.stop()
        this.getPastEvents()
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
      this.needLoad = isVisible
      this.getPastEvents()
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
