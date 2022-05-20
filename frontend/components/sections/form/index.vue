<template>
  <form :class="classes" @submit.prevent="onSubmit">
    <span :class="$style.title">Your entry price (min: {{ minValue }})</span>
    <input :class="$style.input" :min="minValue" :max="maxValue" type="number" placeholder="0" v-model="form.amount">
    <div :class="$style.errors">
      <div v-if="form.amount && +form.amount > account.balance">Insufficient fund</div>
      <div v-else-if="form.amount && form.amount < minValue">Small amount</div>
    </div>
    <button :class="$style.button" type="submit">
      <template v-if="roomIsActive">Enter to room</template>
      <template v-else>Create a new room</template>
    </button>
  </form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

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
    ...mapActions('account', ['signin', 'addApprovedTokens']),
    async onSubmit () {
      try {
        this.$spinner.start()
        if (this.account.tokenApproved < this.form.amount) {
          const approvalAmount = 10000000000000
          await this.$web3.token.approve(this.$web3.game.address, this.account.address, approvalAmount)
          this.addApprovedTokens(approvalAmount)
        }
        if (this.roomIsActive) {
          await this.$web3.game.enterToRoom(this.account.address, this.name, this.form.amount)
        } else {
          await this.$web3.game.createRoom(this.account.address, this.name, this.form.amount)
        }
        this.form.amount = ''
      } catch (e) {
        console.log(e)
      } finally {
        this.$spinner.stop()
      }
    }
  },
  computed: {
    ...mapGetters('room', ['roomIsActive']),
    ...mapGetters('account', ['name']),
    ...mapState('room', ['room']),
    ...mapState('account', ['account']),
    minValue () {
      return this.roomIsActive ? this.room.price + 1 : 1
    },
    maxValue () {
      return this.account ? this.account.balance : 0
    },
    amountValid () {
      const amount = +this.form.amount
      return amount >= this.minValue && this.maxValue >= amount
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
  border: 15px solid #ffd116;
  background-color: #fff;
  width: 500px;
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
.title {
  position: absolute;
  top: 5px;
  left: 20px;
  font-size: 13px;
  font-weight: bold;
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
  padding: 14px 20px;
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
  color: #fd8f35;
  font-size: 14px;
}
</style>
