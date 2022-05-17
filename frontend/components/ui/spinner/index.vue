<template>
  <component :is="tag" :class="$style.spinner" :style="{width: size + 'em', height: size + 'em'}"></component>
</template>

<script>
export default {
  name: 'UiSpinner',
  props: {
    theme: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    },
    size: {
      type: [String, Number],
      default: '4'
    }
  }
}
</script>

<style lang="scss" module>
.spinner,
.spinner::after {
  border-radius: 50%;
}

.spinner {
  display: inline-block;
  position: relative;
  overflow: hidden;
  border-left: 0.2em solid transparent;
  transform: translateZ(0);
  animation: spinner 1.1s infinite linear;
  &::after {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}

.spinner {
  border-top: 0.2em solid #fff;
  border-right: 0.2em solid #fff;
  border-bottom: 0.2em solid #fff;
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
