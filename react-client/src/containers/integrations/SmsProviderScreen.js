/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from '../wizard/header'

class SmsProviderScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {},
      selectedTab: 'becomeSubscriber',
      sendTestMessage: false,
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Select SMS Provider`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div>
        <Header />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: '110vh' }}>
          <div className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style={{backgroundImage: 'url(https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg)'}}>
            <div className="m-grid__item m-grid__item--middle">
              <h3 className="m-login__welcome">
                Configure SMS Channel
              </h3>
              <p className="m-login__msg">
                Get connected with your contacts with a 98%
                <br />
                open rate of sms
              </p>
            </div>
          </div>
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            {
              this.props.plansInfo && this.props.plansInfo.map((planInfo, i) => (
                <div 
                  className="sequence-box" 
                  style={{height: '8em', backgroundColor: `${planInfo._id === this.state.selectedPlan ? 'cyan' : 'white'}`}}
                  key={i}
                  onClick={() => this.setState({ selectedPlan: planInfo._id })}>
                  <span>
                    <span className="sequence-name">
                      {planInfo.name}
                    </span>
                    <br />
                    <span>
                      <span>
                        Connect your SMS provider and use {planInfo.trial_period} days trial period <br /> with {planInfo.name}
                      </span>
                    </span>
                  </span>
                  <span className="sequence-text sequence-centered-text" style={{position: 'absolute', left: '77%', top: '25%'}}>
                    <span className="sequence-number">
                      {planInfo.amount ? `$${planInfo.amount}` : ''}
                    </span>
                  </span>
                </div>
              ))
            }
            <br />
            <div className='row'>
              <div className='col-lg-6 m--align-left' />
              <div className='col-lg-6 m--align-right'>
                <button className='btn btn-success m-btn m-btn--custom m-btn--icon' onClick={this.nextBtnAction}>
                  <span>
                    <span>Next</span>&nbsp;&nbsp;
                    <i className='la la-arrow-right' />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsProviderScreen)
