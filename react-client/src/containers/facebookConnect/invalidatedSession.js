/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import auth from '../../utility/auth.service'
import { skip } from '../../redux/actions/signup.actions'
import $ from 'jquery'

class InvalidatedSession extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.profilePicError = this.profilePicError.bind(this)
  }
  UNSAFE_componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in connect', nextProps)
    if (nextProps.user && nextProps.user.role !== 'buyer') {
      this.props.history.push({
        pathname: '/dashboard'
      })
    } else if (nextProps.successSkip && nextProps.user && nextProps.user.skippedFacebookConnect) {
      this.props.history.push({
        pathname: '/dashboard'
      })
    }
  }
  componentDidMount () {
    /* eslint-disable */
     $('#sidebarDiv').addClass('hideSideBar')
     $('#headerDiv').addClass('hideHeader')
     /* eslint-enable */
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Facebook Connect`
  }
  profilePicError (e) {
    e.target.src = 'https://cdn.cloudkibo.com/public/icons/users.jpg'
  }
  render () {
    return (
      <div style={{height: 100 + 'vh'}}>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{height: 100 + 'vh'}}>
          <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside'>
            <div className='m-stack m-stack--hor m-stack--desktop'>
              <div className='m-stack__item m-stack__item--fluid'>
                <div className='m-login__wrapper'>
                  <div className='m-login__logo'>
                    <a href='#/'>
                      <img alt='' src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                    </a>
                  </div>
                  {
                    this.props.location.state.role === 'buyer'
                    ? <div className='m-login__signin'>
                      <div className='m-login__head'>
                        <h3 className='m-login__title'>Re-Connect your Facebook account</h3>
                      </div>
                      <div>
                        <span>Your Facebook session has been invalidated. Please re-connect your Facebook account.</span>
                      </div>
                    </div>
                    : <div className='m-login__signin'>
                      <div className='m-login__head'>
                        <h3 className='m-login__title'>Re-Connect your Facebook account</h3>
                      </div>
                      <br />
                      <div>
                        <span>Your Facebook session has been invalidated. Please ask your buyer to connect his/her Facebook Account again.</span>
                        <br /><br /><br />
                        <label>Buyer Information:</label>
                        <br /><br />
                        <div className='m-widget5'>
                          <div className='m-widget5__item'>
                            <div className='m-widget5__pic' style={{width: '5px'}}>
                              <img className='m-widget7__img' onError={this.profilePicError} alt='pic' src={this.props.location.state.buyerInfo.profilePic !== '' ? this.props.location.state.buyerInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg' } style={{height: '50px', borderRadius: '50%', width: '50px'}} />
                            </div>
                            <div className='m-widget5__content'>
                              <h4 className='m-widget5__title'>
                                {this.props.location.state.buyerInfo.buyerName}
                              </h4>
                              <span className='m-widget5__desc'>
                                <b>Email:</b> {this.props.location.state.buyerInfo.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {this.props.location.state.role === 'buyer' &&
                    <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                      <a href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                        <span>
                          <i className='la la-power-off' />
                          <span>Re-connect Facebook</span>
                        </span>
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg')"}}>
            <div className='m-grid__item m-grid__item--middle'>
              <Link to='/signup' className='m-login__welcome'>Join KiboPush</Link>
              <p className='m-login__msg'>Get connected with your facebook audience through push messages.
                Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    successSkip: (state.signupInfo.successSkip),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    skip: skip
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InvalidatedSession)
