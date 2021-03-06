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
      campaign_name: this.props.campaignName ? this.props.campaignName : ''
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput (e) {
    this.setState({campaign_name: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'campaign_name', e.target.value)
    this.props.onEdit()
  }

  render () {
    return (
      <div>
        <div className="col-md-6 col-lg-6 col-sm-6">
        <label>Set Campaign</label>
        <br/>
        <br/>
          <div>
            <label>Campaign Name:</label>
            <input className='form-control m-input m-input--air' value={this.state.campaign_name} onChange={this.handleInput} />
          </div>
        <br />
        </div>
        <Footer page={this.props.page} campaign_name={this.state.campaign_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
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
