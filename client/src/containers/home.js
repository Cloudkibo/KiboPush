import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//  import Responsive from '../components/sidebar/responsive'
import Dashboard from './dashboard/dashboard'
//  import HeaderResponsive from '../components/header/headerResponsive'

class Home extends Component {
  render () {
    return (
      <Dashboard />
    )
  }
}

function mapStateToProps (state) {
  return {
    connectInfo: (state.basicInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
