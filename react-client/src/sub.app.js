import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './components/header/header'
import SimpleHeader from './containers/wizard/header'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'
import $ from 'jquery'
import { getuserdetails, switchToBasicPlan } from './redux/actions/basicinfo.actions'
import { setMessageAlert } from './redux/actions/notifications.actions'
import { joinRoom } from './utility/socketio'
import Notification from 'react-web-notification'
import MODAL from './components/extras/modal'
import AlertContainer from 'react-alert'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message_alert: null,
      path: '/',
      showContent: (auth.getToken() !== undefined && auth.getToken() !== '')
    }
    this.handleDemoSSAPage = this.handleDemoSSAPage.bind(this)
    this.onNotificationClick = this.onNotificationClick.bind(this)
    this.checkTrialPeriod = this.checkTrialPeriod.bind(this)
    this.getTrialModalContent = this.getTrialModalContent.bind(this)
    this.onPurchaseSubscription = this.onPurchaseSubscription.bind(this)

    props.getuserdetails(joinRoom)
  }

  handleDemoSSAPage () {
    const sidebar = document.getElementById('sidebarDiv')
    sidebar.parentNode.removeChild(sidebar)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message_alert) {
      nextProps.setMessageAlert(null)
    } 
    this.setState({
      message_alert: nextProps.message_alert
    })

  }

  componentDidMount () {
    if (this.props.history.location.pathname.toLowerCase() === '/demossa') {
      this.handleDemoSSAPage()
    } else if (this.props.history.location.pathname.toLowerCase() !== '/integrations/zoom') {
      this.props.history.push({
        pathname: '/',
        state: {obj: {_id: 1}}
      })
    }

    this.unlisten = this.props.history.listen(location => {
      this.setState({path: location.pathname})
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
    if (!this.state.showContent) {
      let interval = setInterval(() => {
        if (auth.getToken() !== undefined && auth.getToken() !== '') {
          window.location.reload()
          clearInterval(interval)
        }
      }, 1000)
    }
  }

  checkTrialPeriod () {
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

  getTrialModalContent () {
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

  onPurchaseSubscription () {
    this.refs._open_trial_modal.click()
    this.props.history.push({
      pathname: '/settings',
      state: 'payment_methods'
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
    console.log("Public URL ", process.env.PUBLIC_URL)
    console.log('auth.getToken', auth.getToken())
    console.log('browser history', this.props.history)
    
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
          style={{display: 'none'}}
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
          this.state.message_alert && !this.state.message_alert.muteNotification && this.state.message_alert.agentId === this.props.user._id &&
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
        <div>
          {
            auth.loggedIn() && ['/addfbpages', '/facebookIntegration', '/integrations', '/configureChatbot', '/configureChatbotNew', '/chatbotAnalytics'].indexOf(this.state.path) === -1
            ? <Header history={this.props.history} location={this.props.location} />
          : ['/addfbpages', '/facebookIntegration', '/integrations', '/configureChatbot', '/configureChatbotNew', '/chatbotAnalytics'].indexOf(this.state.path) > -1 &&
            <SimpleHeader showTitle={['/configureChatbot', '/configureChatbotNew', '/chatbotAnalytics'].indexOf(this.state.path) > -1} history={this.props.history} location={this.props.location} />
          }
          {
            this.state.showContent &&
            <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
              {
                auth.loggedIn() &&
                <Sidebar history={this.props.history} location={this.props.location} />
              }
              { this.props.children }
            </div>
          }
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  console.log('store state in app', state)
  return {
    user: (state.basicInfo.user),
    message_alert: (state.notificationsInfo.message_alert)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      getuserdetails,
      switchToBasicPlan,
      setMessageAlert
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
