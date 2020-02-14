/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { fetchCampaigns } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'

class adAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      campaignType: 'existing',
      selectedCampaign: '',
      campaignName: '',
      disableNext: true
    }

    props.fetchCampaigns()

    this.handleCampaignType = this.handleCampaignType.bind(this)
    this.changeCampaignName = this.changeCampaignName.bind(this)
    this.selectCampaign = this.selectCampaign.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)

  }

  handleNext () {
    if (this.state.campaignType === 'new' && this.state.campaignName === '') {
      this.props.msg.error('Please provide a campaign Name')
    } else if (this.state.campaignType === 'existing' && this.state.selectedCampaign === '') {
      this.props.msg.error('Please select a campaign')
    } else {
      this.props.changeCurrentStep('adSet')
    }
  }

  handleBack () {
    this.props.changeCurrentStep('adAccount')
  }

  handleCampaignType (e) {
    console.log('handleCampaignType', e.target.value)
    this.setState({campaignType: e.target.value})
  }

  changeCampaignName (e) {
    this.setState({campaignName: e.target.value})
  }

  selectCampaign (e) {
    this.setState({selectedCampaign: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in adAccount', nextProps)
    if (nextProps.campaigns && nextProps.campaigns.length > 0) {
      this.setState({selectedCampaign: nextProps.campaigns[0].id})
    }
  }

  render () {
    return (
      <div>
        <h5>Step 02:</h5>
        <br />
          <div className='radio-buttons' style={{paddingLeft: '20px'}}>
            <span className='radio'>
              <input
                type='radio'
                value='existing'
                onChange={this.handleCampaignType}
                checked={this.state.campaignType === 'existing'} />
                Select Existing Campaign
              <span />
              <br /><br />
              {this.state.campaignType === 'existing' &&
              <div>
                {this.props.campaigns && this.props.campaigns.length > 0
                ? <select className='form-control' value={this.state.selectedCampaign} onChange={this.selectCampaign} style={{width: '50%'}}>
                {
                  this.props.campaigns.map((campaign, i) => (
                    <option key={campaign.id} value={campaign.id} selected={campaign.id === this.state.selectedCampaign}>{campaign.name}</option>
                  ))
                }
              </select>
              : <span style={{color: 'red'}}>You do not have any existing campaigns. Please create a new one.</span>
              }
              <br />
            </div>
            }
            </span>
            <span className='radio'>
              <input
                type='radio'
                value='new'
                onChange={this.handleCampaignType}
                checked={this.state.campaignType === 'new'} />
                Create New Campaign
              <span />
              <br /><br />
              {this.state.campaignType === 'new' &&
                <div className='form-group m-form__group'>
                  <input type='text' className='form-control m-input' placeholder='Enter Campaign Name...' onChange={this.changeCampaignName} style={{borderRadius: '20px', width: '50%'}} />
                </div>
              }
            </span>
          </div>
        <Footer
          currentStep='campaign'
          handleNext={this.handleNext}
          handleBack={this.handleBack}
          disableNext={this.state.disableNext}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    campaigns: state.sponsoredMessagingInfo.campaigns
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchCampaigns
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adAccount)
