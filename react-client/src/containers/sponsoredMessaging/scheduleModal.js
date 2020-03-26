import React from 'react'
import PropTypes from 'prop-types'

class ScheduleModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      date: '',
      time: ''
    }
    this.changeDate = this.changeDate.bind(this)
    this.changeTime = this.changeTime.bind(this)
    this.getMinDate = this.getMinDate.bind(this)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.dateTime && nextProps.dateTime !== '') {
      // "2020-03-26T06:42:29.928Z"
      let dateTime = new Date(nextProps.dateTime)
      let month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
      let day = ('0' + dateTime.getDate()).slice(-2)
      let date = `${dateTime.getFullYear()}-${month}-${day}`
      let time = `${dateTime.getHours()}:${dateTime.getMinutes()}`
      this.setState({date: date, time: time})
    } else {
      this.setState({date: '', time: ''})
    }
  }
  changeDate (e) {
    this.setState({date: e.target.value})
  }
  changeTime (e) {
    this.setState({time: e.target.value})
  }
  getMinDate () {
    let date = new Date()
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2)
    return `${date.getFullYear()}-${month}-${day}`
  }
  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <p>{this.props.content}</p>
              <div className="form-group m-form__group">
                <input type='date'
                  className="form-control m-input"
                  min={this.getMinDate()}
                  onChange={this.changeDate}
                  style={{display: 'inline', width: '40%'}}
                  value={this.state.date} />
                <span style={{marginLeft: '10px'}}>on</span>
                <input type='time'
                  className="form-control m-input"
                  onChange={this.changeTime}
                  style={{display: 'inline', width: '30%', marginLeft: '10px'}}
                  value={this.state.time} />
              </div>
              <br />
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                onClick={() => this.props.saveSchedule(this.state.date, this.state.time)}
                disabled={this.state.date === '' || this.state.time === ''}>Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ScheduleModal.propTypes = {
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'content': PropTypes.string.isRequired,
  'saveSchedule': PropTypes.func
}

export default ScheduleModal
