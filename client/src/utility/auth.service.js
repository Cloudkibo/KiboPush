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
    const token = cookie.load('token')
    return token
  },

  putNext (val) {
    cookie.save('next', val)
  },

  getNext () {
    const token = cookie.load('next')
    return token
  },

  removeNext () {
    cookie.remove('next')
  },

  logout (cb) {
    cookie.remove('token', { path: '/' })
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn () {
    const token = cookie.load('token')
    // first check from server if this token is expired or is still valid
    if (typeof token === 'undefined' || token === '') {
      return false
    }
    return true
  },

  onChange () {}
}

export default auth
