export default function (value, currency = '') {
  value = value || 0
  const space = ' '
  const number = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + space)
  return `${number}` + (currency ? ` ${currency.toUpperCase()}` : '')
}
