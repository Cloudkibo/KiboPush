export function formatAMPM (date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  return hours + ':' + minutes + ' ' + ampm
}

export function handleDate (d) {
  if (d) {
    let c = new Date(d)
    return c.toDateString() + ' ' + formatAMPM(c)
  }
}
