<template>
  <div>
    <div @click="showHelp = !showHelp" :class="$style.help">
      <template v-if="showHelp">X</template>
      <template v-else>?</template>
    </div>
    <div :class="[$style.helpWrap, {[$style.helpOpened]: showHelp}]">
      <div :class="$style.bg"></div>
      <transition :name="$style.container">
        <div :class="$style.container" v-if="showHelp">
          <div :class="$style.body">
            <h1>Start</h1>
            <h2>1) Install plugin <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Metamask</a></h2>
            <h2>2) Import <a href="#" @click.prevent="$web3.addToken()">token MGT</a> to Metamask</h2>
            <h2>2) Get <a href="https://testnet.binance.org/faucet-smart" target="_blank">BNB tokens</a></h2>
            <h2>3) Get MGT token, <a href="https://t.me/whooooop" target="_blank">write your wallet address</a> :)</h2>
            <br/>
            <br/>

            <h1>HOW TO PLAY?</h1>
            <h2>1) Sign in with a metamask</h2>
            <img style="margin-top: 10px" width="200px" src="@/assets/images/signin.jpg" alt=""/>

            <h2>2) Enter your nickname and save</h2>
            <img style="margin-top: 10px" width="300px" src="@/assets/images/name.jpg" alt=""/>

            <h2>3) Sit on the couch and pay for the ticket</h2>
            <img style="margin-top: 10px" width="300px" src="@/assets/images/sit.jpg" alt=""/>
            <div>
              <div>The cost of your ticket will be distributed in the following shares:</div>
              <ul>
                <li>1% - Fee</li>
                <li>50% - In equal shares to all who sit</li>
                <li>29% - Random seated</li>
                <li>20% - To all who remain until the end</li>
              </ul>
            </div>

            <h2>4) Sit on the couch and get MGT</h2>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 20px">
              <div>
                <img style="margin-top: 10px" width="200px" src="@/assets/images/empty.jpg" alt=""/>
                <div>Empty couch</div>
              </div>
              <div>
                <img style="margin-top: 10px" width="200px" src="@/assets/images/me.jpg" alt=""/>
                <div>In the green t-shirt is that you</div>
              </div>
              <div>
                <img style="margin-top: 10px" width="200px" src="@/assets/images/other.jpg" alt=""/>
                <div>someone else in a blue t-shirt</div>
              </div>
            </div>

            <h2>5) Important!</h2>
            <div>It’s more difficult to get on the red couch, but you won’t leave it soon either :)</div>
            <h2>6) GOOD LUCK!</h2>

            <input v-if="false" @click="copy($event.target)" value="BNB" readonly/>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import copy from '@/utils/copy'

export default {
  layout: 'page',
  name: 'SectionHelp',
  data () {
    return {
      showHelp: false
    }
  },
  methods: {
    copy ($input) {
      copy($input.value)
      const textEl = document.createElement('div')
      textEl.innerHTML = 'Copied'
      textEl.classList.add('copied')
      textEl.style.left = `${$input.offsetLeft + $input.getBoundingClientRect().width + 20}px`
      $input.parentElement.appendChild(textEl)
      setTimeout(() => {
        textEl.remove()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" module>
.helpWrap {
  &.helpOpened .bg {
    transform: scale(0.9);
    transition-delay: 0s;
  }
  .bg {
    position: fixed;
    z-index: 10;
    top: -30vw;
    right: -30vw;
    background: #fff;
    border-radius: 50%;
    width: 200vw;
    height: 200vw;
    transform: scale(0);
    transform-origin: 100% 0;
    transition: transform 1s cubic-bezier(0.25, 1.05, 0.98,-0.03);
    transition-delay: 0.3s;
  }
  .container {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    &:global(-enter-active) {
      transition: all 0.5s ease;
      transition-delay: 1s;
    }
    &:global(-leave-active) {
      transition: all 0.5s ease;
    }
    &:global(-enter),
    &:global(-leave-to) {
      opacity: 0;
      transform: translate(0, -20px);
    }
  }
  .body {
    padding: 50px;
    font-size: 16px;
    h1 {
      margin-bottom: 20px;
      font-size: 28px;
      font-weight: bold;
    }
    h2 {
      font-size: 20px;
      margin-top: 20px;
    }
    ul {
      margin-top: 20px;
      margin-left: 40px;
      li {
        margin-top: 6px;
        position: relative;
      }
    }
    a {
      color: #fd8f35;
      &:hover {
        text-decoration: underline;
      }
    }
    :global(.copied) {
      position: absolute;
      box-shadow: rgba(0, 0, 0, 0.4) 0 0 5px 0;
      border-radius: 6px;
      padding: 4px;
      background-color: #2ebf2e;
      top: -2px;
      color: #fff;
    }
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

@keyframes flash-help {
  0% {
    color: red;
  }
  50% {
    color: yellowgreen;
  }
}
</style>
