
/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../wizard/header'
import { loadPlans } from '../../redux/actions/plans.actions'
import { Link } from 'react-router-dom'

class SmsFinishScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPlan: null
    }
    props.loadPlans()
    this.nextBtnAction = this.nextBtnAction.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | SMS Signup Complete`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  nextBtnAction () {
    /* eslint-disable */
    $('#sidebarDiv').removeClass('hideSideBar')
    $('#headerDiv').removeClass('hideSideBar')
    /* eslint-enable */
    this.props.history.push({
      pathname: '/dashboard'
    })
  }

  render () {
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: 'calc(100vh - 110px)', overflowY: 'scroll', margin: '20px' }}>
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
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem', overflowY: 'scroll'}}>
            {
              this.props.planName && this.props.planName.includes('Enterprise') ?
                <div>
                  <div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <center>
                      <img alt='completed' src='https://cdn.cloudkibo.com/public/icons/PE-Success-Icon.png' width='150' height='150'></img>
                      <br />
                      <br />
                      Congratulations! you have successfully applied for Enterprise Plan for Sms. Someone from our team will contact you soon.
                      <br />
                      <br />
                      <br />
                    </center>
                  </div>
                  <div>
                    <center>
                      <button className='btn btn-success m-btn m-btn--custom m-btn--icon' onClick={this.nextBtnAction}>
                        Finish
                      </button>
                    </center>
                  </div>
                </div>
                :
                <div>
                  <div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <center>
                      <img alt='completed' src='https://cdn.cloudkibo.com/public/icons/PE-Success-Icon.png' width='150' height='150'></img>
                      <br />
                      <br />
                      Congratulations! you have successfully configured sms channel.
                      <br />
                      <br />
                      <br />
                    </center>
                  </div>
                  <div>
                    <center>
                      <button className='btn btn-success m-btn m-btn--custom m-btn--icon' onClick={this.nextBtnAction}>
                        Finish
                      </button>
                    </center>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser),
    planName: (state.channelOnboarding.planName)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPlans
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsFinishScreen)
