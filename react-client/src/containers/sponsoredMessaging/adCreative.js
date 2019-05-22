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
      Campaign_name: '',
      buttonActions: ['open website'],
      broadcast:[],
      ad_account_id: ''
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleadAccountId = this.handleadAccountId.bind(this)
  }

  handleadAccountId (e) {
    this.setState({ad_account_id: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage,'ad_account_id', e.target.value)
  }

  handleInput (e) {
    this.setState({Campaign_name: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'campaign_name', e.target.value)
  }

  handleChange (state) {
    this.setState(state)
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', this.state.broadcast[0])
    console.log('gen states',this.state)
  }

  render () {
    return (
      <div>
        <div className='col-md-4 col-sm-4 col-lg-4' style={{marginLeft:'17px'}}>
            <label>Ad Account ID</label>
            <input className='form-control m-input m-input--air' value={this.state.ad_account_id} onChange={this.handleadAccountId} />
        </div>
          <GenericMessage
            hiddenComponents={['media','audio','file','video']}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            pageId={this.props.sponsoredMessage.pageId}
            convoTitle='My Ad'
            titleEditable
            buttonActions={this.state.buttonActions} />
        <div>
          <Footer page={this.props.page} Campaign_name={this.state.Campaign_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
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
