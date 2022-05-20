<template>
  <div :class="$style.container">
    <transition :name="$style.overflow">
      <div v-if="show" :class="$style.overflow"></div>
    </transition>
    <transition :name="$style.form">
      <form v-if="show" :class="$style.form" @submit.prevent="onSubmit">
        <input :class="$style.input" maxlength="18" placeholder="Enter your nickname" v-model="form.name">
        <button :disabled="!form.name" :class="$style.button" type="submit">Set</button>
      </form>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'SectionSigninName',
  data () {
    return {
      show: false,
      form: {
        name: ''
      }
    }
  },
  methods: {
    ...mapActions('account', ['setName']),
    onSubmit () {
      if (!this.form.name) {
        return
      }
      this.setName(this.form.name)
      this.close()
    },
    open () {
      this.form.name = this.name
      this.show = true
    },
    close () {
      this.show = false
    }
  },
  computed: {
    ...mapState('account', ['account']),
    ...mapGetters('account', ['name'])
  },
  watch: {
    account (val) {
      if (val && !this.name) {
        this.open()
      }
    }
  },
  mounted() {
    this.$root.$on('change-name', this.open)
  }
}
</script>

<style lang="scss" module>
.container {}
.overflow {
  position: fixed;
  z-index: 80;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  &:global(-enter-active),
  &:global(-leave-active) {
    transition: all 0.5s ease;
  }
  &:global(-enter),
  &:global(-leave-to) {
    opacity: 0;
    backdrop-filter: blur(0);
  }
}
.form {
  z-index: 81;
  position: fixed;
  top: 50%;
  left: 50%;
  border: 15px solid #fd8f35;
  background-color: #fff;
  width: 450px;
  margin-left: -225px;
  margin-top: -40px;
  display: flex;
  &:global(-enter-active) {
    transition: transform 0.5s $transition-bounce, opacity 0.5s ease;
  }
  &:global(-leave-active) {
    transition: transform 0.5s $transition-cubic-bezier, opacity 0.5s ease;
  }
  &:global(-enter),
  &:global(-leave-to) {
    opacity: 0;
    transform: scale(0.3);
  }
}
.input {
  font-size: 20px;
  font-weight: bold;
  outline: none;
  text-indent: 20px;
  flex: 1 1;
  border: 0;
}
.button {
  border: 10px solid black;
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: bold;
  &[disabled] {
    pointer-events: none;
  }
  &:hover {
    background-color: #51ea38;
    border-color: #42b983;
    color: red;
    transform: rotate(5deg) scale(1.2);
  }
}
.errors {
  position: absolute;
  bottom: 5px;
  left: 20px;
  font-size: 14px;
}
</style>
