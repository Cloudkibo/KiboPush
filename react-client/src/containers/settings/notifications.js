import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { fetchNotifications, updateNotificationSettings } from '../../redux/actions/settings.actions'

class Notifications extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      notifications: [],
      openVideo: false
    }
    props.fetchNotifications()
    this.expandRowToggle = this.expandRowToggle.bind(this)
    this.updateNotificationSettings = this.updateNotificationSettings.bind(this)
    this.getAlertTitle = this.getAlertTitle.bind(this)
    this.getAlertDescription = this.getAlertDescription.bind(this)
    this.saveNotificationSettings = this.saveNotificationSettings.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoAlerts.click()
  }
  getAlertTitle(type) {
    if (type === 'unresolveSessionAlert') {
      return 'Unresolved Session Alert'
    } else if (type === 'pendingSessionAlert') {
      return 'Pending Session Alert'
    }
  }
  getAlertDescription(type) {
    if (type === 'unresolveSessionAlert') {
      return 'This alert will let the assigned team members know that a livechat session is unresolved for the last `n` minutes'
    } else if (type === 'pendingSessionAlert') {
      return 'This alert will let the assigned team members know that a new livechat session has been pending response for the last `n` minutes'
    }
  }
  saveNotificationSettings () {
    var payload = {}
    for (let alert of this.state.notifications) {
      payload[alert._id]= {
        enabled: alert.enabled,
        notification_interval: alert.notification_interval,
        interval_unit: alert.interval_unit,
        assignedMembers: alert.assignedMembers
      }
    }
    this.props.updateNotificationSettings(payload, this.msg)
  }
  updateNotificationSettings (notification, field, value) {
    if (field === 'notification_interval' && (!value || value === 0)) {
      value = 1
    }
    var notifications = []
    for (let alert of this.state.notifications) 
    { if (alert._id === notification._id) {
        alert[field] = value
      }
      notifications.push(alert)
    }
    this.setState({
      notifications
    })

  }
  expandRowToggle (row) {
    let className = document.getElementById(`icon-${row}`).className
    console.log('className', className)
    if (className === 'la la-angle-up collapsed') {
      document.getElementById(`icon-${row}`).className = 'la la-angle-down'
    } else {
      document.getElementById(`icon-${row}`).className = 'la la-angle-up'
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.adminAlerts) {
      var adminAlerts = nextProps.adminAlerts
      var notifications = []
      for (let alert in adminAlerts) {
        var notification = {
          '_id': alert,
          'enabled': adminAlerts[alert].enabled,
          'notification_interval': adminAlerts[alert].notification_interval,
          'interval_unit': adminAlerts[alert].interval_unit,
          'assignedMembers': adminAlerts[alert].assignedMembers

        }
       notifications.push(notification)
     }
     this.setState({
       notifications
     })
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12' style={{minHeight: '900px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoAlerts' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoAlerts">videoAlerts</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoAlerts" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Message Alerts Video Tutorial
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" 
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='M3k3zV_INTM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              }
              </div>
            </div>
          </div>
        </div>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs'>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Message Alerts Settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
            <div style={{textAlign: 'center'}} className='alert m-alert m-alert--default' role='alert'>
                Need help in understanding Message Alerts? Here is the <a href='https://kibopush.com/messageAlerts/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
              </div>
              <div style={{overflow: 'auto' }}>
                {
                  this.state.notifications && this.state.notifications.length > 0 &&  this.state.notifications.map((notification, i) => 
                    <div key={notification._id} className='accordion' id={`accordion${notification._id}`} style={{ marginTop: '15px' }}>
                      <div className='card'>
                        <div className='card-header' id={`heading${notification._id}`}>
                          <h4 className='mb-0'>
                            <div
                              onClick={() => this.expandRowToggle(i)}
                              className='btn'
                              data-toggle='collapse'
                              data-target={`#collapse_${notification._id}`}
                              aria-expanded='true'
                              aria-controls={`#collapse_${notification._id}`}
                            >
                             {this.getAlertTitle(notification._id)}
                            </div>
                            <span style={{ overflow: 'visible', float: 'right' }}>
                              <i
                                style={{ fontSize: '20px', cursor: 'pointer' }}
                                className='la la-angle-down'
                                data-toggle='collapse'
                                onClick={() => this.expandRowToggle(i)}
                                id={`icon-${i}`}
                                data-target={`#collapse_${notification._id}`}
                              />
                            </span>
                          </h4>
                        </div>
                        <div id={`collapse_${notification._id}`} className='collapse' aria-labelledby={`heading${notification._id}`} data-parent="#accordion">
                          <div className='card-body'>
                            <div className='row'>
                              <div className='col-12'>
                                <p style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}> {this.getAlertDescription(notification._id)}
                                </p>
                              </div>
                              </div>
                            <div className='row' style={{marginTop: '10px'}}>
                              <div className='col-8'>
                                Enable Alert
                              </div>
                              <div className='col-4'>
                                <span className={'m-switch m-switch--outline m-switch--icon m-switch--success'}>
                                  <label>
                                    <input type='checkbox' data-switch='true' checked={notification.enabled} onChange={() => { this.updateNotificationSettings(notification, 'enabled', !notification.enabled)}} />
                                    <span></span>
                                  </label>
                                </span>
                              </div>
                            </div>
                            <div className='row' style={{marginTop: '5px'}}>
                              <div className='col-8'>
                                Set time (in mins) after which alert will be sent
                              </div>
                              <div className='col-4'>
                                 <input disabled={!notification.enabled} className='form-control m-input' style={{width: '90px'}} min='1' step='1' type='number' value={notification.notification_interval}  onKeyDown={e => /[+\-.,\s]$/.test(e.key) && e.preventDefault()} id='mins-input' onChange={(e) => { this.updateNotificationSettings(notification, 'notification_interval', e.target.value)}}/>
                              </div>
                            </div>
                            <div className='row' style={{marginTop: '5px'}}>
                              <div className='col-8'>
                                Assign members who will receive alert
                              </div>
                              <div className='col-4'>
                                <select disabled={!notification.enabled} className='custom-select' onChange={(e) => { this.updateNotificationSettings(notification, 'assignedMembers', e.target.value)}}>
                                  <option value='buyer' selected={notification.assignedMembers === 'buyer'}>
                                    Buyer
                                  </option>
                                  <option value="admins" selected={notification.assignedMembers === 'admins'}>
                                    Admins
                                  </option>
                                  <option value="both" selected={notification.assignedMembers === 'both'}>
                                    Both
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
            </div>
            <div className='col-12 input-group pull-right' style={{marginTop: '20px'}}>
              <button className='btn btn-primary pull-right'onClick={this.saveNotificationSettings}>Save</button>
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
    adminAlerts: state.settingsInfo.adminAlerts
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchNotifications: fetchNotifications,
    updateNotificationSettings: updateNotificationSettings
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
