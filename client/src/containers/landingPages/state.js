/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tabs from './tabs'

class State extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeTab: this.props.currentTab
    }
    this.setActiveTab = this.setActiveTab.bind(this)
  }
  setActiveTab (tab) {
    this.setState({activeTab: tab})
    this.props.setCurrentTab(tab)
  }
  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        <Tabs activeTab={this.state.activeTab} setActiveTab={this.setActiveTab} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(State)
