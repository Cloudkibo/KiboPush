import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'
import WhatsAppDashboard from './smsWhatsAppDashboard/whatsAppDashboard'
import SmsDashboard from './smsWhatsAppDashboard/smsDashboard'
import SuperNumberDashboard from './superNumber/dashboard'

class Home extends Component {
  constructor (props, context) {
    super(props, context)
    this.state={
      kiboLiteUrl: window.location.hostname.includes('kibolite'),
      kiboEngageUrl: window.location.hostname.includes('kiboengage')
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.platform === 'messenger' && nextProps.user.role === 'buyer' && nextProps.user.showIntegrations) {
      this.props.history.push({
        pathname: '/facebookIntegration'
      })
    }
    if (this.state.kiboEngageUrl && nextProps.user.platform === 'whatsApp' && nextProps.user.currentPlan.unique_ID === 'plan_E') {
      const isStaging = window.location.hostname.includes('skiboengage')
      if (!isStaging) {
        window.location.replace('https://kibochat.cloudkibo.com/')
      } else {
        window.location.replace('https://skibochat.cloudkibo.com/')
      }
    }
  }

  render () {
    if(this.props.user && this.state.kiboLiteUrl) {
      return (
        <Dashboard location={this.props.location} history={this.props.history} />
      )
    }
    else if (this.props.user && this.props.user.platform === 'sms') {
      return (
        <SmsDashboard location={this.props.location} history={this.props.history} />
      )
    } else if (this.props.user && this.props.user.platform === 'whatsApp') {
      if (this.props.user.plan.whatsappSuperNumber) {
        return (
          <SuperNumberDashboard location={this.props.location} history={this.props.history} />
        )
      } else {
        return (
        <WhatsAppDashboard location={this.props.location} history={this.props.history} />
        )
      }
    } else if (this.props.user && this.props.user.platform === 'messenger') {
      return (
        <Dashboard location={this.props.location} history={this.props.history} />
      )
    } else {
      return null
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
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
