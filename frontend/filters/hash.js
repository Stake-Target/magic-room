export default function (value, start = 10, end = 5, length = 20) {
  const str = value.toString()
  const _max = Math.min(length, str.length)
  const _end = Math.min(_max - end, 5)
  const tail = str.slice(_end * -1)
  return str.slice(0, start) + '...' + tail
}
