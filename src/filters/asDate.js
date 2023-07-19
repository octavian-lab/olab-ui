import moment from 'moment'

export default function (value, format = 'DD/MM/YYYY HH:mm:ss') {
  if (value) {
    const utcDate = moment.utc(value).toDate()
    const localMoment = moment(utcDate).local()
      localMoment.format(format);
      return localMoment.format(format)
  }
  return ''
}