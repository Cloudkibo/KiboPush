/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { fetchAdAccounts, saveAdAccount, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'

class ad extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedAdAccount: props.sponsoredMessage.adAccountId && props.sponsoredMessage.adAccountId !== '' ? props.sponsoredMessage.adAccountId : ''
    }

    props.fetchAdAccounts()

    this.onAdAccountChange = this.onAdAccountChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  onAdAccountChange (e) {
    this.setState({selectedAdAccount: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in adAccount', nextProps)
    if (nextProps.adAccounts && nextProps.adAccounts.length > 0 ) {
      if (nextProps.sponsoredMessage.adAccountId && nextProps.sponsoredMessage.adAccountId !== '') {
        this.setState({selectedAdAccount: nextProps.sponsoredMessage.adAccountId})
      } else {
        this.setState({selectedAdAccount: nextProps.adAccounts[0].id})
      }
    }
  }

  handleBack () {
    this.props.changeCurrentStep('adSet')
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
        <Footer
          currentStep='ad'
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
export default connect(mapStateToProps, mapDispatchToProps)(ad)
