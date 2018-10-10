/**
 * Created by sojharo on 25/07/2017.
 */
import cookie from 'react-cookie'

// If login was successful, set the token in local storage
// cookie.save('token', user.token.token, {path: '/'});
// printlogs('log', cookie.load('token'));
// browserHistory.push('/dashboard')

const auth = {
  getToken () {
    return cookie.load('token')
  },

  putCookie (val) {
    cookie.save('token', val)
  },

  putUserId (val) {
    cookie.save('userid', val)
  },

  getNext () {
    return cookie.load('next')
  },

  removeNext () {
    cookie.remove('next')
  },

  logout (cb) {
    cookie.remove('userid')
    cookie.remove('token')
    redirectToLogoutAccounts()
    if (cb) cb()
  },

  loggedIn () {
    const token = cookie.load('token')
    // first check from server if this token is expired or is still valid
    if (typeof token === 'undefined' || token === '') {
      var wa = document.createElement('script')
      wa.type = 'text/javascript'
      wa.async = true
      const environment = cookie.load('environment')
      if (environment === 'staging') wa.src = 'http://Saccounts.cloudkibo.com/auth/scripts/jsonp?callback=CloudKiboAuthFunction'
      if (environment === 'production') wa.src = 'http://accounts.cloudkibo.com/auth/scripts/jsonp?callback=CloudKiboAuthFunction'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(wa, s)
    } else {
      return true
    }
  }
}

function redirectToLogoutAccounts () {
  const environment = cookie.load('environment')
  if (environment === 'staging') window.location.replace('http://Saccounts.cloudkibo.com/auth/logout?continue=http://staging.kibopush.com')
  if (environment === 'production') window.location.replace('http://accounts.cloudkibo.com/auth/logout?continue=http://app.kibopush.com')
}

function redirectToLoginAccounts () {
  const environment = cookie.load('environment')
  if (environment === 'staging') window.location.replace('http://Saccounts.cloudkibo.com/?continue=http://staging.kibopush.com')
  if (environment === 'production') window.location.replace('http://accounts.cloudkibo.com/?continue=http://app.kibopush.com')
}

// eslint-disable-next-line
function CloudKiboAuthFunction (token) {
  if (token === 'undefined') redirectToLoginAccounts()
  else {
    this.putCookie(token)
    const environment = cookie.load('environment')
    if (environment === 'staging') window.location.replace('http://staging.kibopush.com')
    if (environment === 'production') window.location.replace('http://app.kibopush.com')
  }
}

export default auth
