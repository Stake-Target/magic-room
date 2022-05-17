<template>
  <div :class="$style.container">
    <div :class="$style.code">{{ code }}</div>
    <h1 :class="$style.message">{{ translates.message }}</h1>
    <ui-button to="/" border :class="$style.link">
      <span :class="$style.text">{{ $t('home') }}</span>
    </ui-button>
  </div>
</template>

<i18n lang="i18n">
  {
    "ru": {
      "404": {
        "title": "Страница не найдена",
        "description": "Страница не найдена",
        "message": "Страница не найдена"
      },
      "other": {
        "title": "Произошла ошибка",
        "description": "Произошла ошибка",
        "message": "Упс, что-то пошло не так"
      },
      "home": "На главную"
    },
    "en": {
      "404": {
        "title": "Page not found",
        "description": "Page not found",
        "message": "Page not found"
      },
      "other": {
        "title": "An error occurred",
        "description": "An error occurred",
        "message": "An error occurred"
      },
      "home": "Home page"
    }
  }
</i18n>

<script>
import UiButton from '../frontend/components/ui/button/index'

export default {
  components: {
    UiButton
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  layout: 'error',
  head () {
    return {
      title: this.translates.title,
      meta: [
        { hid: 'description', name: 'description', content: this.translates.description }
      ]
    }
  },
  computed: {
    code () {
      if (this.error.statusCode === 404) {
        return 404
      } else {
        return 500
      }
    },
    translates () {
      return (this.code === 404) ? this.$t('404') : this.$t('other')
    }
  }
}
</script>

<style lang="scss" module>
  .container {
    height: vh(100);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .code {
    font-size: 26em;
    font-weight: 500;
  }
  .message {
    margin-bottom: 2em;
    text-transform: uppercase;
  }
  .link {
    border: 1px solid var(--root-color-border);
    height: 6em;
    padding: 0 5em;
    border-radius: 3em;
    .text {
      font-size: 1.8em;
    }
  }
</style>
