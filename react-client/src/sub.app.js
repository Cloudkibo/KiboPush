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
import MODAL from './components/extras/modal'
import AlertContainer from 'react-alert'
import HEADER from './components/header/header'
import { getLandingPage } from './utility/utils'
import { getHiddenHeaderRoutes, getWhiteHeaderRoutes } from './utility/utils'
import { validateUserAccessToken, isFacebookConnected } from './redux/actions/basicinfo.actions'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message_alert: null,
      path: '/',
      showContent: (auth.getToken() !== undefined && auth.getToken() !== ''),
      headerProps: {}
    }
    this.handleDemoSSAPage = this.handleDemoSSAPage.bind(this)
    this.onNotificationClick = this.onNotificationClick.bind(this)
    this.setPathAndHeaderProps = this.setPathAndHeaderProps.bind(this)
    this.redirectToConnectPage = this.redirectToConnectPage.bind(this)
    this.checkUserAccessToken = this.checkUserAccessToken.bind(this)
    this.checkFacebookConnected = this.checkFacebookConnected.bind(this)
    this.uUserDetails = this.callbackUserDetails.bind(this)
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
    
    if (this.props.history.location.pathname.toLowerCase() === '/demossa') {
      this.handleDemoSSAPage()
    } else if (this.props.history.location.pathname.toLowerCase() !== '/integrations/zoom') {
      if (
        !this.props.history.location.pathname.startsWith('/liveChat') &&
        getCurrentProduct() === 'KiboChat'
      ) {
        this.props.history.push({
          pathname: getLandingPage(payload.user.platform),
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
      } else if (nextProps.user.platform === 'sms' && nextProps.automated_options && !nextProps.automated_options.twilio && nextProps.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations',
          state: 'sms'
        })
      } else if (nextProps.user.platform === 'whatsApp' && nextProps.automated_options && !nextProps.automated_options.whatsApp && nextProps.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations',
          state: 'whatsApp'
        })
      }
    }
    if (nextProps.socketData && this.props.history.location.pathname !== '/liveChat') {
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
    if (!this.state.showContent) {
      let interval = setInterval(() => {
        if (auth.getToken() !== undefined && auth.getToken() !== '') {
          window.location.reload()
          clearInterval(interval)
        }
      }, 1000)
    }
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
        {
          this.state.showContent &&
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
            {
              auth.loggedIn() &&
              <Sidebar history={this.props.history} location={this.props.location} />
            }
            {this.props.children}
          </div>
        }
      </div>
    )
  }
}

App.propTypes = {
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
    loadMyPagesListNew,
    setMessageAlert,
    updateLiveChatInfo,
    clearSocketData,
    validateUserAccessToken,
    isFacebookConnected
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
