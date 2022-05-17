<template>
  <div>
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
export default {
  layout: 'page',
  name: 'SectionHelp',
  data () {
    return {
      showHelp: false
    }
  }
}
</script>

<style lang="scss" module>
.helpWrap {
  &.helpOpened .bg {
    transform: scale(0.9);
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
