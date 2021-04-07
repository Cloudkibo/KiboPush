import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import {
  fetchSuperNumberPreferences,
  updateSuperNumberPreferences,
  createSuperNumberPreferences,
  fetchWidgetAnalytics
} from '../../../redux/actions/superNumber.actions'
import TABS from '../tabs'
import BUTTONDESIGNANDTEXT from './buttonDesignAndText'
import BUTTONDISPLAYANDPOSITION from './buttonDisplayAndPosition'
import PAGESTODISPLAY from './pagesToDisplay'
import ANALYTICS from './analytics'

class WhatsAppShare extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 'settings',
      loadingIntegration: true,
      loadingAnalytics: true,
      selectedDate: '30',
      startDate: '',
      endDate: '',
      enabled: false,
      btnDesign: {
        backgroundColorStyle: 'single',
        backgroundColor1: '#5cb85c',
        backgroundColor2: '#2e5303',
        iconColor: '#ffffff',
        btnTextColor: '#ffffff'
      },
      textMessage: {
        btnText: 'Share',
        message: "Check this out, it's so cool"
      },
      displayPosition: {
        display: 'both',
        mobilePosition: 'right',
        desktopPosition: 'right',
      },
      displayPages: {
        homePage: true,
        collectionsPage: true,
        productPages: true,
        cartPage: true,
        thankyouPage: false,
        blogPostPages: true,
        accountPages: false,
        urlsEndinginPages: true
      }
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.handleFetchStore = this.handleFetchStore.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.fetchWidgetAnalytics = this.fetchWidgetAnalytics.bind(this)

    props.fetchShopifyStore(this.handleFetchStore)
    props.fetchSuperNumberPreferences(this.msg)
  }

  handleSwitch (e) {
    this.setState({enabled: e.target.checked})
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
    let payload = {
      share_button: {
        enabled: this.state.enabled,
        btnDesign: this.state.btnDesign,
        textMessage: this.state.textMessage,
        displayPosition: this.state.displayPosition,
        displayPages: this.state.displayPages
      }
    }
    if (!this.props.superNumberPreferences) {
      this.props.createSuperNumberPreferences(payload, this.msg)
    } else {
      this.props.updateSuperNumberPreferences(payload, this.msg)
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

    document.title = `${title} | WhatsApp Share`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.share_button) {
      let state = {
        enabled: nextProps.superNumberPreferences.share_button.enabled
      }
      if (nextProps.superNumberPreferences.share_button.btnDesign) {
        state.btnDesign = nextProps.superNumberPreferences.share_button.btnDesign
      }
      if (nextProps.superNumberPreferences.share_button.textMessage) {
        state.textMessage = nextProps.superNumberPreferences.share_button.textMessage
      }
      if (nextProps.superNumberPreferences.share_button.displayPosition) {
        state.displayPosition = nextProps.superNumberPreferences.share_button.displayPosition
      }
      if (nextProps.superNumberPreferences.share_button.displayPages) {
        state.displayPages = nextProps.superNumberPreferences.share_button.displayPages
      }
      this.setState(state)
    }
  }

  updateState (state) {
    this.setState(state)
  }

  fetchWidgetAnalytics (data) {
    this.setState({startDate: data.startDate, endDate: data.endDate, selectedDate: data.selectedDate, loadingAnalytics: true})
    this.props.fetchWidgetAnalytics(data, () => {
      this.setState({loadingAnalytics: false})
    })
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
                <h3 className='m-subheader__title'>WhatsApp Share Button</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding the WhatsApp Share button? Here is the <a href='https://kibopush.com/subscribers/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
              </div>
            </div>
            <div className='row'>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                <div className='m-portlet m-portlet--full-height m-portlet--tabs'>
                  <TABS
                    currentTab={this.state.currentTab}
                    updateState={this.updateState}
                    onSave={this.onSave}
                    showSave={this.state.currentTab === 'settings'}
                    showViewInStore={this.state.currentTab === 'settings'}
                    showAnalytics
                    storeUrl={this.props.store && `https://${this.props.store.domain}`}
                    showDateFilter={this.state.currentTab === 'analytics'}
                    selectedDate={this.state.selectedDate}
                    fetchWidgetAnalytics={this.fetchWidgetAnalytics}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    widgetType='share'
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
                        <div className='form-group m-form__group'>
                          <div className='row'>
                            <div className='col-md-2'>
                              <span style={{fontWeight: 'bold'}}>Button Status:</span>
                            </div>
                            <div className='col-md-10'>
                              <span
                                style={{marginTop: '-5px'}}
                                className={"m-switch m-switch--icon " + (this.state.enabled ? "m-switch--success" : "m-switch--danger")}>
                                <label>
                                  <input checked={this.state.enabled} onChange={this.handleSwitch} type="checkbox" />
                                  <span />
                                </label>
                              </span>
                            </div>
                          </div>
                        </div>
                        <BUTTONDESIGNANDTEXT
                          updateState={this.updateState}
                          btnDesign={this.state.btnDesign}
                          textMessage={this.state.textMessage}
                          btnLabel='Share Button Text:'
                          btnMessageLabel='Share Message:'
                          rotateDegree='270'
                          gradientDegree='180'
                        />
                        <br />
                        <BUTTONDISPLAYANDPOSITION
                          updateState={this.updateState}
                          displayPosition={this.state.displayPosition}
                        />
                        <br />
                        <PAGESTODISPLAY
                          updateState={this.updateState}
                          displayPages={this.state.displayPages}
                          showCart
                        />
                      </div>
                    : <ANALYTICS
                        widgetType='share'
                        loading={this.state.loadingAnalytics}
                        selectedDate={this.state.selectedDate}
                        fetchWidgetAnalytics={this.fetchWidgetAnalytics}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
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
    superNumberPreferences: (state.superNumberInfo.superNumberPreferences)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchWidgetAnalytics,
    fetchShopifyStore,
    fetchSuperNumberPreferences,
    updateSuperNumberPreferences,
    createSuperNumberPreferences,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppShare)
