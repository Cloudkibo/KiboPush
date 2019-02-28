import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'
import { getuserdetails } from '../redux/actions/basicinfo.actions'
import { browserHistory } from 'react-router'

class Home extends Component {
  componentWillMount () {
    this.props.getuserdetails()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.showIntegrations) {
      browserHistory.push({
        pathname: '/facebookIntegration'
      })
    }
  }

  render () {
    return (
      <Dashboard location={this.props.location} />
    )
  }
}

function mapStateToProps (state) {
  return {
    connectInfo: (state.basicInfo),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
