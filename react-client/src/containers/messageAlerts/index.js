import React from 'react'
import PropTypes from 'prop-types'
import { handleSocketEvent } from './socket'

import HELPWIDGET from '../../components/extras/helpWidget'
import COLLAPSE from '../../components/extras/collapse'
import MODAL from '../../components/extras/modal'
import ALERTSUBSCRIPTIONS from './alertSubscriptions'
import DEFAULTDATA from './defaultData'

class MessageAlerts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alerts: [],
      channels: {},
      subscriptions: [],
      showModal: false,
      modalTitle: '',
      selectedChannel: ''
    }

    this.setAlertsDetails = this.setAlertsDetails.bind(this)
    this.setAlertSubscriptions = this.setAlertSubscriptions.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getBodyContent = this.getBodyContent.bind(this)
    this.getAlertDescription = this.getAlertDescription.bind(this)
    this.updateAlertConfiguration = this.updateAlertConfiguration.bind(this)
    this.saveAlert = this.saveAlert.bind(this)
    this.openModal = this.openModal.bind(this)
    this.getModalContent = this.getModalContent.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.addSubscription = this.addSubscription.bind(this)
    this.removeSubscription = this.removeSubscription.bind(this)
    this.updateState = this.updateState.bind(this)

    props.fetchMessageAlerts(props.user.platform, this.setAlertsDetails)
    props.fetchAlertSubscriptions(props.user.platform, this.setAlertSubscriptions)
    props.fetchMembers()
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = 'KiboPush'
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Alerts Configuration`
    this.props.setSocketData(null)
  }

  setAlertsDetails (res) {
    if (res.status === 'success' && res.payload && res.payload.length > 0) {
      const alerts = res.payload
      const talkToAgent = alerts.find((item) => item.type === 'talk_to_agent') || DEFAULTDATA.alerts[0]
      const pendingSession = alerts.find((item) => item.type === 'pending_session') || DEFAULTDATA.alerts[1]
      const unresolvedSession = alerts.find((item) => item.type === 'unresolved_session') || DEFAULTDATA.alerts[2]
      this.setState({alerts: [talkToAgent, pendingSession, unresolvedSession]})
    } else {
      this.setState({alerts: DEFAULTDATA.alerts})
    }
  }

  setAlertSubscriptions (res) {
    let channels = JSON.parse(JSON.stringify(DEFAULTDATA.channels))
    if (this.props.user.platform === 'messenger') {
      delete channels['whatsapp']
    } else {
      delete channels['messenger']
    }
    if (res.status === 'success' && res.payload && res.payload.length > 0) {
      let subscriptions = res.payload

      const notificationSubscriptions = subscriptions.filter((item) => item.alertChannel.toLowerCase() === 'notification')
      const messengerSubscriptions = subscriptions.filter((item) => item.alertChannel.toLowerCase() === 'messenger')
      const whatsappSubscriptions = subscriptions.filter((item) => item.alertChannel.toLowerCase() === 'whatsapp')
      const emailSubscriptions = subscriptions.filter((item) => item.alertChannel.toLowerCase() === 'email')

      if (notificationSubscriptions.length > 0) channels['notification'].enabled = true
      if (messengerSubscriptions.length > 0) channels['messenger'].enabled = true
      if (whatsappSubscriptions.length > 0) channels['whatsapp'].enabled = true
      if (emailSubscriptions.length > 0) channels['email'].enabled = true

      this.setState({channels, subscriptions})
    } else {
      this.setState({channels})
    }
  }

  getTitle (type) {
    switch (type) {
      case 'talk_to_agent':
        return 'Talk to Agent Alerts'
      case 'pending_session':
        return 'Pending Session Alerts'
      case 'unresolved_session':
        return 'Unresolved Session Alerts'
      default:
        return 'Message Alert'
    }
  }

  getAlertDescription (type) {
    switch (type) {
      case 'talk_to_agent':
        return 'This alert will be sent when someone selects the “Talk to Agent” option from the chatbot.'
      case 'pending_session':
        return 'This alert will be sent when a session is pending for the last n minutes.'
      case 'unresolved_session':
        return 'This alert will be sent when a session is unresolved for the last n hours.'
      default:
        return 'Message Alert Description'
    }
  }

  updateAlertConfiguration (type, field, value) {
    let flag = true
    let alerts = JSON.parse(JSON.stringify(this.state.alerts))
    let alert = alerts.find((item) => item.type === type)
    if (field === 'interval') {
      if (alert.intervalUnit === 'mins' && value > (60 * 24)) {
        flag = false
      } else if (alert.intervalUnit === 'hours' && value > 24) {
        flag = false
      }
    }
    if (flag) {
      if (field === 'interval' && !value) {
        value = 1
      }
      const index = alerts.findIndex((item) => item.type === type)
      alert[field] = value
      alerts[index] = alert
      this.setState({alerts})
    }
  }

  saveAlert (type) {
    let alerts = JSON.parse(JSON.stringify(this.state.alerts))
    let alert = alerts.find((item) => item.type === type)
    this.props.saveAlert({...alert, platform: this.props.user.platform}, (res) => {
      if (res.status === 'success') {
        this.props.alertMsg.success('Chages saved successfully!')
      } else {
        this.props.alertMsg.error(res.description)
      }
    })
  }

  openModal (channel) {
    let modalTitle = ''
    switch (channel) {
      case 'notification':
        modalTitle = 'Subscriptions: In-app Notifications'
        break
      case 'whatsapp':
        modalTitle = 'Subscriptions: WhatsApp Messenger'
        break
      case 'messenger':
        modalTitle = 'Subscriptions: Facebook Messenger'
        break
      case 'email':
        modalTitle = 'Subscriptions: Email'
        break
      default:
        modalTitle = 'Subscriptions'
    }
    this.setState({showModal: true, modalTitle, selectedChannel: channel}, () => {
      this.refs._ma_subscriptions.click()
    })
  }

  getModalContent () {
    const channel = this.state.selectedChannel
    const subscriptions = this.state.subscriptions.filter((item) => item.alertChannel.toLowerCase() === channel)
    switch (channel) {
      case 'notification':
        return (
          <ALERTSUBSCRIPTIONS
            channel={channel}
            subscriptions={subscriptions}
            members={this.props.members}
            addSubscription={this.addSubscription}
            removeSubscription={this.removeSubscription}
            updateMainState={this.updateState}
          />
        )
      case 'whatsapp':
        return (
          <ALERTSUBSCRIPTIONS
            channel={channel}
            subscriptions={subscriptions}
            removeSubscription={this.removeSubscription}
            updateMainState={this.updateState}
            whatsAppInfo={this.props.automatedOptions.whatsApp}
          />
        )
      case 'messenger':
        return (
          <ALERTSUBSCRIPTIONS
            channel={channel}
            subscriptions={subscriptions}
            removeSubscription={this.removeSubscription}
            updateMainState={this.updateState}
            facebookInfo={this.props.automatedOptions.facebook}
            user={this.props.user}
            pages={this.props.pages}
          />
        )
      case 'email':
        return (
          <ALERTSUBSCRIPTIONS
            channel={channel}
            subscriptions={subscriptions}
            members={this.props.members}
            addSubscription={this.addSubscription}
            removeSubscription={this.removeSubscription}
            updateMainState={this.updateState}
          />
        )
      default:
        return (<div />)
    }
  }

  closeModal () {
    this.setState({showModal: false})
  }

  addSubscription (data, cb) {
    const payload = {
      platform: this.props.user.platform,
      ...data
    }
    this.props.addSubscription(payload, (res) => {
      if (res.status === 'success') {
        cb()
        let channels = JSON.parse(JSON.stringify(this.state.channels))
        let subscriptions = JSON.parse(JSON.stringify(this.state.subscriptions))
        subscriptions.push(res.payload)
        channels[this.state.selectedChannel].enabled = true
        this.setState({subscriptions, channels})
        this.props.alertMsg.success('Subscription has been added successfully!')
      } else {
        this.props.alertMsg.error(res.description)
      }
    })
  }

  removeSubscription (id) {
    this.props.removeSubscription(id, (res) => {
      if (res.status === 'success') {
        let channels = JSON.parse(JSON.stringify(this.state.channels))
        let subscriptions = JSON.parse(JSON.stringify(this.state.subscriptions))
        const index = subscriptions.findIndex((item) => item._id === id)
        if (index >= 0) {
          subscriptions.splice(index, 1)
        }
        if (subscriptions.filter((item) => item.alertChannel.toLowerCase() === this.state.selectedChannel.toLocaleLowerCase()).length === 0) {
          channels[this.state.selectedChannel].enabled = false
        }
        this.setState({subscriptions, channels})
        this.props.alertMsg.success('Subscription has been removed successfully!')
      } else {
        this.props.alertMsg.error(res.description)
      }
    })
  }

  updateState (state) {
    this.setState(state)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.socketData) {
      handleSocketEvent(nextProps.socketData.payload, this.state, this.props, this.updateState)
    }
  }

  getBodyContent (alert) {
    return (
      <div>
        <div className='row'>
          <div className='col-12'>
            <p style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
              {this.getAlertDescription(alert.type)}
            </p>
          </div>
        </div>
        <div className='form-group m-form__group row' style={{marginTop: '10px'}}>
          <div className='col-form-label col-lg-4 col-sm-12'>
            Enable Alert:
          </div>
          <div className='col-lg-8 col-md-8 col-sm-12'>
            <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
              <label>
                <input
                  type='checkbox'
                  data-switch='true'
                  checked={alert.enabled}
                  onChange={() => this.updateAlertConfiguration(alert.type, 'enabled', !alert.enabled)}
                />
                <span></span>
              </label>
            </span>
          </div>
        </div>
        {
          alert.interval && alert.intervalUnit &&
          <div className='form-group m-form__group row' style={{marginTop: '5px'}}>
            <div className='col-form-label col-lg-4 col-sm-12'>
              {`Set time (in ${alert.intervalUnit}) after which alert will be sent:`}
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12'>
              <input
                disabled={!alert.enabled}
                className='form-control m-input'
                style={{width: '90px'}}
                min='1'
                step='1'
                type='number'
                value={alert.interval}
                onKeyDown={e => /[+\-.,\s]$/.test(e.key) && e.preventDefault()}
                id='mins-input'
                onChange={(e) => { this.updateAlertConfiguration(alert.type, 'interval', parseInt(e.target.value))}}
              />
            </div>
          </div>
        }
        {
          alert.promptCriteria &&
          <div className='form-group m-form__group row' style={{marginTop: '5px'}}>
            <div className='col-md-12'>
              <label className="m-checkbox m--font-bold">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    this.updateAlertConfiguration(
                      alert.type,
                      'promptCriteria',
                      e.target.checked ? 'outside_bussiness_hours' : 'none'
                    )
                  }}
                  checked={alert.promptCriteria !== 'none'}
                />
                  Send alerts outside of business hours only
                <span></span>
              </label>
            </div>
          </div>
        }
        <div className='form-group m-form__group row' style={{marginTop: '5px'}}>
          <div className='col-md-12'>
            <button
              type="button"
              className="btn btn-primary pull-right"
              onClick={() => this.saveAlert(alert.type)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <HELPWIDGET
          documentation={{visibility: true, link: 'https://kibopush.com/messageAlerts/'}}
          videoTutorial={{visibility: true, videoId: 'M3k3zV_INTM'}}
        />

        <button style={{display: 'none'}} ref='_ma_subscriptions' data-toggle='modal' data-target='#_ma_subscriptions' />
        <MODAL
          id='_ma_subscriptions'
          title={this.state.modalTitle}
          content={this.getModalContent()}
        />

        <div style={{height: '82vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet--tabs'>
          <div style={{flex: '0 0 auto'}} className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Message Alerts
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
            {
              this.state.alerts.map((alert, i) => (
                <COLLAPSE
                  key={alert._id}
                  id={alert._id}
                  title={this.getTitle(alert.type)}
                  body={this.getBodyContent(alert)}
                  showBadge={true}
                  badgeStyle={alert.enabled ? 'success' : 'danger'}
                  badgeText={alert.enabled ? 'Enabled' : 'Disabled'}
                />
              ))
            }
          </div>
          <div style={{ flex: '0 0 auto' }} className="m-portlet__foot">
            <div className='form-group m-form__group row'>
              <div className='col-lg-12 col-md-12 col-sm-12 m--font-bold'>
                Send alerts via:
              </div>
            </div>
            <div className='form-group m-form__group row'>
              {
                Object.keys(this.state.channels).map((key, i) => {
                  const channel = this.state.channels[key]
                  const style = channel.enabled ? {borderColor: '#34bfa3'} : {borderColor: '#ebedf2', color: '#111'}
                  return (
                    <div key={i} onClick={() => this.openModal(key)} className='col-lg-4 col-md-4 col-sm-6'>
                      <button
                        style={{...{whiteSpace: 'break-spaces', textAlign: 'left', height: '55px'}, ...style}}
                        className={`btn btn-outline-${channel.enabled ? 'success' : 'secondary'} btn-lg m-btn m-btn--icon`}
                      >
                        <span>
                          <i
                            style={{fontSize: '2rem'}}
                            className={`la la-${channel.enabled ? 'check-circle' : 'circle'}`}
                          />
                          <span style={{fontSize: '13px'}}>
                            {channel.title}
                          </span>
                        </span>
                      </button>
                    </div>
                  )
                })
              }
            </div>
          </div>
      </div>
    </div>
    )
  }
}

MessageAlerts.propTypes = {
  'fetchMessageAlerts': PropTypes.func.isRequired,
  'fetchAlertSubscriptions': PropTypes.func.isRequired,
  'fetchMembers': PropTypes.func.isRequired,
  'addSubscription': PropTypes.func.isRequired,
  'removeSubscription': PropTypes.func.isRequired,
  'setSocketData': PropTypes.func.isRequired,
  'members': PropTypes.array,
  'user': PropTypes.object.isRequired,
  'automatedOptions': PropTypes.object.isRequired,
  'saveAlert': PropTypes.func.isRequired,
  'pages': PropTypes.array.isRequired
}

export default MessageAlerts
