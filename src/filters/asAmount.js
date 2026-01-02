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

  if (value == null) return ''

  const currencyList = Array.isArray(currencies) ? currencies : []
  const currencyObj = currencyList.find((el) => el.id === currencyRef)
  const precisionValue =
    currencyObj != null
      ? currencyObj.precision || currencyObj.valuePrecision || currencyObj.fractions
      : undefined
  const precision = Number.isFinite(Number(precisionValue)) ? Number(precisionValue) : 2

  if (currencyRef === 'PTS') return `${value} ${currencyRef}`

  const valueDouble = parseFloat(value) / Math.pow(10, precision)
  const formatterOptions = {
    useGrouping: true,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }

  if (!hideCurrency) {
    formatterOptions.style = 'currency'
    formatterOptions.currency = currencyRef
  }

  const formatter = new Intl.NumberFormat('it-IT', formatterOptions)

  return formatter.format(valueDouble)
}
