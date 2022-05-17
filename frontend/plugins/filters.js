import Vue from 'vue'
import number from '../frontend/filters/number'
import hash from '../frontend/filters/hash'

Vue.filter('number', number)
Vue.filter('hash', hash)
