import VueI18n from 'vue-i18n'

VueI18n.prototype.getChoiceIndex = function getChoiceIndex (choice, choicesLength) {
  if (this.locale !== 'ru') {
    return choiceRU(choice, choicesLength)
  } else {
    return choiceEN(choice, choicesLength)
  }
}

function choiceRU (choice, choicesLength) {
  choice = Math.abs(choice)
  return choice ? Math.min(choice, 2) : 0
}

function choiceEN (choice, choicesLength) {
  if (choice.toString().includes('.')) {
    return 1
  } else if (!choice) {
    return 2
  } else if (choice % 10 === 1 && choice % 100 !== 11) {
    return 0
  } else if (choice % 10 >= 2 && choice % 10 <= 4 && (choice % 100 < 10 || choice % 100 >= 20)) {
    return 1
  } else {
    return 2
  }
}

VueI18n.prototype.createPath = function (path, locale) {
  let result = ''
  locale = locale || this.locale
  path = path.replace(`/${this.locale}`, '').replace(/^\//, '')

  if (locale === this.defaultLocale) {
    result = path
  } else {
    result = `${locale}/${path}`
  }

  result = result
    .replace(/\/$/, '')
    .replace(/\/#/, '#')
    .replace(/\/\?/, '?')

  return '/' + result
}
