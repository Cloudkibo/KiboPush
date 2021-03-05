import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import INFO from './info'
import WHATSAPPCONFIGURAION from './whatsAppConfiguration'
import TEMPLATE from './template'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { fetchTemplates } from '../../../redux/actions/superNumber.actions'
import { validatePhoneNumber } from '../../../utility/utils'

class AbandonedCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: 'english',
      supportNumber: '',
      text: '',
      enabled: false
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)

    props.fetchShopifyStore()
    props.fetchTemplates({type: 'ABANDONED_CART_RECOVERY'})
  }

  onSave () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else {
      // updateSuperNumberPreferences
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
    if (nextProps.store && nextProps.store.abandonedCart) {
      this.setState({
        language: nextProps.store.abandonedCart.language,
        supportNumber: nextProps.store.abandonedCart.supportNumber,
        enabled: nextProps.store.abandonedCart.enabled
      })
    }
    if (nextProps.templates) {
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
        <div className='m-content'>
          <INFO />
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Abandoned Cart
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
                        enabled={this.state.enabled}
                        text={this.state.text}
                        heading='Abandoned Cart Template'
                        id='abandonedCart'
                        previewUrl='https://kibopush.com'
                        language={this.state.language}
                      />
                        <div className='row' style={{paddingTop: '30px'}}>
                          <div className='col-lg-6 m--align-left'>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            <button onClick={this.onSave} class="btn btn-primary">Save</button>
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
    templates: (state.superNumberInfo.templates)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchTemplates
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedCart)
