<template>
  <div :class="$style.container">
    <div :class="$style.sound" @click="setMute(!mute)">
      <span v-if="mute"></span>
      <img src="@/assets/images/sound.svg" alt="" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Howl } from 'howler'
import ticketSoundSource from '@/assets/ticket.mp3'

export default {
  name: 'SectionControls',
  computed: {
    ...mapState('app', ['mute'])
  },
  methods: {
    ...mapMutations('app', ['setMute']),
    playSound () {
      if (!this.mute) {
        const sound = new Howl({ src: ticketSoundSource, volume: 1, autoplay: true })
      }
    }
  },
  mounted () {
    this.$web3.game.addUpdateListener(() => this.playSound())
  }
}
</script>

<style lang="scss" module>
.container {}
.sound {
  cursor: pointer;
  position: relative;
  transition: transform 0.3s $transition-bounce;
  &:hover {
    transform: scale(1.3);
  }
  span {
    position: absolute;
    transform: rotate(55deg);
    width: 120%;
    height: 8px;
    top: 25px;
    left: -5px;
    background-color: red;
  }
  img {
    display: block;
    width: 60px;
    height: auto;
  }
}
</style>
