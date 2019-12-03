import cookie from 'react-cookie'

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
export function getMetaUrls (text) {
  /* eslint-disable */
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  /* eslint-enable */
  var testUrl = text.match(urlRegex)
  return testUrl
}
export function formatDateTime (x) {
  var today = new Date()
  var n = new Date(x)
  var days = ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT']
  var month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  var s = ''
  if (today.getFullYear() === n.getFullYear()) {
    if (today.getMonth() === n.getMonth()) {
      if (today.getDay() === n.getDay()) {
        s = formatAMPM(n)
      } else {
        s = days[n.getDay()] + ', ' + formatAMPM(n)
      }
    } else {
      s = month[n.getMonth()] + ' ' + n.getDate() + 'TH, ' + formatAMPM(n)
    }
  } else {
    s = (n.getMonth() + 1) + '/' + n.getDate() + '/' + n.getFullYear() + ' ' + formatAMPM(n)
  }

  return s
}

export function getCurrentProduct () {
  const hostname = window.location.hostname
  if (hostname.includes('kiboengage.cloudkibo.com') || window.location.port.includes('3021')) {
    console.log('KiboEngage')
    return 'KiboEngage'
  } else if (hostname.includes('kibochat.cloudkibo.com') || window.location.port.includes('3022')) {
    console.log('KiboChat')
    return 'KiboChat'
  }
}

export function isWebURL (value) {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  return regexp.test(value)
}

export function getHostName (url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2]
  } else {
    return null
  }
}

export function isWebViewUrl (value) {
  let regexp = /^(http|https):///
  return regexp.test(value)
}
export function isFacebookPageUrl (value) {
  /* contains facebook url followed by alphabets, numerals or dot */
  let regexp = /^(https?:\/\/)?(www\.)?facebook.com\/(?!\/)[.a-zA-Z0-9/]*/g
  return regexp.test(value)
}
export function isTwitterUrl (value) {
  /* contains twitter url followed by alphabets, numerals or underscore */
  let regexp = /^(https?:\/\/)?(www\.)?twitter.com\/(?!\/)[_a-zA-Z0-9/]*/g
  return regexp.test(value)
}

export function isRssUrl(value) {
  let regexp = /(feed|rss)/
  return regexp.test(value)
}
export function testUserName (userName) {
  if (userName.length < 1) {
    return false
  }
  /* must not end with .com or .net */
  let regexp = /^(?!.*[.]com$)(?!.*[.]net$).*$/
  return regexp.test(userName)
}
export function doesPageHaveSubscribers (pages, pageId) {
  console.log('doesPageHaveSubscribers pages', pages)
  console.log('doesPageHaveSubscribers pageId', pageId)
  if (pages && pageId[0]) {
    let result = pages.find(page => {
      return page.pageId === pageId[0]
    })
    console.log('doesPageHaveSubscribers result', result)
    if (result) {
      return result.subscribers > 0
    }
  }
  return true
}
export function getAccountsUrl () {
  var url = 'http://localhost:3024'
  const hostname = window.location.hostname

  if (['skiboengage.cloudkibo.com', 'skibochat.cloudkibo.com', 'skibolite.cloudkibo.com'].indexOf(hostname) > -1) {
    url = 'https://saccounts.cloudkibo.com'
  } else if (['kiboengage.cloudkibo.com', 'kibochat.cloudkibo.com', 'kibolite.cloudkibo.com'].indexOf(hostname) > -1) {
    url = 'https://accounts.cloudkibo.com'
  }
  return url
}

export function readShopifyInstallRequest () {
  return cookie.load('installByShopifyStore')
}

export function removeShopifyInstallRequest () {
  cookie.remove('installByShopifyStore')
}

export function setWebViewUrl(url){
  let newUrl = isWebViewUrl(url) ? url : `http://${url}`
  return newUrl
}

export function getVideoId (url) {
  /* eslint-disable */
  let r, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
  /* eslint-enable */
  r = url.match(rx)
  return r ? r[1] : false
}
