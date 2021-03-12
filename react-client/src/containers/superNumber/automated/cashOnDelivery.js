import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import INFO from './info'
import WHATSAPPCONFIGURAION from './whatsAppConfiguration'
import CODTAGS from './codTags'
import TEMPLATE from './template'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import { fetchTemplates, fetchSuperNumberPreferences, updateSuperNumberPreferences, createSuperNumberPreferences } from '../../../redux/actions/superNumber.actions'
import { validatePhoneNumber } from '../../../utility/utils'

class CashOnDelivery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: 'english',
      supportNumber: '',
      text: '',
      enabled: false,
      codTags: {
        cancelled_tag: 'CODCancelled-KiboPush',
        confirmed_tag: 'CODConfirmed-KiboPush',
        no_response_tag: 'CODNoResponse-KiboPush'
      }
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)

    props.fetchShopifyStore()
    props.fetchSuperNumberPreferences(this.msg)
    props.fetchTemplates({type: 'COD_ORDER_CONFIRMATION'})
  }

  onSave () {
    if (!this.state.supportNumber) {
      this.msg.error('Please enter a WhatsApp support number')
    } else if (!validatePhoneNumber(this.state.supportNumber)) {
      this.msg.error('Please enter a valid WhatsApp number')
    } else if (this.state.codTags.cancelTag === '' || this.state.codTags.confirmTag === '' || this.state.codTags.noResponseTag === '') {
        this.msg.error('Please provide all tags for COD orders')
    } else {
      let payload =  { cashOnDelivery: {
        language: this.state.language,
        enabled: this.state.enabled,
        supportNumber: this.state.supportNumber,
        cod_tags: this.state.codTags
      }}
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

    document.title = `${title} | Cash On Delivery`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.cashOnDelivery) {
      this.setState({
        language: nextProps.superNumberPreferences.cashOnDelivery.language,
        supportNumber: nextProps.superNumberPreferences.cashOnDelivery.supportNumber,
        enabled: nextProps.superNumberPreferences.cashOnDelivery.enabled,
        codTags: nextProps.superNumberPreferences.cashOnDelivery.cod_tags
      })
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
        <div className='m-content'>
          <INFO />
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Cash On Delivery
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
                        heading='Cash On Delivery'
                        id='cashOnDelivery'
                        previewUrl='https://cdn.cloudkibo.com/public/img/cod-order-confirmation.png'
                        language={this.state.language}
                      />
                      <br />
                       <CODTAGS
                         updateState={this.updateState}
                         language={this.state.language}
                         codTags={this.state.codTags}
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
    user: (state.basicInfo.user),
    templates: (state.superNumberInfo.templates),
    superNumberPreferences: (state.superNumberInfo.superNumberPreferences)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchTemplates,
    updateSuperNumberPreferences,
    fetchSuperNumberPreferences,
    createSuperNumberPreferences
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CashOnDelivery)
