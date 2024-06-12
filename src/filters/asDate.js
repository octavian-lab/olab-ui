import moment from 'moment'

export default function (value, format = 'DD/MM/YYYY HH:mm:ss', timezone) {
  if (value) {
    const utcDate = moment.utc(value).toDate()
    if(timezone && timezone !== moment.tz.guess()) {
      // se sono faccio chiamata con fuso orario diverso da loggato devo trasformare data come se mi trovassi li
      // , quindi se faccio chiamta con +7 visualizzo -7
      return moment.tz(utcDate,timezone).format(format)
    }
    const localMoment = moment(utcDate).local()
      localMoment.format(format);
      return localMoment.format(format)
  }
  return ''
}