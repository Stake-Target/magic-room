<template>
  <div :class="$style.account">
    <div :class="$style.balance">
      <img :class="$style.ico" src="~/assets/images/coin.png" alt="" />
      <span :class="$style.value">{{ balance | number }}</span>
    </div>
    <button :class="$style.login" @click="onSignin">
      <img src="@/assets/images/metamask-fox.svg" alt="" />
      <span>
          <template v-if="account">{{ account.address | hash(2) }}</template>
          <template v-else>Sign In</template>
        </span>
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SectionSignin',
  methods: {
    ...mapActions('account', ['signin']),
    async onSignin () {
      try {
        // this.startLoading()
        await this.signin()
      } finally {
        // setTimeout(this.stopLoading, 200)
      }
    }
  },
  computed: {
    ...mapState('account', ['account']),
    balance () {
      return this.account ? this.account.balance : 0
    }
  }
}
</script>

<style lang="scss" module>
.account {
  display: flex;
  border: 15px solid #ffd116;
  background-color: #fff;
}
.balance {
  display: flex;
  align-items: center;
  padding: 15px;
  min-width: 200px;
  flex: 1 1;
  .value {
    font-size: 20px;
    font-weight: 900;
  }
  .ico {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
.login {
  display: flex;
  align-items: center;
  border: 10px solid #e08331;
  padding: 10px 20px;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  width: 180px;
  span {
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
  }
  &:after {
    content: "";
    margin: auto 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    background-color: #eaa366;
    transform: scale(0);
    transition: transform 0.4s ease;
    z-index: 1;
  }
  &:hover {
    color: #fff;
    img {
      transform: scale(2) rotate(-4deg);
    }
    &:after {
      transform: scale(8);
    }
    span {
      transform: translate(10px, 0);
    }
  }
  img {
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    margin-right: 15px;
    z-index: 3;
    position: relative;
  }
}
</style>
