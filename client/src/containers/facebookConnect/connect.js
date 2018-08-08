/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import auth from '../../utility/auth.service'
import $ from 'jquery'
import { skip } from '../../redux/actions/signup.actions'

class Connect extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.skip = this.skip.bind(this)
  }
  componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }
  componentWillReceiveProps (nextProps) {
    console.log('nextProps in connect', nextProps)
    if (nextProps.successSkip) {
      browserHistory.push({
        pathname: '/dashboard'
      })
    }
  }
  componentDidMount () {
    /* eslint-disable */
    if ($('#sidebarDiv')) {
      $('#sidebarDiv').addClass('hideSideBar')
    }
    if ($('#headerDiv')) {
      $('#headerDiv').addClass('hideHeader')
    }
    /* eslint-enable */
  }
  skip () {
    this.props.skip()
  }
  render () {
    return (
      <div style={{height: 100 + 'vh', marginTop: '-70px'}}>
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
                      <h3 className='m-login__title'>Connect your facebook account</h3>
                    </div>
                  </div>
                  <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                    <a href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                      <span>
                        <i className='la la-power-off' />
                        <span>Connect with Facebook</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--center'>
                {
                  this.props.location && this.props.location.state && this.props.location.state.account_type === 'team' &&
                  <div className='m-login__account'>
                    <span className='m-login__account-msg'>You may skip this step and let your team agents connect facebook pages.</span>&nbsp;&nbsp;
                    <a onClick={this.skip} className='m-link m-link--focus m-login__account-link m--font-brand' style={{cursor: 'pointer'}}>Skip</a>
                  </div>
                }
              </div>
            </div>
          </div>
          {
            (this.props.location.state && this.props.location.state.permissionsRevoked)
            ? <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
              <div className='m-grid__item m-grid__item--middle'>
                <p className='m-login__msg'>You have revoked permissions for KiboPush. In order to use KiboPush,
                you will have to reconnect Facebook, or alternatively log out and use another account.</p>
                <a onClick={() => { auth.logout() }} href='/' className='btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air' style={{marginTop: '13px'}}>
                          Logout
                </a>
              </div>
            </div>

            : <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
              <div className='m-grid__item m-grid__item--middle'>
                <Link to='/signup' className='m-login__welcome'>Join KiboPush</Link>
                <p className='m-login__msg'>Get connected with your facebook audience through push messages.
            Push surveys, polls, instant broadcasts to your Facebook subscribers.</p>
              </div>
            </div>
          }

        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    successSkip: (state.signupInfo.successSkip)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    skip: skip
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Connect)
