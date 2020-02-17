/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { fetchAdAccounts, saveAdAccount, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'

class adAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedAdAccount: props.sponsoredMessage.adAccountId && props.sponsoredMessage.adAccountId !== '' ? props.sponsoredMessage.adAccountId : ''
    }

    props.fetchAdAccounts()

    this.onAdAccountChange = this.onAdAccountChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  onAdAccountChange (e) {
    this.setState({selectedAdAccount: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.adAccounts && nextProps.adAccounts.length > 0 ) {
      if (nextProps.sponsoredMessage.adAccountId && nextProps.sponsoredMessage.adAccountId !== '') {
        this.setState({selectedAdAccount: nextProps.sponsoredMessage.adAccountId})
      } else {
        this.setState({selectedAdAccount: nextProps.adAccounts[0].id})
      }
    }
  }

  handleNext () {
    if (this.state.selectedAdAccount === '') {
      this.props.msg.error('Please select an Ad Account')
    } else {
      this.props.saveAdAccount(this.props.sponsoredMessage._id, {adAccountId: this.state.selectedAdAccount}, this.handleResponse)
    }
  }

  handleResponse (res) {
    if (res.status === 'success') {
      this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'adAccountId', this.state.selectedAdAccount)
      this.props.changeCurrentStep('campaign')
    } else {
      this.props.msg.error(res.payload)
    }
  }

  render () {
    return (
      <div>
        <h5>Step 01:</h5>
        <br />
        <span>Select the Ad Account from which you want to create Sponsored Message</span>
        <br /><br />
        <select className='form-control' value={this.state.selectedAdAccount} onChange={this.onAdAccountChange} style={{width: '50%'}}>
          {
            this.props.adAccounts && this.props.adAccounts.length > 0 && this.props.adAccounts.map((adAccount, i) => (
              <option key={adAccount.id} value={adAccount.id} selected={adAccount.id === this.state.selectedAdAccount}>{adAccount.name}</option>
            ))
          }
        </select>
        <Footer
          currentStep='adAccount'
          handleNext={this.handleNext}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    adAccounts: state.sponsoredMessagingInfo.adAccounts
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAdAccounts,
    saveAdAccount,
    updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adAccount)
