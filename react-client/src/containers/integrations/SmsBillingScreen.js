/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import {StripeProvider, Elements} from 'react-stripe-elements'
import InjectedCheckoutForm from './../wizard/checkout'
import { updateCard, getKeys } from '../../redux/actions/basicinfo.actions'
import Header from './../wizard/header'
import { setOnboardingStripeToken } from '../../redux/actions/channelOnboarding.actions'
import { Link } from 'react-router-dom'

class SmsBillingScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showCardModal: false,
      stripeToken: null
    }
    props.getKeys()
    this.setCard = this.setCard.bind(this)
    this.showCardModal = this.showCardModal.bind(this)
    this.closeCardModal = this.closeCardModal.bind(this)
    this.onSuccessCallback = this.onSuccessCallback.bind(this)
    this.nextBtnAction = this.nextBtnAction.bind(this)
  }

  onSuccessCallback () {
    document.getElementById('_close_payment_modal').click()
  }

  closeCardModal () {
    this.setState({showCardModal: false})
  }

  showCardModal () {
    this.setState({showCardModal: true})
  }

  setCard (payload, value) {
    this.setState({ stripeToken: payload })
    // this.props.updateCard({companyId: this.props.user.companyId, stripeToken: payload}, this.msg, this.onSuccessCallback)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Select Billing Method`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  nextBtnAction () {
    this.props.setOnboardingStripeToken(this.state.stripeToken)

    if (this.props.planName.includes('Enterprise')) {
      this.props.history.push({
        pathname: '/smsProviderScreen'
      })
    } else {
      this.props.history.push({
        pathname: '/smsNumbersScreen'
      })
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
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
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <h2> Step 2: Choose a billing method</h2>
            <div style={{overflowY: 'scroll', height: '460px'}}>
              <div style={{ color: 'black' }} className="modal-body">
                {
                  <div className='col-12'>
                    {
                      this.props.stripeKey && this.props.captchaKey &&
                        <StripeProvider apiKey={this.props.stripeKey}>
                          <Elements>
                            <InjectedCheckoutForm setCard={this.setCard} captchaKey={this.props.captchaKey} />
                          </Elements>
                        </StripeProvider>
                    }
                  </div>
                }
              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-lg-6 m--align-left' >
                <Link to='/smsPlansScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
    captchaKey: (state.basicInfo.captchaKey),
    stripeKey: (state.basicInfo.stripeKey),
    superUser: (state.basicInfo.superUser),
    planName: (state.channelOnboarding.planName)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCard: updateCard,
    getKeys: getKeys,
    setOnboardingStripeToken: setOnboardingStripeToken
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsBillingScreen)
