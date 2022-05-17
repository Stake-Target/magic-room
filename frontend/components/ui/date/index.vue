<template>
  <time v-if="time" :datetime="time.datetime">
    <slot name="before" :time="time" />
    <span v-if="format">{{ formatted }}</span>
    <slot :time="time" />
    <slot name="after" :time="time" />
  </time>
</template>

<script>
export default {
  name: 'UiDate',
  props: {
    value: {
      type: [String, Number, Date],
      default: ''
    },
    sendTimeout: {
      type: Boolean,
      default: false
    },
    /**
     * Formats:
     * future-time - 00:10:26
     */
    format: {
      type: String,
      default: 'date',
      validate: v => ['past', 'date', 'date-s', 'time', 'future', 'future-time', 'utc'].includes(v)
    },
    update: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 60000
    },
    toMs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      interval: null,
      time: null,
      formatted: ''
    }
  },
  computed: {
    timestamp() {
      if (this.toMs) {
        return this.value * 1000
      } else {
        return this.value
      }
    }
  },
  methods: {
    calc() {
      this.time.update()
      this.formatted = this.getFormatted()
      this.checkFuture()
    },
    checkFuture() {
      if (this.sendTimeout) {
        if (this.time.future.left === 0) {
          this.$emit('timeout')
        }
      }
    },
    formatPast() {
      if (this.time.past.days.value > 30) {
        return this.formatDay()
      } else if (this.time.past.days.value) {
        return `${this.time.past.days.value} ${this.time.t.relative.days.left} ${this.time.t.ago}`
      } else if (this.time.past.hours.value) {
        const value = this.time.past.hours.value > 1 ? this.time.past.hours.value + ' ' : ''
        return `${value}${this.time.t.relative.hours.left} ${this.time.t.ago}`
      } else if (this.time.past.minutes.value) {
        const value = this.time.past.minutes.value > 1 ? this.time.past.minutes.value + ' ' : ''
        return `${value}${this.time.t.relative.minutes.left} ${this.time.t.ago}`
      } else {
        return `${this.time.past.seconds.value} ${this.time.t.relative.seconds.left} ${this.time.t.ago}`
      }
    },
    formatDate({ sec }) {
      return `${this.formatDay()} ${this.formatTime(sec)}`
    },
    formatDay() {
      return `${this.time.date.day.string} ${this.time.t.month} ${this.time.date.year.string}`
    },
    formatTime(sec = false) {
      return `${this.time.date.hours.string}:${this.time.date.minutes.string}${sec ? `:${this.time.date.seconds.string}` : ''}`
    },
    formatFuture() {
      if (this.time.future.days.value) {
        return `${this.time.future.days.value} ${
          this.time.t.relative.days.left
        } ${this.formatFutureTime()}`
      } else {
        return this.formatFutureTime()
      }
    },
    formatFutureTime() {
      return `${this.time.future.hours.string}:${this.time.future.minutes.string}:${this.time.future.seconds.string}`
    },
    formatUTC () {
      return `${this.time.utc.day.string}.${this.time.utc.month.string}.${this.time.utc.year.string} ${this.formatUTCTime()}`
    },
    formatUTCTime () {
      return `${this.time.utc.hours.string}:${this.time.utc.minutes.string}:${this.time.utc.seconds.string}`
    },
    getFormatted() {
      switch (this.format) {
        case 'utc': return this.formatUTC()
        case 'past': return this.formatPast()
        case 'date': return this.formatDate({ sec: false })
        case 'date-s': return this.formatDate({ sec: true })
        case 'time': return this.formatTime()
        case 'future': return this.formatFuture()
        case 'future-time': return this.formatFutureTime()
      }
      return 'there is no such format'
    }
  },
  mounted() {
    this.time = this.$date(this.timestamp)
    this.calc()
    if (this.update) {
      this.interval = setInterval(this.calc, this.timeout)
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>
