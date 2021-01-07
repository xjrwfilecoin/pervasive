import moment from 'moment'

export function reDate(date, format) {
    return moment(date).format(format) // "YYYY-MM-DD HH:mm:ss"
}