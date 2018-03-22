/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'

class Connect extends React.Component {
  componentDidMount () {
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
                  (this.props.location.state.account_type === 'team') &&
                  <div className='m-login__account'>
                    <span className='m-login__account-msg'>You may skip this step and let your team agents connect facebook pages.</span>&nbsp;&nbsp;
                    <Link to='/dashboard' className='m-link m-link--focus m-login__account-link'>Skip</Link>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1 m-login__content' style={{backgroundImage: "url('assets/app/media/img//bg/bg-4.jpg')"}}>
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

export default Connect
