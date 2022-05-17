import Vue from 'vue'
import number from '../filters/number'
import hash from '../filters/hash'

Vue.filter('number', number)
Vue.filter('hash', hash)
