export default function (value, currency = 'EUR', hideCurrency = false) {
  let currencyRef = currency
  if (!isNaN(parseInt(currencyRef))) {
    currencyRef = 'XXX'
  }
  if (currencyRef.length !== 3) {
    currencyRef = 'XXX'
  }

  let precision
  switch (currencyRef) {
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

  switch (currencyRef) {
    case 'PTS':
      return `${value} ${currencyRef}`
    default:
      formatter = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currencyRef
      })
      valueDouble = parseFloat(value) / Math.pow(10, precision)

      if (hideCurrency === true) return valueDouble.toFixed(precision)

      return formatter.format(valueDouble.toFixed(precision))
  }
}
