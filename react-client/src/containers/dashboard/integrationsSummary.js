/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadIntegrationsSummary} from '../../redux/actions/dashboard.actions'
import {loadIntegrationsSummaryForBackdoor} from '../../redux/actions/backdoor.actions'
import IconStack from '../../components/Dashboard/IconStackForIntegrations'

class IntegrationsSummary extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      integrationsSummary: [],
      googleSheets: ''
    }

    if (this.props.backdoor) {
      this.props.loadIntegrationsSummaryForBackdoor()
    } else {
      this.props.loadIntegrationsSummary()
    }
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    console.log('in UNSAFE_componentWillReceiveProps of integrationsSummary', nextprops)
    if (nextprops.integrationsSummary && nextprops.integrationsSummary.length > 0) {
      let googleSheets = nextprops.integrationsSummary.filter(integration => integration.integrationId.integrationName === 'Google Sheets')
      let incomingDataCallsCount = googleSheets.reduce(function(prev, cur) {
        return prev + cur.incomingDataCallsCount;
      }, 0)
      let outgoingDataCallsCount = googleSheets.reduce(function(prev, cur) {
        return prev + cur.outgoingDataCallsCount;
      }, 0)
      googleSheets = {
        incomingDataCallsCount: incomingDataCallsCount,
        outgoingDataCallsCount: outgoingDataCallsCount
      }
      this.setState({googleSheets: googleSheets})
    }
  }
  render () {
    if (this.props.integrationsSummary && this.props.integrationsSummary.length > 0) {
      return (
        <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
          <div className='m-portlet m-portlet--full-height '>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>Integrations</h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget21'>
              <div className='row'>
                <div className='col-6'>
                  <IconStack
                    path='/'
                    icon='fa fa-file-excel-o'
                    title='Google Sheets'
                    iconStyle='success'
                    incoming={this.state.googleSheets !== '' ? this.state.googleSheets.incomingDataCallsCount : 0}
                    outgoing={this.state.googleSheets !== '' ? this.state.googleSheets.outgoingDataCallsCount : 0}
                  />
                <div className='m--space-30' ></div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps (state) {
  return {
    integrationsSummary: (state.dashboardInfo.integrationsSummary)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadIntegrationsSummary: loadIntegrationsSummary,
    loadIntegrationsSummaryForBackdoor: loadIntegrationsSummaryForBackdoor
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(IntegrationsSummary)
