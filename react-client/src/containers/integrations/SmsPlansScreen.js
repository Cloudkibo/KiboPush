/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPlans } from '../../redux/actions/plans.actions'

class SmsPlansScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPlan: null
    }
    props.loadPlans()
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Integrations`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin">
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
          <div className="sequence-box" style={{height: '10em'}}>
            <span>
              <span className="sequence-name">
                Free Plan
              </span>
              <br />
              <span>
                <span>
                  Connect your Twilio trial account <br /> and use our features for free
                </span>
              </span>
            </span>
            <span className="sequence-text sequence-centered-text" style={{position: 'absolute', left: '77%', top: '25%'}}>
              <span className="sequence-number">
                FREE
              </span>
            </span>
          </div>
          <div className="sequence-box" style={{height: '10em'}}>
            <span>
              <span className="sequence-name">
                Basic Plan
              </span>
              <br />
              <span>
                <span>
                  Connect your Bandwidth account <br /> to send messages upto 5000
                </span>
              </span>
            </span>
            <span className="sequence-text sequence-centered-text" style={{position: 'absolute', left: '77%', top: '25%'}}>
              <span className="sequence-number">
                $35
              </span>
            </span>
          </div>
          <div className="sequence-box" style={{height: '10em'}}>
            <span>
              <span className="sequence-name">
                Standard Plan
              </span>
              <br />
              <span>
                <span>
                  Connect your Bandwidth account <br /> to send messages upto 7500
                </span>
              </span>
            </span>
            <span className="sequence-text sequence-centered-text" style={{position: 'absolute', left: '77%', top: '25%'}}>
              <span className="sequence-number">
                $50
              </span>
            </span>
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
  return bindActionCreators({
    loadPlans
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsPlansScreen)
