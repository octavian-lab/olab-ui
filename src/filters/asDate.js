import moment from 'moment-timezone'
const site = localStorage.getItem('site')
const utils = localStorage.getItem(`olab-ui-${site}:utils`) ? JSON.parse(localStorage.getItem(`olab-ui-${site}:utils`)) : {}
const timezone = utils.timezone
export default function (value, format = 'DD/MM/YYYY HH:mm:ss') {
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