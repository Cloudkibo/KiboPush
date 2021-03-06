import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'
import $ from 'jquery'
import { getuserdetails } from './redux/actions/basicinfo.actions'
import { loadMyPagesListNew } from './redux/actions/pages.actions'
import { setMessageAlert } from './redux/actions/notifications.actions'
import { updateLiveChatInfo } from './redux/actions/livechat.actions'
import { clearSocketData } from './redux/actions/socket.actions'
import { joinRoom } from './utility/socketio'
import { handleSocketEvent } from './handleSocketEvent'
import Notification from 'react-web-notification'
import { getCurrentProduct } from './utility/utils'
import AlertContainer from 'react-alert'
import HEADER from './components/header/header'
import { getLandingPage } from './utility/utils'
import { getHiddenHeaderRoutes, getWhiteHeaderRoutes } from './utility/utils'
import { validateUserAccessToken, isFacebookConnected } from './redux/actions/basicinfo.actions'
import { fetchCompanyPreferences } from './redux/actions/settings.actions'

class SubApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message_alert: null,
      path: '/',
      headerProps: {}
    }
    this.handleDemoSSAPage = this.handleDemoSSAPage.bind(this)
    this.onNotificationClick = this.onNotificationClick.bind(this)
    this.setPathAndHeaderProps = this.setPathAndHeaderProps.bind(this)
    this.redirectToConnectPage = this.redirectToConnectPage.bind(this)
    this.checkUserAccessToken = this.checkUserAccessToken.bind(this)
    this.checkFacebookConnected = this.checkFacebookConnected.bind(this)
    this.callbackUserDetails = this.callbackUserDetails.bind(this)

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

  handleDemoSSAPage () {
    const sidebar = document.getElementById('sidebarDiv')
    sidebar.parentNode.removeChild(sidebar)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.message_alert) {
      nextProps.setMessageAlert(null)
    }
    if (nextProps.user) {
      if (!nextProps.user.emailVerified) {
        this.props.history.push({
          pathname: '/resendVerificationEmail'
        })
      } else if ((!nextProps.user.platform  || nextProps.user.platform === '') && nextProps.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations'
        })
      }  else if ((!nextProps.user.platform  || nextProps.user.platform === '') && nextProps.user.role !== 'buyer') {
        this.props.history.push({
          pathname: '/sessionInvalidated',
          state: { session_inavalidated: false}
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
    this.setState({
      message_alert: nextProps.message_alert
    })
  }

  setPathAndHeaderProps (path) {
    if (auth.loggedIn() && getHiddenHeaderRoutes().indexOf(path) === -1) {
      this.setState({headerProps: {}, path})
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

  componentDidMount () {
     this.unlisten = this.props.history.listen(location => {
      this.setPathAndHeaderProps(location.pathname)
      if (!this.isWizardOrLogin(location.pathname)) {
        /* eslint-disable */
        if ($('#sidebarDiv')) {
          $('#sidebarDiv').removeClass('hideSideBar')
        }
        if ($('#headerDiv')) {
          $('#headerDiv').removeClass('hideHeader')
        }
        /* eslint-enable */
      }
    })
  }

  componentWillUnmount () {
    this.unlisten()
  }

  isWizardOrLogin (path) {
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

  onNotificationClick () {
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
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      getuserdetails,
      setMessageAlert,
      updateLiveChatInfo,
      clearSocketData,
      loadMyPagesListNew,
      validateUserAccessToken,
      isFacebookConnected,
      fetchCompanyPreferences
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubApp)
