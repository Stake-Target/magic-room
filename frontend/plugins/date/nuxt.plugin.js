import { CustomDate } from './index'

export default function ({ app }, inject) {
  function customDate(timestamp) {
    const locale = app.i18n.locale
    return new CustomDate({ timestamp, locale })
  }
  customDate.setServerTime = function () {}
  inject('date', customDate)
}
