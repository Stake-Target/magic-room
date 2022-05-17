import ru from './locs/ru'
import en from './locs/en'

const langs = { ru, en }

export class CustomDate {
  constructor({ timestamp, locale }) {
    this.current = new Date()
    this.dateObject = new Date(timestamp)
    this.timestamp = this.dateObject.getTime()
    this.defaultLocale = 'en'
    this.locale = locale
    this.utc = this.getUTC()
    this.date = this.getDate()
    this.datetime = this.dateObject.toJSON()
    this.isCurrentYear = this.dateObject.getFullYear() === this.current.getFullYear()
    this.timeZoneOffset = this.getTimeZoneOffset()
    this.update()
  }

  isToday() {
    return this.dateObject.toDateString() === this.now.toDateString()
  }

  isYesterday() {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return this.dateObject.toDateString() === yesterday.toDateString()
  }

  isTomorrow() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.dateObject.toDateString() === tomorrow.toDateString()
  }

  getDate() {
    const month = this.dateObject.getMonth()
    return {
      year: getParsedValue(this.dateObject.getFullYear()),
      month: { value: month, string: toStringValue(month + 1) },
      day: getParsedValue(this.dateObject.getDate()),
      weekday: getParsedValue(this.dateObject.getDay() - 1),
      hours: getParsedValue(this.dateObject.getHours()),
      minutes: getParsedValue(this.dateObject.getMinutes()),
      seconds: getParsedValue(this.dateObject.getSeconds())
    }
  }

  getTimeZoneOffset () {
    const offset = this.dateObject.getTimezoneOffset()
    const dir = offset > -1 ? '-' : '+'
    const value = toStringValue(Math.abs(offset) / 60)
    return `GMT${dir}${value}:00`
  }

  getUTC () {
    const month = this.dateObject.getUTCMonth()
    return {
      year: getParsedValue(this.dateObject.getUTCFullYear()),
      month: { value: month, string: toStringValue(month + 1) },
      day: getParsedValue(this.dateObject.getUTCDate()),
      weekday: getParsedValue(this.dateObject.getUTCDay() - 1),
      hours: getParsedValue(this.dateObject.getUTCHours()),
      minutes: getParsedValue(this.dateObject.getUTCMinutes()),
      seconds: getParsedValue(this.dateObject.getUTCSeconds())
    }
  }

  update() {
    this.now = new Date()
    this.left = Date.now() - this.timestamp
    this.past = this.getPast()
    this.future = this.getFuture()
    this.today = this.isToday()
    this.yesterday = this.isYesterday()
    this.tomorrow = this.isTomorrow()
    this.t = this.getTranslates()
  }

  getTranslates() {
    const translates = langs[this.locale] || langs[this.defaultLocale]
    const relative = this.left > 0 ? this.past : this.future
    return {
      month: translates.months[this.date.month.value],
      weekday: translates.weekdays[this.date.weekday.value],
      in: translates.in,
      ago: translates.ago,
      short: this.today
        ? translates.today
        : this.yesterday
          ? translates.yesterday
          : this.tomorrow
            ? translates.tomorrow
            : '',
      relative: {
        days: {
          normal: numerate(translates.normal.days, relative.days.value),
          left: numerate(translates.left.days, relative.days.value)
        },
        hours: {
          normal: numerate(translates.normal.hours, relative.hours.value),
          left: numerate(translates.left.hours, relative.hours.value)
        },
        minutes: {
          normal: numerate(translates.normal.minutes, relative.minutes.value),
          left: numerate(translates.left.minutes, relative.minutes.value)
        },
        seconds: {
          normal: numerate(translates.normal.seconds, relative.seconds.value),
          left: numerate(translates.left.seconds, relative.seconds.value)
        }
      }
    }
  }

  getPast() {
    const left = this.left > 0 ? this.left : 0
    return this.buildLeft(left)
  }

  getFuture() {
    const left = this.left < 0 ? Math.abs(this.left) : 0
    return this.buildLeft(left)
  }

  buildLeft(left) {
    return {
      left,
      days: getParsedValue(Math.floor(left / 1000 / (60 * 60 * 24))),
      hours: getParsedValue(Math.floor((left / 1000 / (60 * 60)) % 24)),
      minutes: getParsedValue(Math.floor((left / 1000 / 60) % 60)),
      seconds: getParsedValue(Math.floor((left / 1000) % 60))
    }
  }
}

function numerate(variants, count = 0) {
  let result = ''
  const first = variants[0] || ''
  const second = variants[1] || ''
  const third = variants[2] || second
  const empty = variants[3] || third
  const _count = Math.abs(count)

  if (_count.toString().includes('.')) {
    result = second
  } else if (!_count) {
    result = empty
  } else if (_count % 10 === 1 && _count % 100 !== 11) {
    result = first
  } else if (_count % 10 >= 2 && _count % 10 <= 4 && (_count % 100 < 10 || _count % 100 >= 20)) {
    result = second
  } else {
    result = third
  }
  return result
}

function toStringValue (value) {
  return value.toString().padStart(2, '0')
}

function getParsedValue (value) {
  return {
    value,
    string: value.toString().padStart(2, '0')
  }
}
