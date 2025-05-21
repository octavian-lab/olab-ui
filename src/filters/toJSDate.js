import moment from 'moment-timezone'
import dateMixins from '@/mixins/datemixin.js'
const site = localStorage.getItem('site')
export default function (value,fromLocalToTimezone = true) {
  // Messo il parse dello storage nella funzione, poichè se un utente cambia il timezone, la libreria non intercetta il comportamento
    const utils = localStorage.getItem(`olab-ui-${site}:utils`) ? JSON.parse(localStorage.getItem(`olab-ui-${site}:utils`)) : {}
    const timezone = utils.timezone

    if (!value)
        return null
    // se il timezone è diverso da quello del browser
    if (timezone && timezone !== moment.tz.guess()) {
        const parseOffsetToNumber = (offset) => {
            const ret = offset.split(':')[0]
            return +ret
        }
        //calcolo differenza di offset tra il timezone del browser e quello selezionato
        const localOffset = parseOffsetToNumber(moment(value).tz(moment.tz.guess()).format('Z'))
        const timezoneOffset = parseOffsetToNumber(moment(value).tz(timezone).format('Z'))
        const offsetDiff = localOffset - timezoneOffset
        // in base a se voglio vedere l'orario dal punto di vista locale o meno aggiungo o rimuovo le ore
        const ret = dateMixins.methods.addPeriod(value, fromLocalToTimezone ? -offsetDiff : +offsetDiff, "hours").toDate()
        return ret
    }
    return moment(value).toDate()
}