<template>
  <form :class="classes" @submit.prevent="onEnter">
    <input :disabled="!roomIsActive" :class="$style.input" type="number" placeholder="0" v-model="form.amount">
    <div :class="$style.errors">
      <div v-if="!roomIsActive">Room finished</div>
      <div v-else-if="form.amount && +form.amount > account.balance">Insufficient fund</div>
      <div v-else-if="form.amount && form.amount <= room.price">Small amount</div>
    </div>
    <button :class="$style.button" type="submit">Enter to room</button>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SectionForm',
  data () {
    return {
      form: {
        amount: ''
      }
    }
  },
  methods: {
    ...mapActions('account', ['signin']),
    async onEnter () {
      if (this.account.tokenApproved < this.form.amount) {
        const approvalAmount = 10000000000000
        await this.$web3.token.approve(this.$web3.game.address, this.account.address, approvalAmount)
        this.account.tokenApproved += approvalAmount
      }
      await this.$web3.game.enterToRoom(this.account.address, this.form.amount)
      this.form.amount = ''
    }
  },
  computed: {
    ...mapState('account', ['account']),
    ...mapState('room', ['room']),
    amountValid () {
      const amount = +this.form.amount
      return this.room && amount > this.room.price && this.account.balance > amount
    },
    roomIsActive () {
      return this.room && this.room.active
    },
    classes () {
      return [
        this.$style.form,
        {
          [this.$style.valid]: this.amountValid,
          [this.$style.invalid]: !this.amountValid
        }
      ]
    }
  }
}
</script>

<style lang="scss" module>
.form {
  border: 15px solid red;
  background-color: #fff;
  max-width: 450px;
  display: flex;
  &.valid {}
  &.invalid {
    .input {
      color: red;
    }
    .button {
      pointer-events: none;
    }
  }
}
.input {
  font-size: 20px;
  font-weight: bold;
  outline: none;
  text-indent: 20px;
  flex: 1 1;
}
.button {
  border: 10px solid black;
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: bold;
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
