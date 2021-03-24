import React from "react"
import PropTypes from 'prop-types'
import { validatePhoneNumber } from '../../../utility/utils'

class AgentModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      agentName: '',
      whatsappNumber: '',
      agentRole: '',
      enabled: true,
      onlineHours: this.initializeHours()
    }
    this.handleNumber = this.handleNumber.bind(this)
    this.handleName = this.handleName.bind(this)
    this.handleRole = this.handleRole.bind(this)
    this.handleStartTime = this.handleStartTime.bind(this)
    this.handleEndTime = this.handleEndTime.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.onSave = this.onSave.bind(this)
    this.initializeHours = this.initializeHours.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)
    if (nextProps.selectedAgent) {
      this.setState({
        agentName: nextProps.selectedAgent.agentName,
        whatsappNumber: nextProps.selectedAgent.whatsappNumber,
        agentRole: nextProps.selectedAgent.agentRole,
        enabled: nextProps.selectedAgent.enabled,
        onlineHours: nextProps.selectedAgent.onlineHours
      })
    } else {
      let onlineHours = this.initializeHours()
      this.setState({
        agentName: '',
        whatsappNumber: '',
        agentRole: '',
        enabled: true,
        onlineHours: onlineHours
      })
    }
  }

  initializeHours () {
    let onlineHours = {}
    this.props.days.map(day =>
        onlineHours[day] = {
          startTime: '00:00',
          endTime: '23:59'
        }
    )
    console.log('onlineHours', onlineHours)
    return onlineHours
  }

  handleSwitch (e) {
    this.setState({enabled: e.target.checked})
  }

  handleNumber (e) {
    this.setState({whatsappNumber: e.target.value})
  }

  handleName (e) {
    this.setState({agentName: e.target.value})
  }

  handleRole (e) {
    this.setState({agentRole: e.target.value})
  }

  handleStartTime (e, day) {
    let onlineHours = JSON.parse(JSON.stringify(this.state.onlineHours))
    onlineHours[day].startTime = e.target.value
    this.setState({onlineHours})
  }

  handleEndTime (e, day) {
    let onlineHours = JSON.parse(JSON.stringify(this.state.onlineHours))
    onlineHours[day].endTime = e.target.value
    this.setState({onlineHours})
  }

  onSave () {
    if (!this.state.whatsappNumber) {
      this.props.alertMsg.error('Please enter a whatsapp number')
    } else if (!validatePhoneNumber(this.state.whatsappNumber)) {
      this.props.alertMsg.error('Please enter a valid whatsapp number')
    } else if (!this.state.agentName) {
      this.props.alertMsg.error('Please enter agent name')
    } else if (!this.state.agentRole) {
      this.props.alertMsg.error('Please enter agent role')
    } else {
      let data = {
        agentName: this.state.agentName,
        whatsappNumber: this.state.whatsappNumber,
        agentRole: this.state.agentRole,
        enabled: this.state.enabled,
        onlineHours: this.state.onlineHours
      }
      if (this.props.selectedAgent) {
        this.props.editAgent(data)
      } else {
        this.props.addAgent(data)
      }
    }
  }

  render () {
    return (
      <div className="modal-body">
        <form onSubmit={this.onSave} style={{height: '500px', overflowX: 'hidden', overflowY: 'scroll'}}>
          <div className='m-form' style={{marginTop: '8px'}}>
            <div className='form-group m-form__group row' style={{paddingLeft: '15px'}}>
              <label style={{fontWeight: 'normal'}}>WhatsApp Number:</label>
              <input type="tel" className="form-control m-input" required
                style={{marginLeft: '38px', width: '60%', marginTop: '-7px'}}
                onChange={this.handleNumber}
                placeholder='Example: +923374824567'
                value={this.state.whatsappNumber} />
            </div>
            <div className='form-group m-form__group row' style={{paddingLeft: '15px'}}>
              <label style={{fontWeight: 'normal'}}>Agent Name:</label>
              <input type="text" className="form-control m-input" required
                style={{marginLeft: '84px', width: '60%', marginTop: '-7px'}}
                onChange={this.handleName}
                placeholder='Example: John Doe'
                value={this.state.agentName} />
            </div>
            <div className='form-group m-form__group row' style={{paddingLeft: '15px'}}>
              <label style={{fontWeight: 'normal'}}>Agent Role:</label>
              <input type="text" className="form-control m-input" required
                style={{marginLeft: '96px', width: '60%', marginTop: '-7px'}}
                onChange={this.handleRole}
                placeholder='Example: Customer Support'
                value={this.state.agentRole} />
            </div>
            <div className='form-group m-form__group row' style={{paddingLeft: '15px'}}>
              <label style={{fontWeight: 'normal'}}>Status:</label>
                <span
                  style={{marginTop: '-5px', marginLeft: '128px'}}
                  className={"m-switch m-switch--icon " + (this.state.enabled ? "m-switch--success" : "m-switch--danger")}>
                  <label>
                    <input checked={this.state.enabled} onChange={this.handleSwitch} type="checkbox" />
                    <span />
                  </label>
                </span>
            </div>
            <div>
              <label style={{fontWeight: 'normal', color: '#3f4047'}}>Online Hours for Chat Agent:</label>
              <br />
              <span>
                Use this if your Chat Agents work in shifts, and you want them to be displayed in the Greetings widget only during certain hours of the day. By default, hours are set from 12:00 AM to 11:59 PM which means your agents are active all the time.
              </span>
              <br /><br />
              <span>
                <b>Note:</b> If all your Chat Agents are offline at any given time, the Chat Button will go into Off mode and won’t be displayed on the storefront.
              </span>
            </div>
            {this.props.days.map(day => (
              <div className='form-group m-form__group'>
                <label style={{fontWeight: 'normal'}}>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                <div className='form-group m-form__group row' style={{marginLeft: '0', marginTop: '-10px'}}>
                  <input className="form-control m-input" required
                    type='time' style={{width: '30%', marginTop: '-7px'}}
                    onChange={(e) => this.handleStartTime(e, day)}
                    value={this.state.onlineHours[day].startTime} />
                  <label style={{marginLeft: '20px', marginRight: '20px'}}>to:</label>
                  <input className="form-control m-input" required
                    type='time' style={{width: '30%', marginTop: '-7px'}}
                    onChange={(e) => this.handleEndTime(e, day)}
                    value={this.state.onlineHours[day].endTime} />
                </div>
              </div>
            ))}
          </div>
        </form>
        <div className='row' style={{paddingTop: '30px'}}>
          <div className='col-lg-6 m--align-left'>
          </div>
          <div className='col-lg-6 m--align-right'>
            <button onClick={this.onSave} class="btn btn-primary">Save</button>
        </div>
      </div>
      </div>
    )
  }
}

AgentModal.propTypes = {
  'selectedAgent': PropTypes.object.isRequired,
  'days': PropTypes.array.isRequired,
  'addAgent': PropTypes.func.isRequired,
  'editAgent': PropTypes.func.isRequired
}

export default AgentModal
