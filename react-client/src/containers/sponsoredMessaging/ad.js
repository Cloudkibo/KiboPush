import React from 'react'
import { saveDraft, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'

class Ad extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonActions: ['open website'],
      broadcast: this.props.sponsoredMessage.payload ? this.props.sponsoredMessage.payload : [],
      adName: this.props.sponsoredMessage.adName ? this.props.sponsoredMessage.adName : ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeAdName = this.changeAdName.bind(this)
  }

  changeAdName (e) {
    this.setState({adName: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'adName', e.target.value)
  }

  handleChange (broadcast) {
      console.log('handleChange ad', broadcast)
      if (broadcast.newFiles) {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
      } else {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', broadcast)
      }
      this.setState(broadcast)
  }

  handleBack () {
    this.props.changeCurrentStep('adSet')
  }

  render () {
    return (
      <div>
        <h5>Step 04:</h5>
        <br />
          <span style={{fontWeight: 'normal', marginLeft: '20px'}}>Ad Name:</span>
          <input type='text' className='form-control m-input' placeholder='Enter Ad Name...' onChange={this.changeAdName} value={this.state.adName} style={{borderRadius: '20px', width: '30%', display: 'inline-block', marginLeft: '15px'}} />
          <GenericMessage
            newFiles={this.props.sponsoredMessage.newFiles}
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
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage,
    saveDraft
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Ad)
