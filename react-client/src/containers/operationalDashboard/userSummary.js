import React from 'react'
import IconStack from '../../components/Dashboard/IconStack'


class UserSummary extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      typingInterval: 1000,
      days: '10'
    }
    this.onDaysChange = this.onDaysChange.bind(this)
  }
  onDaysChange (e) {
    this.setState({
      days: e.target.value
    })
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`userSummaryFilter`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
          this.props.onDaysChange(this.state.days)
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }
  render() {
    return (
     <div className='row' style={{height: '200px'}}>
       <div className='col-12' style={{height: '200px'}}>
          <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    User's Summary
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <div style={{display: 'flex', float: 'right'}}>
                <span htmlFor='example-text-input' className='col-form-label'>
                  Show records for last:&nbsp;&nbsp;
                </span>
                <div style={{width: '200px'}}>
                  <input placeholder='Enter number of days' id='userSummaryFilter' type='number' min='1' step='1' value={this.state.days} className='form-control' onChange={this.onDaysChange} />
                </div>
                <span htmlFor='example-text-input' className='col-form-label'>
                &nbsp;&nbsp;days
                </span>
              </div>
            </div>
          </div>
          <div className='m-portlet__body'>
          { (this.props.userSummary)
            ? <div className='row'>
              <div className='col-md-6'>
                <IconStack
                  icon='fa fa-users'
                  title={this.props.userSummary.subscribersCount}
                  subtitle='Subscribers'
                  iconStyle='primary'
                  id='subscribers'
                />
              </div>
              <div className='col-md-6'>
                <IconStack
                  icon='fa fa-send-o'
                  title={this.props.userSummary.messagesCount}
                  subtitle='Messages Count'
                  iconStyle='warning'
                  id='messagesSent'
                />
              </div>
            </div>
            : <div className='row'>
                <div className='col-12'>No data to display </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default UserSummary
