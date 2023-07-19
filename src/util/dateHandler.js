import moment from 'moment'
//QUANDO SI UTILIZZA MOMENT BISOGNA PRIMA FARE TUTTE LE OPERAZIONI NECESSARIE PER RICEVERE IL RISULTATO DESIDERATO E INFINE NORMALIZZARE LA DATA
//FORMATTA LA DATA NEL MODO CORRETTO PER IL BACK END
export function normalizeForRequest(date) {
  return moment(date).utc().toDate()
}

export function getMidNight(date) {
  return moment(date).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
}

export function getNow() {
  return moment()
}

export function getYesterday() {
  return moment().subtract(1, 'days')
}

export function getStartOf(date, period) {
  //PERIOD DEVE ESSERE AL SINGOLARE (es. day,month,...)
  return moment(date).startOf(period)
}

export function getEndOf(date, period) {
  // PERIOD DEVE ESSERE AL SINGOLARE (es. day,month,...)
  return moment(date).endOf(period).add(1, 'milliseconds')
}

export function addPeriod(date, amount, period) {
  //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
  if (amount < 0) {
    return moment(date).subtract(Math.abs(amount), period)
  } else {
    return moment(date).add(Math.abs(amount), period)
  }
}

export function addOrSubtract(date, operation, amount, period) {
  //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
  if (operation === '-') {
    return moment(date).subtract(+amount, period)
  } else {
    return moment(date).add(+amount, period)
  }
}

export function compareDate(date1, date2, operation) {
  switch (operation) {
    case 'equal':
      return moment(date1).isSame(moment(date2))
    case 'before':
      return moment(date1).isBefore(moment(date2))
    case 'after':
      return moment(date1).isAfter(moment(date2))
  }
}

export function difference(date1, date2, period) {
  //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
  let unitToShow = `as${period.charAt(0).toUpperCase() + period.slice(1)}`
  let diff = moment.duration(moment(date1).diff(date2))
  return diff[unitToShow]()
}
