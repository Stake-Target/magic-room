<template>
  <div :class="$style.bubbles">
    <div :class="$style.bubblesTop">
      <span v-for="i in 200" :key="i"></span>
    </div>
    <div :class="$style.bubblesLeft">
      <span v-for="i in 200" :key="i"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionBubbles'
}
</script>

<style lang="scss" module>
.bubbles {
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
}
.bubblesTop {
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
.bubblesLeft {
  position: absolute;
  top: -100vh;
  left: 5px;
  overflow: hidden;
  animation: move-top 5s infinite linear;
  span + span {
    margin-top: var(--decor-size);
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
</style>
