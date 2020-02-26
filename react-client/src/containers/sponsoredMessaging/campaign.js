/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { fetchCampaigns, saveCampaign, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'

class campaign extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      campaignType: props.sponsoredMessage.campaignType && props.sponsoredMessage.campaignType !== '' ? props.sponsoredMessage.campaignType : 'existing',
      selectedCampaign: props.sponsoredMessage.campaignId && props.sponsoredMessage.campaignId !== '' ? props.sponsoredMessage.campaignId : '',
      campaignName: props.sponsoredMessage.campaignName && props.sponsoredMessage.campaignName !== '' ? props.sponsoredMessage.campaignName : '',
    }

    props.fetchCampaigns(props.sponsoredMessage.adAccountId)
    this.handleCampaignType = this.handleCampaignType.bind(this)
    this.changeCampaignName = this.changeCampaignName.bind(this)
    this.selectCampaign = this.selectCampaign.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleResponse = this.handleResponse.bind(this)

  }

  handleNext () {
    if (this.state.campaignType === 'new') {
      if (this.state.campaignName === '') {
        this.props.msg.error('Please provide a campaign Name')
      } else {
        if (this.state.campaignName === this.props.sponsoredMessage.campaignName) {
          this.props.changeCurrentStep('adSet')
        } else {
          this.props.saveCampaign({_id: this.props.sponsoredMessage._id, type: this.state.campaignType, name: this.state.campaignName, adAccountId: this.props.sponsoredMessage.adAccountId}, this.handleResponse)
        }
      }
    } else if (this.state.campaignType === 'existing') {
      if (this.state.selectedCampaign === '') {
        this.props.msg.error('Please select a campaign')
      } else {
        this.props.saveCampaign({_id: this.props.sponsoredMessage._id, type: this.state.campaignType, id: this.state.selectedCampaign}, this.handleResponse)
      }
    }
  }

  handleResponse (res) {
    if (res.status === 'success') {
      if (this.state.campaignType === 'existing') {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, '', '', {campaignType: this.state.campaignType, campaignId: res.payload})
      } else {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, '', '', {campaignType: this.state.campaignType, campaignName: this.state.campaignName, campaignId: res.payload})
      }
      this.props.changeCurrentStep('adSet')
    } else {
      this.props.msg.error(res.payload)
    }
  }

  handleBack () {
    this.props.changeCurrentStep('adAccount')
  }

  handleCampaignType (e) {
    this.setState({campaignType: e.target.value})
  }

  changeCampaignName (e) {
    this.setState({campaignName: e.target.value})
  }

  selectCampaign (e) {
    this.setState({selectedCampaign: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.campaigns && nextProps.campaigns.length > 0) {
      if (nextProps.sponsoredMessage.campaignId && nextProps.sponsoredMessage.campaignId !== '') {
        this.setState({selectedCampaign: nextProps.sponsoredMessage.campaignId, campaignType: nextProps.sponsoredMessage.campaignType})
      } else {
        this.setState({selectedCampaign: nextProps.campaigns[0].id})
      }
    }
    if (nextProps.sponsoredMessage.campaignType === 'new') {
      this.setState({campaignType: nextProps.sponsoredMessage.campaignType, campaignName: nextProps.sponsoredMessage.campaignName})
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
              : <div><span style={{color: 'red'}}>You do not have any existing campaigns. Please create a new one.</span>
                <br />
              </div>
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
                  <input type='text' className='form-control m-input' placeholder='Enter Campaign Name...' value={this.state.campaignName} onChange={this.changeCampaignName} style={{borderRadius: '20px', width: '50%'}} />
                </div>
              }
            </span>
          </div>
        <Footer
          currentStep='campaign'
          handleNext={this.handleNext}
          handleBack={this.handleBack}
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
    fetchCampaigns,
    saveCampaign,
    updateSponsoredMessage

  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(campaign)
