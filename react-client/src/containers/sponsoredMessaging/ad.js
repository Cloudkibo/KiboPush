import React from 'react'
import { saveDraft, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { formatAMPM } from '../../utility/utils'

class Ad extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonActions: ['open website'],
      broadcast: this.props.sponsoredMessage.payload ? this.props.sponsoredMessage.payload : [],
      adName: this.props.sponsoredMessage.adName ? this.props.sponsoredMessage.adName : '',
      scheduleDateTime: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeAdName = this.changeAdName.bind(this)
    this.openScheduleModal = this.openScheduleModal.bind(this)
    this.openCancelScheduleModal = this.openCancelScheduleModal.bind(this)
    this.showScheduledDateTime = this.showScheduledDateTime.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.sponsoredMessage.scheduleDateTime && nextProps.sponsoredMessage.scheduleDateTime !== '') {
      this.setState({scheduleDateTime: new Date(nextProps.sponsoredMessage.scheduleDateTime)})
    } else {
      this.setState({scheduleDateTime: ''})
    }
  }

  changeAdName (e) {
    this.setState({adName: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'adName', e.target.value)
  }

  handleChange (broadcast) {
      this.setState(broadcast)
      this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', broadcast)
  }

  handleBack () {
    this.props.changeCurrentStep('adSet')
  }

  openScheduleModal () {
    this.props.scheduleModal.click()
  }

  openCancelScheduleModal () {
    this.props.cancelScheduleModal.click()
  }

  showScheduledDateTime (datetime) {
    let scheduledDateTime = new Date(datetime)
    return `${scheduledDateTime.toDateString()} at ${formatAMPM(scheduledDateTime)}`
  }

  render () {
    return (
      <div>
        <h5>Step 04:</h5>
        {this.props.sponsoredMessage.status === 'scheduled' &&
        <div>
          <br />
          <span><b>Note:</b> This sponsored Broadcast is scheduled to be sent on {this.showScheduledDateTime(this.props.sponsoredMessage.scheduleDateTime)}</span>
          <button className='btn btn-secondary btn-sm' style={{marginLeft: '10px'}} onClick={this.openCancelScheduleModal}>
            Cancel Schedule
          </button>
          <button className='btn btn-primary btn-sm' style={{marginLeft: '10px'}} onClick={this.openScheduleModal}>
            Edit Schedule
          </button>
        </div>
        }
        <br />
          <span style={{fontWeight: 'normal', marginLeft: '20px'}}>Ad Name:</span>
          <input type='text' className='form-control m-input' placeholder='Enter Ad Name...' onChange={this.changeAdName} value={this.state.adName} style={{borderRadius: '20px', width: '30%', display: 'inline-block', marginLeft: '15px'}} />
          <GenericMessage
            module = 'sponsorMessaging'
            hiddenComponents={['media','audio','file','video']}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            pageId={this.props.sponsoredMessage.pageId}
            buttonActions={this.state.buttonActions} />
        <Footer
          currentStep='ad'
          handleBack={this.handleBack}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    updateSessionTimeStamp: state.sponsoredMessagingInfo.updateSessionTimeStamp
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage,
    saveDraft
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Ad)
