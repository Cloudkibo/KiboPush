import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'
import $ from 'jquery'
import { getuserdetails, switchToBasicPlan } from './redux/actions/basicinfo.actions'
import { loadMyPagesListNew } from './redux/actions/pages.actions'
import { setMessageAlert } from './redux/actions/notifications.actions'
import { updateLiveChatInfo } from './redux/actions/livechat.actions'
import { clearSocketData } from './redux/actions/socket.actions'
import { joinRoom } from './utility/socketio'
import { handleSocketEvent } from './handleSocketEvent'
import Notification from 'react-web-notification'
import { getCurrentProduct } from './utility/utils'
import MODAL from './components/extras/modal'
import AlertContainer from 'react-alert'
import HEADER from './components/header/header'
import { getLandingPage } from './utility/utils'
import { getHiddenHeaderRoutes, getWhiteHeaderRoutes } from './utility/utils'
import { validateUserAccessToken, isFacebookConnected, fetchUsageInfo, modifyUserDetails } from './redux/actions/basicinfo.actions'
import { fetchCompanyPreferences } from './redux/actions/settings.actions'
import { fetchCompanyAddOns } from './redux/actions/addOns.actions'

class SubApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message_alert: null,
      path: '/',
      headerProps: {},
      resourceAlert: false
    }
    this.handleDemoSSAPage = this.handleDemoSSAPage.bind(this)
    this.onNotificationClick = this.onNotificationClick.bind(this)
    this.setPathAndHeaderProps = this.setPathAndHeaderProps.bind(this)
    this.redirectToConnectPage = this.redirectToConnectPage.bind(this)
    this.checkUserAccessToken = this.checkUserAccessToken.bind(this)
    this.checkFacebookConnected = this.checkFacebookConnected.bind(this)
    this.callbackUserDetails = this.callbackUserDetails.bind(this)
    this.checkResourceConsumption = this.checkResourceConsumption.bind(this)
    this.handleCompanyAddOns = this.handleCompanyAddOns.bind(this)
    this.checkTrialPeriod = this.checkTrialPeriod.bind(this)
    this.getTrialModalContent = this.getTrialModalContent.bind(this)
    this.onPurchaseSubscription = this.onPurchaseSubscription.bind(this)

    props.getuserdetails(joinRoom, this.callbackUserDetails)
  }

  callbackUserDetails (payload) {
    this.props.loadMyPagesListNew({
      last_id: 'none',
      number_of_records: 10,
      first_page: 'first',
      filter: false,
      filter_criteria: { search_value: '' }
    }, this.redirectToConnectPage)
    this.props.validateUserAccessToken(this.checkUserAccessToken)
    this.props.isFacebookConnected(this.checkFacebookConnected)
    this.props.fetchCompanyPreferences()
    this.props.fetchUsageInfo(this.checkResourceConsumption)
    this.props.fetchCompanyAddOns(this.handleCompanyAddOns)

    if (this.props.history.location.pathname.toLowerCase() === '/demossa') {
      this.handleDemoSSAPage()
    } else if (this.props.history.location.pathname.toLowerCase() !== '/integrations/zoom') {
      if (
        !this.props.history.location.pathname.startsWith('/liveChat') &&
        getCurrentProduct() === 'KiboChat'
      ) {
        this.props.history.push({
          pathname: getLandingPage(payload.user.platform, payload.user),
          state: {obj: {_id: 1}}
        })
      } else if (getCurrentProduct() === 'KiboEngage') {
        this.props.history.push({
          pathname: '/',
          state: {obj: {_id: 1}}
        })
      }
    }
  }

  checkFacebookConnected(response) {
    if (this.props.user && this.props.user.role !== 'buyer' && !response.payload.buyerInfo.connectFacebook) {
      this.props.history.push({
        pathname: '/sessionInvalidated',
        state: { session_inavalidated: false, role: response.payload.role, buyerInfo: response.payload.buyerInfo }
      })
    }
  }

  checkUserAccessToken(response) {
    console.log('checkUserAccessToken response', response)
    if (response.status === 'failed' && response.payload.error &&
      response.payload.error.code === 190 && this.props.user && this.props.user.platform === 'messenger') {
      if (this.props.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/sessionInvalidated',
          state: { session_inavalidated: true, role: 'buyer' }
        })
      } else {
        this.props.history.push({
          pathname: '/sessionInvalidated',
          state: { session_inavalidated: true, role: this.props.user.role, buyerInfo: response.payload.buyerInfo }
        })
      }
    }
  }

  redirectToConnectPage(payload) {
    if (payload.count !== 'undefined' && payload.count < 1 && this.props.user.platform === 'messenger') {
      this.props.history.push({
        pathname: '/addfbpages'
      })
    }
  }

  handleDemoSSAPage() {
    const sidebar = document.getElementById('sidebarDiv')
    sidebar.parentNode.removeChild(sidebar)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
  }

  checkResourceConsumption (res) {
    if (res.status === 'success') {
      const { planUsage, companyUsage } = res.payload
      if (planUsage && companyUsage && planUsage.messages <= companyUsage.messages) {
        this.setState({resourceAlert: true})
      }
    }
  }

  handleCompanyAddOns (res) {
    if (res.status === 'success') {
      const companyAddOns = res.payload
      const permissions  []
      for (let i = 0; i < companyAddOns.length; i++) {
        if (companyAddOns[i].permissions && companyAddOns[i].permissions.length > 0) {
          permissions = [...permissions, ...companyAddOns[i].permissions]
        }
      }
      let user = this.props.user
      for (let j = 0; j < permissions.length; j++) {
        if (user.plan[permissions[i]] === false) {
          user.plan[permissions[i]] = true
        }
      }
      this.props.modifyUserDetails(user)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.message_alert) {
      nextProps.setMessageAlert(null)
    }
    this.setState({
      message_alert: nextProps.message_alert
    })
    if (nextProps.user) {
      if (!nextProps.user.emailVerified) {
        this.props.history.push({
          pathname: '/resendVerificationEmail'
        })
      } else if ((!nextProps.user.platform || nextProps.user.platform === '') && nextProps.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations'
        })
      } else if ((!nextProps.user.platform || nextProps.user.platform === '') && nextProps.user.role !== 'buyer') {
        this.props.history.push({
          pathname: '/sessionInvalidated',
          state: { session_inavalidated: false }
        })
      } else if (nextProps.user.platform === 'messenger' && (!nextProps.user.facebookInfo || !nextProps.user.connectFacebook) && nextProps.user.role === 'buyer') {
          this.props.history.push({
            pathname: '/integrations'
          })
      } else if (nextProps.user.platform === 'sms' && nextProps.automated_options && !nextProps.automated_options.sms && nextProps.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations',
          state: 'sms'
        })
      } else if (nextProps.user.platform === 'whatsApp' && nextProps.automated_options &&
      !nextProps.automated_options.whatsApp && nextProps.user.role === 'buyer' && !nextProps.user.plan.whatsappSuperNumber) {
        this.props.history.push({
          pathname: '/integrations',
          state: 'whatsApp'
        })
      }
    }
    if (nextProps.socketData && !this.props.history.location.pathname.startsWith('/liveChat')) {
      handleSocketEvent(
        nextProps.socketData,
        nextProps,
        nextProps.updateLiveChatInfo,
        nextProps.user,
        nextProps.clearSocketData
      )
    }
  }

  setPathAndHeaderProps(path) {
    if (auth.loggedIn() && getHiddenHeaderRoutes().indexOf(path) === -1) {
      this.setState({ headerProps: {}, path })
    } else if (getWhiteHeaderRoutes().indexOf(path) > -1) {
      this.setState({
        headerProps: {
          skin: this.props.isMobile ? 'dark' : 'white',
          showToggleSidebar: false,
          showHeaderMenu: false,
          showHeaderTopbar: true,
          showSelectPlatform: false,
          showPlanPermissions: false,
          showNotifcations: false,
          showQuickActions: false,
          showAppChooser: true,
          showDocumentation: true
        },
        path
      })
    }
  }

  setPathAndHeaderProps(path) {
    if (auth.loggedIn() && getHiddenHeaderRoutes().indexOf(path) === -1) {
      this.setState({ headerProps: {}, path })
    } else if (getWhiteHeaderRoutes().indexOf(path) > -1) {
      this.setState({
        headerProps: {
          skin: this.props.isMobile ? 'dark' : 'white',
          showToggleSidebar: false,
          showHeaderMenu: false,
          showHeaderTopbar: true,
          showSelectPlatform: false,
          showPlanPermissions: false,
          showNotifcations: false,
          showQuickActions: false,
          showAppChooser: true,
          showDocumentation: true
        },
        path
      })
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      this.setPathAndHeaderProps(location.pathname)
      if (!this.isWizardOrLogin(location.pathname)) {
        /* eslint-disable */
        if ($('#sidebarDiv')) {
          $('#sidebarDiv').removeClass('hideSideBar')
        }
        /* eslint-enable */
      }
    })
  }

  checkTrialPeriod() {
    if (this.props.history.location.pathname.toLowerCase() !== '/settings') {
      if (this.props.user &&
        this.props.user.trialPeriod &&
        this.props.user.trialPeriod.status &&
        new Date(this.props.user.trialPeriod.endDate) < new Date()
      ) {
        this.refs._open_trial_modal.click()
      }
    }
  }

  getTrialModalContent() {
    return (
      <div>
        <p>Your trial period has ended. If you wish to continue using the Premium plan, we suggest you to kindly purchase its subscription. Else, you can choose to switch to our Basic (free) plan.</p>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '5px' }}>
            <button className='btn btn-secondary' onClick={this.props.switchToBasicPlan} data-dismiss='modal'>
              Switch to Basic Plan
            </button>
          </div>
          <div style={{ display: 'inline-block', padding: '5px' }}>
            <button onClick={this.onPurchaseSubscription} className='btn btn-primary' data-dismiss='modal'>
              Purchase Subscription
            </button>
          </div>
        </div>
      </div>
    )
  }

  onPurchaseSubscription() {
    this.refs._open_trial_modal.click()
    this.props.history.push({
      pathname: '/settings',
      state: 'payment_methods'
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  isWizardOrLogin(path) {
    if ([
      '/addPageWizard',
      '/inviteUsingLinkWizard',
      '/greetingTextWizard',
      '/welcomeMessageWizard',
      '/autopostingWizard',
      '/menuWizard',
      '/responseMethods',
      '/paymentMethodsWizard',
      '/finish',
      '/resendVerificationEmail',
      '/connectFb',
      '/sessionInvalidated',
      '/addfbpages',
      '/chatbots/configure',
      '/configureChatbot',
      '/configureChatbotNew',
      '/chatbotAnalytics',
      '/integrations'
    ].includes(path)) {
      return true
    }
    return false
  }

  onNotificationClick() {
    window.focus()
    this.props.history.push({
      pathname: '/liveChat',
      state: { subscriber_id: this.props.socketData.payload.subscriber_id }
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    if (this.refs._open_trial_modal) {
      this.checkTrialPeriod()
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <button
          style={{ display: 'none' }}
          ref='_open_trial_modal'
          data-target='#_trial_period'
          data-backdrop="static"
          data-keyboard="false"
          data-toggle='modal'
        />
        <MODAL
          id='_trial_period'
          title='Trial Period Ended'
          content={this.getTrialModalContent()}
        />
        {
          this.state.message_alert && !this.state.message_alert.muteNotification && this.state.message_alert.agentId === this.props.user._id && this.props.user.platform === this.state.message_alert.platform &&
          <Notification
            title='Message Alert'
            onClick={this.onNotificationClick}
            options={{
              body: this.state.message_alert.message,
              lang: 'en',
              dir: 'ltr',
              icon: this.state.message_alert.subscriber ? this.state.message_alert.subscriber.profilePic : ''
            }}
          />
        }
        <HEADER
          alertMsg={this.msg}
          history={this.props.history}
          location={this.props.location}
          {...this.state.headerProps}
        />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          {
            auth.loggedIn() &&
            <Sidebar history={this.props.history} location={this.props.location} />
          }
          { this.props.children }
        </div>
        {
          this.state.resourceAlert &&
          <div style={{position: 'fixed', bottom: '0px', paddingLeft: '255px', width: '100%'}}>
            <div style={{margin: '10px'}} className="alert alert-danger alert-dismissible fade show" role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
              You have consumed the resources for current billing cycle (month) and you won't be able to send any more messages. Your resources will be reset starting next billing cycle (month)
            </div>
          </div>
        }
      </div>
    )
  }
}

SubApp.propTypes = {
  children: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    isMobile: (state.basicInfo.isMobile),
    message_alert: (state.notificationsInfo.message_alert),
    allChatMessages: (state.liveChat.allChatMessages),
    socketData: (state.socketInfo.socketData),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      getuserdetails,
      switchToBasicPlan,
      setMessageAlert,
      updateLiveChatInfo,
      clearSocketData,
      loadMyPagesListNew,
      validateUserAccessToken,
      isFacebookConnected,
      fetchCompanyPreferences,
      fetchUsageInfo,
      fetchCompanyAddOns,
      modifyUserDetails
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubApp)
