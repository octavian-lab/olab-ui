export default function (value, currency = 'EUR', hideCurrency = false) {
  let precision
  switch (currency) {
    case 'EUR':
      precision = 2
      break
    case 'RUB':
      precision = 0
      break
    default:
      precision = 2
      break
  }

  if (value == null) return ''
  let valueDouble
  let formatter

  switch (currency) {
    case 'PTS':
      return `${value} ${currency}`
    default:
      formatter = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency
      })
      valueDouble = parseFloat(value) / Math.pow(10, precision)

      if (hideCurrency === true) return valueDouble.toFixed(precision)

      return formatter.format(valueDouble.toFixed(precision))
  }
}
