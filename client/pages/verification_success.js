/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { Link } from 'react-router'
class Success extends React.Component {
  componentDidMount () {
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
                      <h3 className='m-login__title'>Email Verification</h3>
                      <div className='m-login__desc'>
                        You have successfully verified you email address. Please login to continue.
                      </div>
                    </div>
                  </div>
                  <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                    <Link to='/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                      <span>
                        <span>Log In</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Success
