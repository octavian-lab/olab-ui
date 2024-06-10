import moment from 'moment'

export default function (value, format = 'DD/MM/YYYY HH:mm:ss', timezone = 'Europe/Rome') {
  if (value) {
    const utcDate = moment.utc(value).toDate()
    if(timezone !== 'Europe/Rome') {
      return moment.tz(utcDate,timezone).format(format)
    }
    const localMoment = moment(utcDate).local()
      localMoment.format(format);
      return localMoment.format(format)
  }
  return ''
}