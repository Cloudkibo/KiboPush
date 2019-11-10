/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import AdCampaign from './adCampaign'
import Adset from './adSet'
import AdCreative from './adCreative'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Tab extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeTab: 'Campaign'
    }
    this.onTabClick = this.onTabClick.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)

    this.onTabClick(this.state.activeTab)
  }
  handleNext (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#Campaign').removeClass('active')
    $('#Adset').removeClass('active')
    $('#AdCreative').removeClass('active')
    if (tab === 'Campaign') {
      $('#tab_2').addClass('active')
      $('#Adset').addClass('active')
      this.setState({activeTab: 'Adset'})
    } else if (tab === 'Adset') {
      $('#tab_3').addClass('active')
      $('#AdCreative').addClass('active')
      this.setState({activeTab: 'AdCreative'})
    }
    console.log('activeTab', this.state.activeTab)

  }

  handleBack (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#Campaign').removeClass('active')
    $('#Adset').removeClass('active')
    $('#AdCreative').removeClass('active')
    $('#Ad').removeClass('active')
    if (tab === 'Adset') {
      $('#tab_1').addClass('active')
      $('#Campaign').addClass('active')
      this.setState({activeTab: 'Campaign'})
    } else if (tab === 'AdCreative') {
      $('#tab_2').addClass('active')
      $('#Adset').addClass('active')
      this.setState({activeTab: 'Adset'})
    }
    console.log('activeTab', this.state.activeTab)

  }

  onTabClick (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#Campaign').removeClass('active')
    $('#Adset').removeClass('active')
    $('#AdCreative').removeClass('active')
    $('#Ad').removeClass('active')
    if (tab === 'Campaign') {
      $('#tab_1').addClass('active')
      $('#Campaign').addClass('active')
      this.setState({activeTab: 'Campaign'})
    } else if (tab === 'Adset') {
      $('#tab_2').addClass('active')
      $('#Adset').addClass('active')
      this.setState({activeTab: 'Adset'})
    } else if (tab === 'AdCreative') {
      $('#tab_3').addClass('active')
      $('#AdCreative').addClass('active')
      this.setState({activeTab: 'AdCreative'})
    }
    console.log('activeTab', this.state.activeTab)

  }
  componentDidMount () {

  }
  render () {
    console.log('this.props.editSponsoredMessage in tabs', this.props.editSponsoredMessage)
    return (
      <div>
        <ul className='nav nav-tabs'>
          <li>
            <a id='Campaign' className='broadcastTabs active'>Ad Campaign</a>
          </li>
          <li>
            <a id='Adset' className='broadcastTabs'>Ad set</a>
          </li>
          <li>
            <a id='AdCreative' className='broadcastTabs'>Create Ad</a>
          </li>
        </ul>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <AdCampaign campaignName={this.props.editSponsoredMessage.campaign_name} page={this.state.activeTab} handleNext={this.handleNext} handleBack={this.handleBack}/>
          </div>
          <div className='tab-pane' id='tab_2'>
            <Adset adSetPayload={this.props.editSponsoredMessage.ad_set_payload} page={this.state.activeTab} handleNext={this.handleNext} handleBack={this.handleBack}/>
          </div>
          <div className='tab-pane' id='tab_3'>
            <AdCreative adAccountId={this.props.editSponsoredMessage.ad_account_id} payload={this.props.editSponsoredMessage.payload} page={this.state.activeTab} handleNext={this.handleNext} handleBack={this.handleBack}/>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in tabs', state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
