/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Setup from './setup'
import OptInActions from './optInActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Tab extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentTab: 'optInActions'
    }
    this.changeTab = this.changeTab.bind(this)
    this.switchSetupState = this.switchSetupState.bind(this)
  }

  changeTab (value) {
    this.setState({currentTab: value})
  }
  switchSetupState (value) {
    this.props.switchSetupState(value)
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist' style={{float: 'none'}}>
          <li className='nav-item m-tabs__item'>
            <a href='#/' className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('optInActions')}>
              Opt-In Actions
            </a>
          </li>
          <li className='nav-item m-tabs__item'>
            { this.props.setupState === 'true'
           ? <a href='#/' className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('setup')}>
              Setup
            </a>
           : <a href='#/'>Setup</a>
           }
          </li>
        </ul>
        <br />
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            {this.state.currentTab === 'setup'
            ? <Setup history={this.props.history} location={this.props.location} />
            : <OptInActions history={this.props.history} location={this.props.location} switchSetupState={this.switchSetupState} jsonAdId={this.props.jsonAdId} />
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerAd: state.messengerAdsInfo.messengerAd
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
