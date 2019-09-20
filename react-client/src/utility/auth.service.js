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

  putActingAsUser (val) {
    cookie.save('actingAsUser', val)
  },

  removeActingAsUser () {
    cookie.remove('actingAsUser')
  },

  getActingAsUser () {
    return cookie.load('actingAsUser')
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
    cookie.remove('actingAsUser')
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
  let redirectUrls = {
    'skiboengage': 'https://saccounts.cloudkibo.com/auth/logout?continue=https://skiboengage.cloudkibo.com',
    'skibochat': 'https://saccounts.cloudkibo.com/auth/logout?continue=https://skibochat.cloudkibo.com',
    'skibolite': 'https://saccounts.cloudkibo.com/auth/logout?continue=https://skibolite.cloudkibo.com',
    'staging': 'https://saccounts.cloudkibo.com/auth/logout?continue=https://staging.kibopush.com',
    'kiboengage': 'https://accounts.cloudkibo.com/auth/logout?continue=https://kiboengage.cloudkibo.com',
    'kibochat': 'https://accounts.cloudkibo.com/auth/logout?continue=https://kibochat.cloudkibo.com',
    'kibolite': 'https://accounts.cloudkibo.com/auth/logout?continue=https://kibolite.cloudkibo.com',
    'app': 'https://accounts.cloudkibo.com/auth/logout?continue=https://app.kibopush.com',
    'localhost': 'http://localhost:3024/auth/logout?continue=http://localhost:3000'
  }
  let products = Object.keys(redirectUrls)
  for (let i = 0; i < products.length; i++) {
    if (window.location.href.includes(products[i])) {
      window.location.replace(redirectUrls[products[i]])
      break
    }
  }
}

export default auth
