import moment from 'moment-timezone'
const site = localStorage.getItem('site')
export default function (value, format = 'DD/MM/YYYY HH:mm:ss') {
  // Messo il parse dello storage nella funzione, poichè se un utente cambia il timezone, la libreria non intercetta il comportamento
  const utils = localStorage.getItem(`olab-ui-${site}:utils`) ? JSON.parse(localStorage.getItem(`olab-ui-${site}:utils`)) : {}
  const timezone = utils.timezone
  if (value) {
    const utcDate = moment.utc(value).toDate()
    if (timezone && timezone !== moment.tz.guess()) {
      const ret = moment.tz(utcDate, timezone).format(format);
      return ret
    }
    const localMoment = moment(utcDate).local()
      localMoment.format(format);
      return localMoment.format(format)
  }
  return ''
}