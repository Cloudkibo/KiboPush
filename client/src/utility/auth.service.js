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
    console.log('THE LOGOUT IS BEING CALLED')
    redirectToLogoutAccounts()
    if (cb) cb()
  },

  loggedIn () {
    const token = cookie.load('token')
    // first check from server if this token is expired or is still valid
    return !(typeof token === 'undefined' || token === '')
  }
}

function redirectToLogoutAccounts () {
  const environment = cookie.load('environment') || process.env.NODE_ENV
  console.log('process.env', process.env)
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  console.log('environment', environment)
  if (environment === 'staging' || window.location.href.includes('skibo')) {
    window.location.replace('https://saccounts.cloudkibo.com/auth/logout?continue=http://staging.kibopush.com')
  } else {
    window.location.replace('https://accounts.cloudkibo.com/auth/logout?continue=http://app.kibopush.com')
  }
}

export default auth
