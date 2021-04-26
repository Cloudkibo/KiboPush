import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'
import WhatsAppDashboard from './smsWhatsAppDashboard/whatsAppDashboard'
import SmsDashboard from './smsWhatsAppDashboard/smsDashboard'
import SuperNumberDashboard from './superNumber/dashboard/dashboard'
import queryString from 'query-string'

class Home extends Component {
  constructor (props, context) {
    super(props, context)
    this.state={
      kiboLiteUrl: window.location.hostname.includes('kibolite'),
      kiboEngageUrl: window.location.hostname.includes('kiboengage')
    }
    this.redirectToSmsConfiguration = this.redirectToSmsConfiguration.bind(this)
  }

  redirectToSmsConfiguration (props) {
    console.log('redirectToSmsConfiguration')
    let queryParams = queryString.parse(props.history.location.search)
    if (queryParams.plan) {
      let temp = queryParams.plan.split(':platform:')
      if (temp.length === 2) {
        queryParams.plan = temp[0]
        queryParams.platform = temp[1]
      }
    }
    console.log(queryParams)
    if (
      queryParams && queryParams.platform === 'sms' && queryParams.plan &&
      props.user.platform !== 'sms' && !props.automated_options.sms
    ) {
      this.props.history.push({
        pathname: '/smsPlansScreen',
        state: {plan: queryParams.plan}
      })
    }
  }
 
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.platform === 'messenger' && nextProps.user.role === 'buyer' && nextProps.user.showIntegrations) {
      this.props.history.push({
        pathname: '/facebookIntegration'
      })
    }
    if (this.state.kiboEngageUrl && nextProps.user && nextProps.user.platform === 'whatsApp' && nextProps.user.currentPlan.unique_ID === 'plan_E') {
      const isStaging = window.location.hostname.includes('skiboengage')
      if (!isStaging) {
        window.location.replace('https://kibochat.cloudkibo.com/')
      } else {
        window.location.replace('https://skibochat.cloudkibo.com/')
      }
    }
    if (nextProps.user && nextProps.automated_options) {
      this.redirectToSmsConfiguration(nextProps)
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
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
