import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../../wizard/header'
import AlertContainer from 'react-alert'
import SIDEBAR from '../sidebar'
import { Link } from 'react-router-dom'
import {StripeProvider, Elements} from 'react-stripe-elements'
import InjectedCheckoutForm from '../addCard'
import { getKeys } from '../../../redux/actions/basicinfo.actions'
import { setOnboardingStripeToken, configureFacebook } from '../../../redux/actions/channelOnboarding.actions'
import { RingLoader } from 'halogenium'

class WhatsAppBillingScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.child = React.createRef()
    this.state = {
      stripeToken: null,
      loadingStripe: true,
      loading: false
    }
    this.handleGetKeysResponse = this.handleGetKeysResponse.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.onNext = this.onNext.bind(this)

    props.getKeys(this.handleGetKeysResponse)
  }

  onNext () {
    this.setState({loading: true})
    if (this.props.user && this.props.user.last4) {
      this.handleCard()
    } else {
      this.clickChild()
    }
  }

  handleGetKeysResponse () {
    this.setState({loadingStripe: false})
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
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  handleCard (token) {
    let data = {
      planId: this.props.channelOnboarding.planId,
      planUniqueId: this.props.channelOnboarding.planUniqueId,
      platform: 'messenger'
    }
    if (token) {
      this.props.setOnboardingStripeToken(token)
      data.stripeToken = token
    }
    this.props.configureFacebook(data, (res) => {
      this.setState({loading: false})
      if (res.status === 'success') {
        this.props.history.push({
          pathname: '/connectFbScreen'
        })
      } else {
        this.msg.error(res.description || res.payload || 'Failed to add card details')
      }
    })
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
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
        style={{ height: 'calc(100vh - 130px)', margin: '30px'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <SIDEBAR 
            heading='Configure Facebook Messenger Channel'
            description='Get connected with you Facebook Messenger audience!'
          />
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <div style={{height: '30px'}}>
              <h2> Step 2: Choose a Billing method </h2>
            </div>
            <div style={{overflowY: 'scroll', height: 'calc(100% - 70px)'}}>
              <div className='form-group m-form__group m--margin-top-30'>
                { this.props.user && this.props.user.last4 
                  ? <div className='form-group m-form__group'>
                      <label style={{fontWeight: 'normal'}} className='control-label'>Card Details:</label>
                      <div className=' form-group m-form__group m--margin-top-15'>
                        <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                        <label style={{fontWeight: 'normal'}} className='control-label'>
                          xxxx xxxx xxxx {this.props.user.last4}
                        </label>
                      </div>
                    </div>
                  : this.state.loadingStripe
                  ? <center><RingLoader color='#FF5E3A' /></center>
                  : this.props.stripeKey && this.props.captchaKey &&
                    <StripeProvider apiKey={this.props.stripeKey}>
                      <Elements>
                        <InjectedCheckoutForm 
                          setClick={click => this.clickChild = click}
                          ref={instance => { this.child = instance; }}
                          handleCard={this.handleCard}
                          captchaKey={this.props.captchaKey} />
                      </Elements>
                    </StripeProvider>
                }
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-6 m--align-left' >
                <Link to='/facebookPlansScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                  <span>
                    <i className='la la-arrow-left' />
                    <span>Back</span>&nbsp;&nbsp;
                  </span>
                </Link>
              </div>
              <div className='col-lg-6 m--align-right'>
                <button className={`btn btn-success m-btn m-btn--custom m-btn--icon ${this.state.loading ? 'm-loader m-loader--light m-loader--right' : ''}`} onClick={this.onNext}>
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
    channelOnboarding: (state.channelOnboarding)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getKeys,
    setOnboardingStripeToken,
    configureFacebook
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppBillingScreen)
