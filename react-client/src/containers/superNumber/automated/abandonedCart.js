import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import INFO from './info'
import WHATSAPPCONFIGURAION from './whatsAppConfiguration'
import TEMPLATE from './template'
import TABS from '../tabs'
import MESSAGELOGS from './messageLogs'
import OPTIN from './optin'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { fetchTemplates,
  fetchSuperNumberPreferences,
  updateSuperNumberPreferences,
  createSuperNumberPreferences,
  fetchMessageLogs
} from '../../../redux/actions/superNumber.actions'
import { validatePhoneNumber } from '../../../utility/utils'

class AbandonedCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: 'english',
      supportNumber: '',
      text: '',
      enabled: false,
      currentTab: 'settings',
      loadingIntegration: true,
      optin_widget: {
        language: 'english',
        enabled: true,
        settings: {
          addToCartClicked: false,
          buyNowClicked: true,
          landingOnCartPage: false,
          checkoutClicked: true,
          thankYouPage: true
        }
      }
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.handleFetchStore = this.handleFetchStore.bind(this)
    this.fetchMessageLogs = this.fetchMessageLogs.bind(this)

    props.fetchShopifyStore(this.handleFetchStore)
    props.fetchSuperNumberPreferences(this.msg)
    props.fetchTemplates({type: 'ABANDONED_CART_RECOVERY'})
  }

  fetchMessageLogs (payload, cb) {
    this.props.fetchMessageLogs({
      last_id: payload.last_id,
      number_of_records: payload.number_of_records,
      first_page: payload.first_page,
      automatedMessage: true,
      messageType:'ABANDONED_CART_RECOVERY',
      current_page: payload.current_page,
      requested_page: payload.requested_page
    }, cb)
  }

  handleFetchStore () {
    this.setState({loadingIntegration: false})
  }

  goToCommerceSettings() {
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'commerceIntegration' }
    })
  }

  onSave () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else {
      let payload =  {
        abandonedCart: {
          language: this.state.language,
          enabled: this.state.enabled,
          supportNumber: this.state.supportNumber
        },
        optin_widget: this.state.optin_widget
      }
      if (!this.props.superNumberPreferences) {
        this.props.createSuperNumberPreferences(payload, this.msg)
      } else {
        this.props.updateSuperNumberPreferences(payload, this.msg)
      }
    }
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Abandoned Cart`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.abandonedCart) {
      this.setState({
        language: nextProps.superNumberPreferences.abandonedCart.language,
        supportNumber: nextProps.superNumberPreferences.abandonedCart.supportNumber,
        enabled: nextProps.superNumberPreferences.abandonedCart.enabled
      })
    }
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.optin_widget) {
      this.setState({optin_widget: nextProps.superNumberPreferences.optin_widget})
    }
    if (nextProps.templates && nextProps.templates[this.state.language]) {
      this.setState({text: nextProps.templates[this.state.language].text})
    }
  }

  updateState (state) {
    if (state.language) {
      this.setState({text: this.props.templates[state.language].text})
    }
    this.setState(state)
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>Abandoned Carts</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <INFO />
            <div className='row'>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                <div className='m-portlet m-portlet--full-height m-portlet--tabs'>
                  <TABS
                    currentTab={this.state.currentTab}
                    updateState={this.updateState}
                    onSave={this.onSave}
                    showSave={this.state.currentTab === 'settings'}
                    showMessageLogs
                  />
                  <div className='m-portlet__body'>
                    { this.state.loadingIntegration
                      ? <span>
                          <p> Loading... </p>
                        </span>
                      : !this.props.store
                      ? <div>
                          <h6 style={{ textAlign: 'center' }}>
                            You have not integrated an e-commerce provider with KiboPush. Please integrate an e-commerce provider to create a commerce chatbot.
                          </h6>
                          <div style={{ marginTop: '25px', textAlign: 'center' }}>
                            <div onClick={this.goToCommerceSettings} className='btn btn-primary'>
                              Integrate
                          </div>
                          </div>
                        </div>
                    : this.state.currentTab === 'settings'
                    ? <div>
                      <WHATSAPPCONFIGURAION
                        updateState={this.updateState}
                        language={this.state.language}
                        supportNumber={this.state.supportNumber}
                      />
                      <br />
                      <TEMPLATE
                        updateState={this.updateState}
                        enabled={this.state.enabled}
                        text={this.state.text}
                        heading='Abandoned Cart Template'
                        id='abandonedCart'
                        previewUrl='https://cdn.cloudkibo.com/public/img/abandoned-cart.png'
                        language={this.state.language}
                      />
                      <br />
                      <OPTIN
                        updateState={this.updateState}
                        optinWidget={this.state.optin_widget}
                      />
                  </div>
                  : <MESSAGELOGS
                      type='abandonedCart'
                      messageLogs={this.props.messageLogs}
                      count={this.props.messageLogsCount}
                      fetchMessageLogs={this.fetchMessageLogs}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    store: (state.commerceInfo.store),
    templates: (state.superNumberInfo.templates),
    superNumberPreferences: (state.superNumberInfo.superNumberPreferences),
    messageLogs: (state.superNumberInfo.messageLogs),
    messageLogsCount: (state.superNumberInfo.messageLogsCount)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchTemplates,
    fetchSuperNumberPreferences,
    updateSuperNumberPreferences,
    createSuperNumberPreferences,
    fetchMessageLogs
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCart)
