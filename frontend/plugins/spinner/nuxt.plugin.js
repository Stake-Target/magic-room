import Vue from 'vue'

export default function ({ app }, inject) {
  const spinner = Vue.observable({
    counter: 0,
    start () {
      this.counter++
    },
    stop () {
      this.counter = this.counter - 1
    }
  })
  inject('spinner', spinner)
}
