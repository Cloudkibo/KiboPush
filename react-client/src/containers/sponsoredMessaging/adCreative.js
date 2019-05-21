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
      Campaign_name: ''
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleInput (e) {
    this.setState({Campaign_name: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'campaign_name', e.target.value)
  }

  handleChange (state) {
    this.setState(state)
  }

  render () {
    return (
      <div>
          <GenericMessage
                            broadcast={this.state.broadcast}
                            handleChange={this.handleChange}
                            pageId={'this.state.pageId.pageId'}
                            convoTitle='Ad'
                            // buttonActions={this.state.buttonActions} 
                            />

        <Footer page={this.props.page} Campaign_name={this.state.Campaign_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
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
