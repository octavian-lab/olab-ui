const site = localStorage.getItem('site')
// store del sito
let currencies = []
if(localStorage.getItem(`octavianlab-${site}-admin`)) {
  const projectStore = JSON.parse(localStorage.getItem(`octavianlab-${site}-admin`))
  currencies = projectStore.currency?.list || []
}
export default function (value, currency = 'EUR', hideCurrency = false) {
  let currencyRef = currency
  if (!isNaN(parseInt(currencyRef))) {
    currencyRef = 'XXX'
  }
  if (currencyRef.length !== 3) {
    currencyRef = 'XXX'
  }
  let precision
  if (currencies.length > 0) {
    const currencyObj = currencies.find((el) => el.id === currencyRef)
    precision = currencyObj ? currencyObj.precision || currencyObj.valuePrecision || currencyObj.fractions : 'EUR'
  } else {
    precision = 2
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
