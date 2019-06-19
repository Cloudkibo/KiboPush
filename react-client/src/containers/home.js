import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'
import WhatsAppDashboard from './smsWhatsAppDashboard/whatsAppDashboard'
import SmsDashboard from './smsWhatsAppDashboard/smsDashboard'

import { getuserdetails } from '../redux/actions/basicinfo.actions'
import { browserHistory } from 'react-router'

class Home extends Component {
  constructor (props, context) {
    super(props, context)
    this.state={
      kiboLiteUrl: window.location.hostname.includes('kibolite')
    }

  }
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
  componentDidMount() {
    console.log('this.props.location.state.isKiboLite in did mount', this.props.location.state)
  }


  render () {
    console.log('this.props.location.state.isKiboLite', this.props.location.state)
    if(this.props.user && this.state.kiboLiteUrl) {
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
