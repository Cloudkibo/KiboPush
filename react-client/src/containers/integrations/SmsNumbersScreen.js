/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../wizard/header'
import { loadPlans } from '../../redux/actions/plans.actions'
import { setPlanId, setPlanName, setPlanUniqueId, setOnboardingPlatform } from '../../redux/actions/channelOnboarding.actions'
import { Link } from 'react-router-dom'

class SmsNumbersScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      numberOption: '',
    }
    this.nextBtnAction = this.nextBtnAction.bind(this)
    this.changeNumberOption = this.changeNumberOption.bind(this)
    props.loadPlans('sms')
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

  changeNumberOption(e) {
    this.setState({
      numberOption: e.target.value
    })
  }

  nextBtnAction () {
    this.props.history.push({
      pathname: '/smsBillingScreen'
    })
  }

  render () {
    return (
      <div>
        <Header />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: 'calc(100vh - 70px)', overflowY: 'scroll' }}>
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
            <h2> Step 1: Select a number for SMS </h2>
            <div style={{ marginBottom: '15px' }} id='_whatsapp_provider' className='form-group m-form__group'>
              <label className='control-label'>Use</label>
              <select onChange={this.changeNumberOption} className="form-control m-input" value={this.state.numberOption} id="_zoom_users" required>
                <option value='' selected disabled>Select an SMS Number Preference...</option>
                <option value='existing'>An existing number</option>
                <option value='new'>A new number</option>
              </select>
            </div>
            {
            }
            <br />
            <div className='row'>
              <div className='col-lg-6 m--align-left' >
                <Link to='/smsBillingScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                  <span>
                    <i className='la la-arrow-left' />
                    <span>Back</span>&nbsp;&nbsp;
                  </span>
                </Link>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SmsNumbersScreen)
