import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'
import WhatsAppDashboard from './smsWhatsAppDashboard/whatsAppDashboard'
import SmsDashboard from './smsWhatsAppDashboard/smsDashboard'

import { getuserdetails } from '../redux/actions/basicinfo.actions'
import { browserHistory } from 'react-router'

class Home extends Component {
  componentWillMount () {
    this.props.getuserdetails()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.platform === 'messenger' && nextProps.user.showIntegrations) {
      browserHistory.push({
        pathname: '/facebookIntegration'
      })
    }
  }

 
  render () {
    if(this.props.user && this.props.location.state.isKiboLite) {
      return (
        <Dashboard location={this.props.location} />
      )
    }
    else if (this.props.user && this.props.user.platform === 'sms') {
      return (
        <SmsDashboard location={this.props.location} />
      )
    } else if (this.props.user && this.props.user.platform === 'whatsApp') {
      return (
        <WhatsAppDashboard location={this.props.location} />
      )
    } else {
      return (
        <Dashboard location={this.props.location} />
      )
    }
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
