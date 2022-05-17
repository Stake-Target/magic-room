<template>
  <div :class="$style.loading" v-if="$spinner.counter > 0">
    <div :class="$style.spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'SectionLoading'
}
</script>

<style lang="scss" module>
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

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
