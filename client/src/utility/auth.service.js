/**
 * Created by sojharo on 25/07/2017.
 */
import cookie from 'react-cookie';

// If login was successful, set the token in local storage
// cookie.save('token', user.token.token, {path: '/'});
// printlogs('log', cookie.load('token'));
// browserHistory.push('/dashboard')

const auth = {
  getToken() {
    var token = cookie.load('token');
    return token
  },

  logout(cb) {
    cookie.remove('token', { path: '/' });
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    var token = cookie.load('token')
    //first check from server if this token is expired or is still valid
    if(typeof token === 'undefined' || token === '') {
      //  console.log('token' + token);
      return false

    }
    else{
      // console.log('calling in loggedIn() service')
      //  console.log(token);
      return true

    }

  },

  onChange() {}
};

export default auth;
