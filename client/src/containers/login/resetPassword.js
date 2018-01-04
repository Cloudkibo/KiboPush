/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { log } from './../../utility/socketio'
import { isWebURL } from './../../utility/utils'
import { forgotPass } from '../../redux/actions/login.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const TAG = 'containers/login/login'
class ResetPassword extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domain: false,
      isurl: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.check = this.check.bind(this)
  }
  check () {
    this.setState({domain: true})
    if (isWebURL(this.refs.domain.value)) {
      this.setState({isurl: true})
    }
  }
  componentDidMount () {
    log(TAG, 'Login Container Mounted')
  }
  onSubmit (event) {
    event.preventDefault()
    this.props.forgotPass({email: this.refs.email.value, domain: this.refs.domain.value})
  }
  render () {
    console.log('In Login JS')
    return (
      <div style={{height: 100 + 'vh'}}>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#'>
                      <img src='img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  <div className='m-login__signin'>
                    <div className='m-login__head'>
                      <h3 className='m-login__title'>Forgot Password ?</h3>
                    </div>
                    <form onSubmit={this.onSubmit} className='m-login__form m-form'>
                      <label style={{fontWeight: 'normal'}}>
                        Please enter the details below. We'll send you an email with a link to reset your password.
                      </label>
                      <br /><br />
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='text' placeholder='Domain e.g www.kibopush.com' ref='domain' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} onChange={this.check} />
                        { this.state.domain && this.state.isurl === false &&
                        <div id='email-error' style={{color: 'red'}}>Please enter a valid domain</div>
                         }
                      </div>
                      <div className='form-group m-form__group'>
                        <input className='form-control m-input' type='email' placeholder='Email' ref='email' required style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }} />
                      </div>
                      <div className='m-login__form-action'>
                        <button type='submit' id='m_login_signup_submit' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air'>
                          Submit
                        </button>
                        <Link id='m_login_signup_cancel' href='/' className='btn btn-outline-focus  m-btn m-btn--pill m-btn--custom'>
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>
                <div className='m-login__account'>
                  <span className='m-login__account-msg'>Want to learn more about KiboPush ?</span>&nbsp;&nbsp;
                  <a href='http://kibopush.com/faq/' id='m_login_signup' target='_blank' className='m-link m-link--focus m-login__account-link'>Visit FAQ page</a>
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
            <div className='m-grid__item m-grid__item--middle'>
              <h3 className='m-login__welcome'>Join KiboPush</h3>
              <p className='m-login__msg'>Get connected with your facebook audience through push messages.
              Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    forgotPass: forgotPass
  },
    dispatch)
}
export default connect(null, mapDispatchToProps)(ResetPassword)
