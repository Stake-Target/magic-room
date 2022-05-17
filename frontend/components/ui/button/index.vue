<template>
  <a @click="onClick" :class="classes" v-if="href" :href="href" rel="noopener" target="_blank">
    <span :class="$style.text"><slot /></span>
  </a>

  <router-link @click.native="onClick" :class="classes" v-else-if="to" :to="routeTo">
    <span :class="$style.text"><slot /></span>
  </router-link>

  <component @click="onClick" :is="tag" :class="classes" v-else>
    <span :class="$style.text"><slot /></span>
  </component>
</template>

<script>
  export default {
    name: 'UiButton',
    props: {
      href: {
        type: String,
        default: ''
      },
      to: {
        type: String,
        default: ''
      },
      tag: {
        type: String,
        default: 'button'
      },
      circle: {
        type: Boolean,
        default: false
      },
      fill: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      theme: {
        type: String,
        default: '',
        validator (value) {
          return ['border3d', ''].includes(value)
        }
      }
    },
    methods: {
      onClick (event) {
        if (!this.disabled && !this.loading) {
          this.$emit('click', event)
        }
      }
    },
    computed: {
      classes () {
        return [
          this.$style.button,
          { [this.$style.fill]: this.fill },
          { [this.$style.circle]: this.circle },
          { [this.$style.disabled]: this.disabled || this.loading },
          { [this.$style.loading]: this.loading },
          { [this.$style[this.theme]]: this.theme }
        ]
      },
      routeTo () {
        return this.$i18n.createPath(this.to)
      }
    }
  }
</script>

<style lang="scss" module>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: all $transition-duration;
    position: relative;
    user-select: none;
  }
  .border3d {
    border: 2px solid currentColor;
    .text {
      &:after {
        content: "";
        position: absolute;
        top: -5px;
        left: -5px;
        right: -8px;
        bottom: -8px;
        transition: all $transition-duration;
      }
    }
    &:before, &:after {
      position: absolute;
      content: "";
      background-color: currentColor;
      transition: all $transition-duration;
    }
    &:before {
      bottom: -8px;
      height: 6px;
      left: 1px;
      right: -5px;
      transform: skewX(45deg);
    }
    &:after {
      right: -8px;
      width: 6px;
      top: 1px;
      bottom: -5px;
      transform: skewY(45deg);
    }
    &:global(.nuxt-link-exact-active),
    &:hover {
      transform: translate(6px, 6px);
      .text {
        &:after {
          transform: translate(-6px, -6px);
        }
      }
      &:before {
        height: 0;
        bottom: 0;
        right: 0;
      }
      &:after {
        width: 0;
        right: 0;
        bottom: 0;
      }
    }
    &:global(.nuxt-link-exact-active) {
      color: var(--root-color-accent);
    }
  }
  .disabled {
    pointer-events: none;
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
