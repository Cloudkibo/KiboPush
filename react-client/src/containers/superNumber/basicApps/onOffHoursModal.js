import React from "react"
import PropTypes from 'prop-types'

class onOffHoursModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      onlineHours: this.props.onOffHours
    }
    this.onSave = this.onSave.bind(this)
    this.handleStartTime = this.handleStartTime.bind(this)
    this.handleEndTime = this.handleEndTime.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.onOffHours) {
      this.setState({
        onlineHours: nextProps.onOffHours
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
    return onlineHours
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
    this.props.saveOnOffHours(this.state.onOffHours)
  }

  render () {
    return (
      <div className="modal-body">
        <form onSubmit={this.onSave} style={{height: '500px', overflowX: 'hidden', overflowY: 'scroll'}}>
          <div className='m-form'>
              <span>
                Set your store's On/Off hours as per the availability of your agents and their Working hours. By default, hours are set from 12:00 AM to 11:59 PM which means your agents are active all the time.
              </span>
            {this.props.days.map(day => (
              <div key={day} className='form-group m-form__group'>
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
            <button onClick={this.onSave} className="btn btn-primary">Save</button>
        </div>
      </div>
      </div>
    )
  }
}

onOffHoursModal.propTypes = {
  'onOffHours': PropTypes.object.isRequired,
  'days': PropTypes.array.isRequired,
  'saveOnOffHours': PropTypes.func.isRequired
}

export default onOffHoursModal
