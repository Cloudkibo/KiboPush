/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Footer from './footer'
import { updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class adCampaign extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      Campaign_name: ''
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput (e) {
    this.setState({Campaign_name: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'campaign_name', e.target.value)
  }

  render () {
    return (
      <div>
        <label>Set Campaign</label>
        <br/>
        <br/>
          <div>
            <label>Campaign Name:</label>
            <input className='form-control m-input m-input--air' value={this.state.Campaign_name} onChange={this.handleInput} />
          </div>
        <br />
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
export default connect(mapStateToProps, mapDispatchToProps)(adCampaign)
