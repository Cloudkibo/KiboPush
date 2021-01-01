import React from 'react'
import PropTypes from 'prop-types'

import HELPWIDGET from '../../components/extras/helpWidget'
import COLLAPSE from '../../components/extras/collapse'
import DEFAULT from './defaultData'

class MessageAlerts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alerts: []
    }

    this.setAlertsDetails = this.setAlertsDetails.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getBodyContent = this.getBodyContent.bind(this)
    this.getAlertDescription = this.getAlertDescription.bind(this)
    this.updateAlertConfiguration = this.updateAlertConfiguration.bind(this)
    this.saveAlert = this.saveAlert.bind(this)

    props.fetchMessageAlerts(props.user.platform, this.setAlertsDetails)
  }

  setAlertsDetails (res) {
    if (res.status === 'success' && res.payload.length > 0) {
      const alerts = res.payload
      const talkToAgent = alerts.find((item) => item.type === 'talk_to_agent') || DEFAULT[0]
      const pendingSession = alerts.find((item) => item.type === 'pending_session') || DEFAULT[1]
      const unresolvedSession = alerts.find((item) => item.type === 'unresolved_session') || DEFAULT[2]
      this.setState({alerts: [talkToAgent, pendingSession, unresolvedSession]})
    } else {
      this.setState({alerts: DEFAULT})
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
    if (field === 'interval' && !value) {
      value = 1
    }
    let alerts = JSON.parse(JSON.stringify(this.state.alerts))
    let alert = alerts.find((item) => item.type === type)
    const index = alerts.findIndex((item) => item.type === type)
    alert[field] = value
    alerts[index] = alert
    this.setState({alerts})
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12' style={{minHeight: '900px'}}>
        <HELPWIDGET
          documentation={{visibility: true, link: 'https://kibopush.com/messageAlerts/'}}
          videoTutorial={{visibility: true, videoId: 'M3k3zV_INTM'}}
        />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs'>
          <div className='m-portlet__head'>
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
          <div className='tab-content'>
            <div style={{overflow: 'auto'}} className='m-content'>
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
          </div>
      </div>
    </div>
    )
  }
}

MessageAlerts.propTypes = {
  'fetchMessageAlerts': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'saveAlert': PropTypes.func.isRequired
}

export default MessageAlerts
