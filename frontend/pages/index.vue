<template>
  <div :class="$style.app">
    <div :class="$style.decor">
      <div :class="$style.decorTop">
        <span v-for="i in 200" :key="i"></span>
      </div>
      <div :class="$style.decorLeft">
        <span v-for="i in 200" :key="i"></span>
      </div>
    </div>

    <div :class="accountClasses">
      <div :class="$style.balance">
        <img :class="$style.ico" src="~/assets/images/coin.png" />
        <span :class="$style.value">{{ account.balance | number }}</span>
      </div>
      <button :class="$style.login" @click="onSignin">
        <img src="@/frontend/assets/images/metamask-fox.svg" />
        <span>
          <template v-if="autorized">{{ account.address | hash(2) }}</template>
          <template v-else>Sign In</template>
        </span>
      </button>
    </div>

    <div :class="$style.logs">
      <div :class="$style.head"></div>
      <div :class="$style.title">Events</div>
      <div :class="$style.data">
        <div v-for="event in events" :key="event.id">
          <div :class="$style.event" v-if="event.event === 'Vip'">
            <div :class="$style.icon">👟</div>
            <div :class="$style.step">{{ event.data.step }}</div>
            <div :class="$style.icon">🏵</div>
            <div :class="$style.name">Vip</div>
            <div :class="$style.address">{{ event.data.chair | address(account.address) }}</div>
            <div :class="$style.value">
              <img :class="$style.coin" src="~/assets/images/coin.png" />
              {{ event.data.value }}
            </div>
          </div>
          <div :class="$style.event" v-else-if="event.event === 'Reward'">
            <div :class="$style.icon">👟</div>
            <div :class="$style.step">{{ event.data.step }}</div>
            <div :class="$style.icon">🏅</div>
            <div :class="$style.name">Reward</div>
            <div :class="$style.address">{{ event.data.chair | address(account.address) }}</div>
            <div :class="$style.value">
              <img :class="$style.coin" src="~/assets/images/coin.png" />
              {{ event.data.value }}
            </div>
          </div>
          <div :class="$style.event" v-else-if="event.event === 'ChangeChair'">
            <div :class="$style.icon">👟</div>
            <div :class="$style.step">{{ event.data.step }}</div>
            <div :class="$style.icon">♻️</div>
            <div :class="$style.name">Drop</div>
            <div :class="$style.address">{{ event.data.enter | address(account.address) }}</div>
            <div :class="$style.icon">🧹</div>
            <div :class="$style.address">{{ event.data.leave | address(account.address) }}</div>
            <div :class="$style.value">
              <img :class="$style.coin" src="~/assets/images/coin.png" />
              {{ event.data.price }}
            </div>
          </div>
          <div :class="$style.event" v-else>
            🏆 {{ event }}
          </div>
        </div>
      </div>
    </div>

    <form :class="formClasses" @submit.prevent="onEnter">
      <input :disabled="!roomIsActive" :class="$style.input" type="number" placeholder="0" v-model="form.amount">
      <div :class="$style.errors">
        <div v-if="!roomIsActive">Room finished</div>
        <div v-else-if="form.amount && +form.amount > account.balance">Insufficient funds {{ form.amount }} > {{ account.balance }} {{ form.amount > account.balance }}</div>
        <div v-else-if="form.amount && form.amount <= room.price">Small amount</div>
      </div>
      <button :class="$style.button" type="submit">Enter to room</button>
    </form>

    <div :class="[$style.roomInfo, {[$style.moved]: autorized}]" v-if="room">
      <div :class="$style.item">
        <div :class="$style.value">
          <span>{{ room.step | number }}/165</span>
        </div>
        <div :class="$style.title">Step</div>
      </div>
      <div :class="$style.item">
        <div :class="$style.value">
          <img :class="$style.coin" src="~/assets/images/coin.png" />
          <span>{{ room.price | number }}</span>
        </div>
        <div :class="$style.title">Ticket price</div>
      </div>
      <div :class="$style.item">
        <div :class="$style.value">
          <img :class="$style.coin" src="~/assets/images/coin.png" />
          <span>{{ room.bank | number }}</span>
        </div>
        <div :class="$style.title">Bank</div>
      </div>
    </div>
    <div v-if="account.owner" :class="$style.system">
      <button :class="$style.btn" v-if="!room || !room.active" @click="onCreateRoom"><span>Create room</span></button>
      <button :class="$style.btn" v-if="room && room.active" @click="onFinishRoom"><span>Finish room</span></button>
    </div>
    <div v-if="room" :class="$style.room">
      <div :class="$style.chair" v-for="(chair, i) in room.chairs" :key="i">
        <img v-if="chair !== '0x0000000000000000000000000000000000000000'" src="~/assets/images/chair.full.png" />
      </div>
    </div>

    <div :class="$style.loading" v-if="loaders > 0">
      <div :class="$style.spinner"></div>
    </div>

    <div @click="showHelp = !showHelp" :class="$style.help">
      <template v-if="showHelp">X</template>
      <template v-else>?</template>
    </div>
    <div :class="[$style.helpWrap, {[$style.helpOpened]: showHelp}]">
      <div :class="$style.bg"></div>
      <div :class="$style.container"></div>
    </div>
  </div>
</template>

<script>
import { TokenContract, GameContract } from '../plugins/web3/contracts.js'

export default {
  data () {
    return {
      tokenContract: null,
      gameContract: null,
      account: {
        owner: false,
        address: '',
        tokenApproved: 0,
        balance: 0
      },
      form: {
        amount: ''
      },
      room: null,
      loaders: 0,
      showHelp: false,
      events: []
    }
  },
  layout: 'page',
  name: 'GameMagicRoomPage',
  methods: {
    startLoading () {
      this.loaders++
    },
    stopLoading () {
      this.loaders--
    },
    async onSignin () {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      await this.initAccount(accounts[0])
    },
    async initAccount (address) {
      this.startLoading()
      this.account.address = address
      this.account.balance = await this.tokenContract.getBalance(address)
      this.account.tokenApproved = await this.tokenContract.allowance(address)
      this.account.owner = await this.gameContract.isOwner(address)
      setTimeout(this.stopLoading, 200)
    },
    async initGame () {
      this.room = await this.gameContract.getCurrentRoom()
      this.gameContract.watch(this.newEvent)
    },
    async onCreateRoom () {
      await this.gameContract.createRoom(this.account.address)
      await this.initGame()
    },
    async onFinishRoom () {
      await this.gameContract.finishRoom(this.account.address)
    },
    async onEnter () {
      if (this.account.tokenApproved < this.form.amount) {
        const approvalAmount = 1000000000
        await this.tokenContract.approve(this.account.address, approvalAmount)
        this.account.tokenApproved += approvalAmount
      }
      await this.gameContract.enterToRoom(this.account.address, this.form.amount)
      this.form.amount = ''
    },
    newEvent (data) {
      if (data.event === 'ChangeChair') {
        this.room.bank = data.data.bank
        this.room.step = data.data.step
        this.room.price = data.data.price
      }
      this.events.unshift(data)
    }
  },
  filters: {
    address (address, myAddress) {
      if (myAddress.toUpperCase() === address.toUpperCase()) {
        return 'This account'
      } else {
        const _max = Math.min(20, address.length)
        const _end = Math.min(_max - 5, 5)
        const tail = address.slice(_end * -1)
        return address.slice(0, 2) + '...' + tail
      }
    }
  },
  computed: {
    autorized () {
      return this.account.address
    },
    amountValid () {
      const amount = +this.form.amount
      return this.room && this.form.amount > this.room.price && this.account.balance > this.form.amount
    },
    roomIsActive () {
      return this.room && this.room.active
    },
    accountClasses () {
      return [
        this.$style.account,
        {
          [this.$style.logined]: this.autorized
        }
      ]
    },
    formClasses () {
      return [
        this.$style.form,
        {
          [this.$style.show]: this.autorized,
          [this.$style.valid]: this.amountValid,
          [this.$style.invalid]: !this.amountValid
        }
      ]
    }
  },
  mounted () {
    this.tokenContract = new TokenContract()
    this.gameContract = new GameContract()

    window.ethereum.on('accountsChanged', (accounts) => {
      this.initAccount(accounts[0])
    })

    this.initGame()
  }
}
</script>

<style lang="scss" module>
.app {
  font-family: "Comic Sans MS";
  min-height: 100vh;
  background-color: rgba(248, 142, 82, 0.94);
  position: relative;
  --decor-size: 30px;
}
.decor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  color: #eac230;
  span {
    display: block;
    width: var(--decor-size);
    height: var(--decor-size);
    border-radius: 50%;
    background-color: currentColor;
    animation: flash-color 2s infinite linear;
    @for $i from 1 through 200 {
      &:nth-child(#{$i}) {
        animation-delay: 50ms * $i;
      }
    }
  }
  .decorTop {
    position: absolute;
    top: 5px;
    left: 5px;
    bottom: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: row-reverse;
    animation: move-right 5s infinite linear;
    span + span {
      margin-left: var(--decor-size);
    }
  }
  .decorLeft {
    position: absolute;
    top: -100vh;
    left: 5px;
    overflow: hidden;
    animation: move-top 5s infinite linear;
    span + span {
      margin-top: var(--decor-size);
    }
  }
}

.account {
  position: fixed;
  z-index: 2;
  display: flex;
  top: 70px;
  width: 30%;
  right: calc(100% - 30% - 10%);
  border: 15px solid #ffd116;
  background-color: #fff;
  transition: right 0.6s $transition-bounce;
  transition-delay: 100ms;
  &.logined {
    right: 10%;
    .login {
      pointer-events: none;
    }
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
}
.form {
  border: 15px solid red;
  background-color: #fff;
  max-width: 450px;
  display: flex;
  position: fixed;
  bottom: 20px;
  left: 10%;
  transition: transform 0.6s $transition-bounce;
  transform: translate(-200%, 0);
  &.show {
    transform: translate(0, 0);
  }
  &.valid {}
  &.invalid {
    .input {
      color: red;
    }
    .button {
      pointer-events: none;
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
}
.logs {
  z-index: 2;
  transform: rotate(3deg);
  position: fixed;
  border: 10px solid #000;
  top: 30%;
  right: 5%;
  width: 500px;
  background: #fff;
  .head {
    margin: 20px;
    border-top: 40px dotted #e08331;
  }
  .data {
    padding: 20px;
    overflow: auto;
    height: 40vh;
  }
  .title {
    text-transform: uppercase;
    font-size: 24px;
    margin-left: 20px;
  }
  .event {
    display: flex;
    font-size: 16px;
    padding: 5px 0;
    .icon {}
    .name {
      font-weight: bold;
      width: 70px;
      margin-left: 5px;
    }
    .step {
      width: 40px;
    }
    .value {
      display: flex;
      align-items: center;
      margin-left: 5px;
    }
    .coin {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    .address {
      margin: 0 5px;
    }
  }
}
.roomInfo {
  position: fixed;
  z-index: 2;
  top: 80%;
  left: 5%;
  display: flex;
  align-items: center;
  transition: top 0.6s $transition-bounce;
  transition-delay: 50ms;

  &.moved {
    top: 10%;
  }

  .item {
    padding: 20px;
    font-weight: bold;
    &:nth-child(1) {
      transform: rotate(2deg);
    }
    &:nth-child(2) {
      transform: rotate(-4deg);
    }
    &:nth-child(3) {
      transform: rotate(4deg);
    }
  }
  .title {
    font-size: 16px;
    text-transform: uppercase;
    margin-top: 10px;
  }
  .value {
    display: flex;
    align-items: center;
    font-size: 24px;
  }
  .coin {
    width: 26px;
    height: 26px;
    margin-right: 8px;
  }
}

.helpWrap {
  &.helpOpened .bg {
    transform: scale(0.9);
  }
  .bg {
    position: fixed;
    top: -30vw;
    right: -30vw;
    background: #fff;
    border-radius: 50%;
    width: 200vw;
    height: 200vw;
    transform: scale(0);
    transform-origin: 100% 0;
    transition: transform 1s cubic-bezier(0.25, 1.05, 0.98,-0.03);
  }
}
.help {
  z-index: 50;
  position: fixed;
  top: 50px;
  right: 50px;
  font-size: 80px;
  font-weight: bold;
  animation: flash-help 1s infinite linear;
  cursor: pointer;
  user-select: none;
}

.loading {
  position: fixed;
  bottom: 20px;
  right: 20px;
  .spinner,
  .spinner::after {
    border-radius: 50%;
  }
  .spinner {
    display: inline-block;
    position: relative;
    overflow: hidden;
    border-left: 10px solid transparent;
    transform: translateZ(0);
    animation: spinner .5s infinite linear;
    width: 60px;
    height: 60px;
    &::after {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
  .spinner {
    border-top: 10px solid #fff;
    border-right: 10px solid #fff;
    border-bottom: 10px solid #fff;
  }
}
.room {
  position: fixed;
  top: 15%;
  left: 5%;
  width: 100vh;
  bottom: 20%;
  .chair {
    position: absolute;
    width: 18%;
    &:nth-child(1) {
      top: 10%;
      left: 0;
    }
    &:nth-child(2) {
      top: 8%;
      left: 24%;
      transform: rotate(10deg);
    }
    &:nth-child(3) {
      top: 0;
      left: 48%;
    }
    &:nth-child(4) {
      top: -2%;
      left: 72%;
      transform: rotate(-10deg);
    }

    &:nth-child(5) {
      top: 42%;
      left: 5%;
    }
    &:nth-child(6) {
      top: 39%;
      left: 34%;
    }
    &:nth-child(7) {
      top: 35%;
      left: 56%;
      transform: rotate(8deg);
    }

    &:nth-child(8) {
      top: 74%;
      left: 2%;
      transform: rotate(6deg);
    }
    &:nth-child(9) {
      top: 72%;
      left: 28%;
      transform: rotate(-5deg);
    }
    &:nth-child(10) {
      top: 75%;
      left: 60%;
    }
    img {
      width: 100%;
    }
  }
}
.btn {
  text-align: center;
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
  background-color: #fff;
  span {
    width: 150px;
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
    transform: rotate(5deg) scale(1.4);
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
.system {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 40px;
  left: 45%;
  .btn + .btn {
    margin-left: 40px;
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes move-right {
  from {
    transform: translate(-100vh, 0);
  }
  to {
    transform: translate(0, 0);
  }
}
@keyframes move-top {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(0, -100vh);
  }
}
@keyframes flash-color {
  0% {
    color: #eac230;
  }
  50% {
    color: crimson;
  }
}
@keyframes flash-help {
  0% {
    color: red;
  }
  50% {
    color: yellowgreen;
  }
}

</style>
