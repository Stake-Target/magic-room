<template>
  <div :class="$style.container">
    <img :class="$style.pouf" :src="pouf" alt="pouf" />
    <img :class="$style.character" v-if="character" :src="character" alt="character" />
  </div>
</template>

<script>
import priorityPouf from '~/assets/images/chair.red.png'
import defaultPouf from '~/assets/images/chair.blue.png'
import me from '~/assets/images/man.green.png'
import other from '~/assets/images/man.blue.png'

export default {
  name: 'UiPouf',
  props: {
    priority: {
      type: Boolean,
      default: false
    },
    my: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pouf () {
      return this.priority ? priorityPouf : defaultPouf
    },
    character () {
      return this.my ? me : (this.empty ? '' : other)
    }
  }
}
</script>

<style lang="scss" module>
.container {
  img {
    width: 100%;
    height: auto;
  }
}
.pouf {}
.character {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
