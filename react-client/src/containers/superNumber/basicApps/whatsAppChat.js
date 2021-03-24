import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchShopifyStore } from '../../../redux/actions/commerce.actions'
import {
  fetchSuperNumberPreferences,
  updateSuperNumberPreferences,
  createSuperNumberPreferences,
} from '../../../redux/actions/superNumber.actions'
import TABS from '../tabs'
import BUTTONDESIGNANDTEXT from './buttonDesignAndText'
import BUTTONDISPLAYANDPOSITION from './buttonDisplayAndPosition'
import PAGESTODISPLAY from './pagesToDisplay'
import AGENTS from './agents'

class WhatsAppChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 'settings',
      loadingIntegration: true,
      enabled: true,
      agentsLimit: 6,
      agents: [],
      onOffHours: {
        monday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        tuesday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        wednesday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        thursday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        friday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        saturday: {
          startTime: '00:00',
          endTime: '23:59'
        },
        sunday: {
          startTime: '00:00',
          endTime: '23:59'
        }
      },
      btnDesign: {
        backgroundColorStyle: 'single',
        backgroundColor1: '#5cb85c',
        backgroundColor2: '#2e5303',
        iconColor: '#ffffff',
        btnTextColor: '#ffffff'
      },
      textMessage: {
        btnText: 'Chat with us',
        message: "I'm interested in this product and I have a few questions. Can you help?",
        includePageURL: true
      },
      callOutCard: {
        enabled: true,
        cardText: '',
        cardDelay: 5
      },
      greetingsWidget: {
         backgroundColorStyle: 'single',
         backgroundColor1: '#5cb85c',
         backgroundColor2: '#2e5303',
         headingColor: '#ffffff',
         descriptionColor: '#ffffff',
         titleText: 'Hi there!',
         helpText: 'We are here to help. Chat with us on WhatsApp for any queries.',
         offlineAgentMsg: 'None of our agents are available to chat at this time. We are sorry for the inconvenience. Please try again later',
         offlineStoreMsg: 'Hi, our working hours are <start time> to <end time>, request you to reach us at the same time. Apologies for the inconvenience',
         randomAgentsOrder: true
      },
      displayPosition: {
        display: 'both',
        mobilePosition: 'right',
        desktopPosition: 'right',
        desktopHeightOffset: 20,
        desktopEdgeOffset: 20,
        mobileHeightOffset: 20,
        mobileEdgeOffset: 20
      },
      displayPages: {
        homePage: true,
        collectionsPage: true,
        productPages: true,
        cartPageDesktop: true,
        cartPageMobile: false,
        thankyouPage: true,
        blogPostPages: true,
        accountPages: true,
        urlsEndinginPages: true,
      }
    }
    this.updateState = this.updateState.bind(this)
    this.onSave = this.onSave.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.handleFetchStore = this.handleFetchStore.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)

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

    document.title = `${title} | Abandoned Cart`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.superNumberPreferences && nextProps.superNumberPreferences.chat_widget) {
      let state = {
        enabled: nextProps.superNumberPreferences.chat_widget.enabled
      }
      if (nextProps.superNumberPreferences.chat_widget.btnDesign) {
        state.btnDesign = nextProps.superNumberPreferences.chat_widget.btnDesign
      }
      if (nextProps.superNumberPreferences.chat_widget.textMessage) {
        state.textMessage = nextProps.superNumberPreferences.chat_widget.textMessage
      }
      if (nextProps.superNumberPreferences.chat_widget.displayPosition) {
        state.displayPosition = nextProps.superNumberPreferences.chat_widget.displayPosition
      }
      if (nextProps.superNumberPreferences.chat_widget.displayPages) {
        state.displayPages = nextProps.superNumberPreferences.chat_widget.displayPages
      }
      this.setState(state)
    }
  }

  updateState (state, agent) {
    if (agent) {
      this.setState({agents: state})
    } else {
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
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>WhatsApp Chat Button</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding the WhatsApp Chat button? Here is the <a href='https://kibopush.com/subscribers/' target='_blank' rel='noopener noreferrer'>documentation</a>.
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
                    : this.state.currentTab === 'settings' &&
                      <div>
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
                        <AGENTS
                          updateState={this.updateState}
                          agents={this.state.agents}
                          onOffHours={this.state.onOffHours}
                          agentsLimit={this.state.agentsLimit}
                          alertMsg={this.msg}
                        />
                        <BUTTONDESIGNANDTEXT
                          updateState={this.updateState}
                          btnDesign={this.state.btnDesign}
                          textMessage={this.state.textMessage}
                          btnLabel='Chat Button Text:'
                          btnMessageLabel='WhatsApp Message:'
                        />
                        <BUTTONDISPLAYANDPOSITION
                          updateState={this.updateState}
                          displayPosition={this.state.displayPosition}
                        />
                        <PAGESTODISPLAY
                          updateState={this.updateState}
                          displayPages={this.state.displayPages}
                        />
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
    superNumberPreferences: (state.superNumberInfo.superNumberPreferences)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchShopifyStore,
    fetchSuperNumberPreferences,
    updateSuperNumberPreferences,
    createSuperNumberPreferences,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppChat)
