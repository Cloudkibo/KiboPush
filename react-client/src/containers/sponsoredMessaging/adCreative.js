import React from 'react'
import Footer from './footer'
import { updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class adCreative extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonActions: ['open website'],
      broadcast:(this.props.payload)? this.props.payload : [],
      ad_account_id: (this.props.adAccountId) ? this.props.adAccountId : ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleadAccountId = this.handleadAccountId.bind(this)
  }

  handleadAccountId (e) {
    this.setState({ad_account_id: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage,'ad_account_id', e.target.value)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', broadcast)
  }

  render () {
    return (
      <div>
        <div className='col-md-4 col-sm-4 col-lg-4' style={{marginLeft:'17px'}}>
            <label>Ad Account ID</label>
            <input className='form-control m-input m-input--air' value={this.state.ad_account_id} onChange={this.handleadAccountId} />
        </div>
          <GenericMessage
            module = 'sponsorMessaging'
            hiddenComponents={['media','audio','file','video']}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            pageId={this.props.sponsoredMessage.pageId}
            convoTitle='My Ad'
            titleEditable
            buttonActions={this.state.buttonActions} />
            
        <div>
          <Footer page={this.props.page} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage: updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adCreative)
