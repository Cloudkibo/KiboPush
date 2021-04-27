/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../wizard/header'
import AlertContainer from 'react-alert'
import { loadPlans } from '../../redux/actions/plans.actions'
import { setPlanId, setPlanName, setPlanUniqueId, setOnboardingPlatform } from '../../redux/actions/channelOnboarding.actions'

class SmsPlansScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPlan: null
    }
    this.nextBtnAction = this.nextBtnAction.bind(this)
    this.isPlanSelected = this.isPlanSelected.bind(this)
    props.loadPlans('sms', this.isPlanSelected)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Select SMS Plans`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  isPlanSelected (res) {
    if (
      res.status === 'success' && this.props.history.location.state &&
      this.props.history.location.state.plan
    ) {
      const plans = res.payload
      const selectedPlan = plans.find((item) => item.unique_ID === this.props.history.location.state.plan)
      if (selectedPlan) {
        this.setState({selectedPlan: selectedPlan._id}, () => {
          this.nextBtnAction()
        })
      }
    }
  }

  nextBtnAction () {
    if (this.state.selectedPlan) {
      this.props.setPlanId(this.state.selectedPlan)
      this.props.setPlanName(this.props.plansInfo.filter(item => item._id === this.state.selectedPlan)[0].name)
      this.props.setPlanUniqueId(this.props.plansInfo.filter(item => item._id === this.state.selectedPlan)[0].unique_ID)
      this.props.setOnboardingPlatform('sms')
      this.props.history.push({
        pathname: '/smsBillingScreen'
      })
    } else {
      this.msg.error('Please select a plan first.')
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: 'calc(100vh - 110px)', overflowY: 'scroll', margin: '20px' }}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
            <h2> Step 1: Choose a plan </h2>
            <div style={{overflowY: 'scroll', height: '460px'}}>
              {
                this.props.plansInfo && this.props.plansInfo.map((planInfo, i) => (
                  <div 
                    className="sequence-box" 
                    style={{height: '8em', backgroundColor: `${planInfo._id === this.state.selectedPlan ? '#34bfa3' : 'white'}`, cursor: 'pointer'}}
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
            </div>
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
    plansInfo: (state.plansInfo.plansInfo),
    superUser: (state.basicInfo.superUser)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPlans,
    setPlanId,
    setPlanName,
    setPlanUniqueId,
    setOnboardingPlatform
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsPlansScreen)
