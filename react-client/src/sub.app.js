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
import { setNotification } from './redux/actions/notifications.actions'
import { joinRoom } from './utility/socketio'
import Notification from 'react-web-notification'
import MODAL from './components/extras/modal'
import AlertContainer from 'react-alert'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      path: '/',
      showContent: (auth.getToken() !== undefined && auth.getToken() !== '')
    }
    this.handleDemoSSAPage = this.handleDemoSSAPage.bind(this)
    this.onNotificationClick = this.onNotificationClick.bind(this)

    props.getuserdetails(joinRoom)
  }

  handleDemoSSAPage () {
    const sidebar = document.getElementById('sidebarDiv')
    sidebar.parentNode.removeChild(sidebar)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.toastrNotification) {
      this.msg.info(nextProps.toastrNotification)
      nextProps.setNotification(null)
    }
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

    console.log('browser history', this.props.history)
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
          this.props.socketData && this.props.socketData.showNotification &&
          <Notification
            title='New Message'
            onClick={this.onNotificationClick}
            options={{
              body: `You got a new message from ${this.props.socketData.payload.subscriber.firstName} ${this.props.socketData.payload.subscriber.lastName}: ${this.props.socketData.payload.text ? this.props.socketData.payload.text : this.props.socketData.payload.message.payload.attachments[0].type}`,
              lang: 'en',
              dir: 'ltr',
              icon: this.props.socketData.payload.subscriber ? this.props.socketData.payload.subscriber.profilePic : ''
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
    socketData: (state.socketInfo.socketData),
    user: (state.basicInfo.user),
    toastrNotification: (state.notificationsInfo.toastr_notification)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      getuserdetails,
      switchToBasicPlan,
      setNotification
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
