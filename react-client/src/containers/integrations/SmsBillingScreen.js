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
    this.props.updateCard({companyId: this.props.user.companyId, stripeToken: payload}, this.msg, this.onSuccessCallback)
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
            <h2> Step 2: Choose a billing method</h2>
            <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12' style={{maxWidth: '100%' }}>
              <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
              <div style={{height: '82vh'}} className='m-portlet m-portlet--tabs  '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        <span className='nav-link m-tabs__link active'>
                          <i className='flaticon-share m--hide' />
                          Payment Methods
                        </span>
                      </li>
                    </ul>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showCardModal} data-toggle="modal" data-backdrop='static' data-keyboard='false' data-target="#paymentMethode" style={{marginTop: '15px'}}>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          Add
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className='tab-content'>
                  <div className='m-content'>
                    {
                      this.props.user && !this.props.user.last4 &&
                        <label style={{fontWeight: 'inherit'}} onClick={this.change}>
                          You haven't provided any payment method as yet. Click on Add button to enter credit/debit card details
                        </label>
                    }
                    <div className='row'>
                      <div className='col-xl-12 col-md-12 col-sm-12'>
                        <div>
                          <div className='m-portlet__body'>
                            <div className='tab-content'>
                              {
                                this.props.user && this.props.user.last4 &&
                                  <div className='tab-pane active' id='m_widget4_tab1_content'>
                                    <div className='m-widget4' >
                                      <div className='m-widget4__item'>
                                        <div className='m-widget4__info'>
                                          <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                                          <span className='m-widget4__title'>
                                            xxxx xxxx xxxx {this.props.user.last4}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              }
                            </div>
                            <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="paymentMethode" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div style={{ display: 'block' }} className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                      Credit/Debit Card Details
                                    </h5>
                                    <button id='_close_payment_modal' onClick={this.closeCardModal} style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" data-dismiss='modal' className="close" aria-label="Close">
                                      <span aria-hidden="true">
                                        &times;
                                      </span>
                                    </button>
                                  </div>
                                  <div style={{ color: 'black' }} className="modal-body">
                                    {
                                      this.state.showCardModal &&
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
