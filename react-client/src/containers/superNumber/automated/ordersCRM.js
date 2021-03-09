import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import INFO from './info'
import WHATSAPPCONFIGURAION from './whatsAppConfiguration'
import TEMPLATE from './template'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { fetchTemplates, fetchSuperNumberPreferences, updateSuperNumberPreferences, createSuperNumberPreferences } from '../../../redux/actions/superNumber.actions'
import { validatePhoneNumber } from '../../../utility/utils'

class OrdersCRM extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: 'english',
      supportNumber: '',
      textShipment: '',
      textConfirmation: '',
      enabledShipment: false,
      enabledConfirmation: false
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)

    props.fetchShopifyStore()
    props.fetchSuperNumberPreferences(this.msg)
    props.fetchTemplates()
  }

  onSave () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else {
      let payload = {
        orderCRM: {
          language: this.state.language,
          shipmentEnabled: this.state.enabledShipment,
          supportNumber: this.state.supportNumber,
          confirmationEnabled: this.state.enabledConfirmation
        }
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

    document.title = `${title} | Orders CRM`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.orderCRM) {
      this.setState({
        language: nextProps.superNumberPreferences.orderCRM.language,
        supportNumber: nextProps.superNumberPreferences.orderCRM.supportNumber,
        enabled: nextProps.superNumberPreferences.orderCRM.enabled,
        enabledConfirmation: nextProps.superNumberPreferences.orderCRM.confirmationEnabled,
        enabledShipment: nextProps.superNumberPreferences.orderCRM.shipmentEnabled
      })
    }
    if (nextProps.templates && nextProps.templates['ORDER_CONFIRMATION']) {
      let orderConfirmationTemplates = nextProps.templates['ORDER_CONFIRMATION']
      let orderShipmentTemplates = nextProps.templates['ORDER_SHIPMENT']
      this.setState({
        textConfirmation: orderConfirmationTemplates[this.state.language].text,
        textShipment: orderShipmentTemplates[this.state.language].text
      })
    }
  }

  updateState (state, id) {
    if (id) {
      if (id === 'orderShipment') {
        this.setState({enabledShipment: state.enabled})
      } else {
        this.setState({enabledConfirmation: state.enabled})
      }
    } else {
      if (state.language) {
        let orderConfirmationTemplates = this.props.templates['ORDER_CONFIRMATION']
        let orderShipmentTemplates = this.props.templates['ORDER_SHIPMENT']
        this.setState({
          textShipment: orderShipmentTemplates[state.language].text,
          textConfirmation: orderConfirmationTemplates[state.language].text
        })
      }
      this.setState(state)
    }
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
        <div className='m-content'>
          <INFO />
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Orders CRM
                      </h3>
                    </div>
                  </div>
                </div>
                  <div className='m-portlet__body'>
                    {
                      !this.props.store &&
                      <div>
                        <h6 style={{ textAlign: 'center' }}>
                          You have not integrated an e-commerce provider with KiboPush. Please integrate an e-commerce provider to create a commerce chatbot.
                        </h6>
                        <div style={{ marginTop: '25px', textAlign: 'center' }}>
                          <div onClick={this.goToCommerceSettings} className='btn btn-primary'>
                            Integrate
                        </div>
                        </div>
                      </div>
                    }
                    {this.props.store &&
                    <div>
                      <WHATSAPPCONFIGURAION
                        updateState={this.updateState}
                        language={this.state.language}
                        supportNumber={this.state.supportNumber}
                      />
                      <br />
                      <TEMPLATE
                        updateState={this.updateState}
                        enabled={this.state.enabledConfirmation}
                        text={this.state.textConfirmation}
                        heading='Order Confirmation Template'
                        id='orderConfirmation'
                        previewUrl='https://kibopush.com'
                        language={this.state.language}
                      />
                      <br />
                      <TEMPLATE
                        updateState={this.updateState}
                        enabled={this.state.enabledShipment}
                        text={this.state.textShipment}
                        heading='Order Shipment Template'
                        id='orderShipment'
                        previewUrl='https://kibopush.com'
                        language={this.state.language}
                      />
                        <div className='row' style={{paddingTop: '30px'}}>
                          <div className='col-lg-6 m--align-left'>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            <button onClick={this.onSave} className="btn btn-primary">Save</button>
                        </div>
                      </div>
                  </div>
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
    superNumberPreferences: (state.superNumberInfo.superNumberPreferences)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchTemplates,
    fetchSuperNumberPreferences,
    updateSuperNumberPreferences,
    createSuperNumberPreferences
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OrdersCRM)
