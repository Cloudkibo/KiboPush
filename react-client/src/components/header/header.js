/**
 * Created by sojharo on 20/07/2017.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import {
  updatePlatform,
  updateMode,
  updatePicture,
  updateShowIntegrations,
  disconnectFacebook,
  logout,
  saveEnvironment
} from '../../redux/actions/basicinfo.actions'
import {
  setUsersView
} from '../../redux/actions/backdoor.actions'
import {
  saveNotificationSessionId
} from '../../redux/actions/livechat.actions'
import { fetchNotifications, markRead } from '../../redux/actions/notifications.actions'
import AlertContainer from 'react-alert'
import { getLandingPage } from '../../utility/utils'

// Components
import HEADERMENU from './headerMenu'
import HEADERTOPBAR from './headerTopbar'
import cookie from 'react-cookie'

// styles
const darkSkinStyle = {
  color: 'white',
  cursor: 'pointer'
}

const whiteSkinStyle = {
  cursor: 'pointer'
}

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedPlatform: {},
      planInfo: '',
      notifications: [],
      notificationsRecords: 50,
      unreadNotifications: 0,
      totalNotifications: 0,
      loadingMoreNotifications: false
    }

    this.changePlatform = this.changePlatform.bind(this)
    this.setPlatform = this.setPlatform.bind(this)
    this.getPlanInfo = this.getPlanInfo.bind(this)
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.timeSince = this.timeSince.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.logout = this.logout.bind(this)
    this.isPlatformConnected = this.isPlatformConnected.bind(this)
    this.handleChangePlatform = this.handleChangePlatform.bind(this)
    this.fetchNotifications = this.fetchNotifications.bind(this)

    this.fetchNotifications()
  }

  fetchNotifications (lastId) {
    this.setState({loadingMoreNotifications: true})
    this.props.fetchNotifications({
      records: this.state.notificationsRecords,
      lastId
    }, (res) => {
      if (res.status === 'success') {
        let {totalCount, unreadCount, notifications} = res.payload
        notifications = notifications.map((item) => {
          item.date = this.timeSince(item.datetime)
          return item
        })
        notifications = [...this.state.notifications, ...notifications]
        this.setState({
          loadingMoreNotifications: false,
          notifications,
          unreadNotifications: unreadCount,
          totalNotifications: totalCount
        })
      }
    })
  }

  handleChangePlatform (data) {
    this.props.fetchNotifications({records: this.state.notificationsRecords})
    this.redirectToDashboard(data)
  }

  componentDidMount () {
    if (this.props.user) {
      this.setPlatform(this.props.user)
    }
    if (cookie.load('environment')) {
      this.props.saveEnvironment(cookie.load('environment'))
    }
  }

  isPlatformConnected (value) {
    switch (value) {
      case 'messenger':
        if (!this.props.automated_options.facebook) return false
        else return true
      case 'whatsApp':
        if (!this.props.user.plan.whatsappSuperNumber &&
          (!this.props.automated_options.whatsApp || this.props.automated_options.whatsApp.connected === false)
        ) {
          return false
        }
        else return true
      case 'sms':
        if (!this.props.automated_options.twilio) return false
        else return true
      default:
        return false
    }
  }

  changePlatform (value) {
    document.getElementById('m_aside_header_menu_mobile_close_btn').click()
    const userRole = this.props.user.role
    const isPlatformConnected = this.isPlatformConnected(value)
    if (userRole === 'buyer' && !isPlatformConnected) {
      this.props.history.push({
        pathname: '/integrations',
        state: value
      })
    } else if (!isPlatformConnected) {
      this.props.alertMsg.error(`${value} platform is not configured for your account. Please contact your account buyer.`)
    } else {
      this.props.updatePlatform({ platform: value }, this.handleChangePlatform)
    }
  }

  setPlatform (user) {
    let selectedPlatform = {}
    switch (user.platform) {
      case 'messenger':
        selectedPlatform = {
          platform: 'Messenger',
          icon: 'fa fa-facebook-square'
        }
        break
      case 'sms':
        selectedPlatform = {
          platform: 'SMS',
          icon: 'flaticon flaticon-chat-1'
        }
        break
      case 'whatsApp':
        selectedPlatform = {
          platform: 'WhatsApp',
          icon: 'socicon socicon-whatsapp'
        }
        break
      default:
    }
    this.setState({selectedPlatform})
  }

  getPlanInfo(plan) {
    var planInfo
    if (plan === 'plan_A') {
      planInfo = 'Individual, Premium Account'
    } else if (plan === 'plan_B') {
      planInfo = 'Individual, Free Account'
    } else if (plan === 'plan_C') {
      planInfo = 'Team, Premium Account'
    } else if (plan === 'plan_D') {
      planInfo = 'Team, Free Account'
    } else {
      planInfo = ''
    }
    this.setState({ planInfo: planInfo })
  }

  redirectToDashboard (value) {
    if (value === 'sms') {
      this.props.history.push({
        pathname: getLandingPage(value),
        state: 'sms'
      })
    } else if (value === 'whatsApp') {
      this.props.history.push({
        pathname: getLandingPage(value, this.props.user),
        state: 'whatsApp'
      })
    } else if (value === 'messenger') {
      this.props.history.push({
        pathname: getLandingPage(value),
        state: 'messenger'
      })
    }
  }

  logout(res) {
    if (res.status === 'success') {
      this.props.updateShowIntegrations({ showIntegrations: true })
    } else {
      this.msg.error(res.description || 'Failed to disconnect Facebook')
    }
  }
  showDropDown() {
    console.log('showDropDown')
    this.setState({ showDropDown: true })
    // this.changeMode = this.changeMode.bind(this)
  }
  gotoView (id, _id, type, markRead) {
    if (type === 'webhookFailed') {
      this.props.history.push({
        pathname: `/settings`,
        state: { module: 'webhook' }
      })
    } else if (type === 'limit') {
      this.props.history.push({
        pathname: `/settings`,
        state: { module: 'pro' }
      })
    } else {
      if (this.props.user.platform === 'messenger') {
        this.props.history.push({
          pathname: `/liveChat`,
        })
        this.props.saveNotificationSessionId({sessionId: id})
      } else if (this.props.user.platform === 'whatsApp') {
        this.props.history.push({
          pathname: `/whatsAppChat`,
        })
        this.props.saveNotificationSessionId({sessionId: id})
      } else if (this.props.user.platform === 'sms') {
        this.props.history.push({
          pathname: `/smsChat`
        })
        this.props.saveNotificationSessionId({sessionId: id})
      }
    }
    if (markRead) {
      this.props.markRead({ notificationId: _id }, (res) => {
        if (res.status === 'success') {
          const notifications = this.state.notifications
          const index = notifications.findIndex((item) => item._id === _id)
          notifications[index] = {...notifications[index], seen: true}
          const unreadNotifications = this.state.unreadNotifications - 1
          this.setState({notifications, unreadNotifications})
        }
      })
    }
  }

  timeSince(date) {
    const newDate = new Date(date)
    const seconds = Math.floor((new Date() - newDate) / 1000)
    let interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + ' years ago'
    }

    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' months ago'
    }

    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' days ago'
    }

    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hours ago'
    }

    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + ' minutes ago'
    }

    return Math.floor(seconds) + ' seconds ago'
  }

  goToSettings () {
    this.props.history.push({
      pathname: '/settings',
      state: {tab: 'notificationSettings'}
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setPlatform(nextProps.user)
      let plan = nextProps.user.currentPlan.unique_ID
      this.getPlanInfo(plan)
    }
  }


  render() {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    const {
      skin,
      showToggleSidebar,
      showHeaderMenu,
      showHeaderTopbar
    } = this.props
    return (
      <header id='headerDiv' className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div className={`m-stack__item m-brand ${skin === 'dark' ? 'm-brand--skin-dark' : ''}`}>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 style={skin === 'dark' ? darkSkinStyle : whiteSkinStyle} onClick={() => {this.props.history.push({pathname: '/'})}} className='m-brand__logo-wrapper'>
                    KIBOPUSH
                  </h4>
                </div>
                <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
                <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                  {
                    showToggleSidebar &&
                    <span id='m_aside_left_minimize_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block'>
                      <span />
                    </span>
                  }
                  {
                    showToggleSidebar &&
                    <span id='m_aside_left_offcanvas_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block'>
                      <span />
                    </span>
                  }
                  {
                    showHeaderMenu &&
                    <span id='m_aside_header_menu_mobile_toggle' className='m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block'>
                      <span />
                    </span>
                  }
                  {
                    showHeaderTopbar &&
                    <span id='m_aside_header_topbar_mobile_toggle' className='m-brand__icon m--visible-tablet-and-mobile-inline-block'>
                      <i className='flaticon-more' />
                    </span>
                  }
                </div>
              </div>
            </div>
            <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <button className='m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark ' id='m_aside_header_menu_mobile_close_btn'>
                <i className='la la-close' />
              </button>
              <HEADERMENU
                showSelectPlatform={this.props.showSelectPlatform}
                showPlanPermissions={this.props.showPlanPermissions}
                selectedPlatform={this.state.selectedPlatform}
                changePlatform={this.changePlatform}
                updateMode={this.props.updateMode}
                user={this.props.user}
              />
              <HEADERTOPBAR
                showNotifcations={this.props.showNotifcations}
                showQuickActions={this.props.showQuickActions}
                showAppChooser={this.props.showAppChooser}
                showDocumentation={this.props.showDocumentation}
                user={this.props.user}
                userView={this.props.userView}
                superUser={this.props.superUser}
                notifications={this.state.notifications}
                totalNotifications={this.state.totalNotifications}
                unreadNotifications={this.state.unreadNotifications}
                gotoView={this.gotoView}
                goToSettings={this.goToSettings}
                subscribers={this.props.subscribers}
                otherPages={this.props.otherPages}
                updatePicture={this.props.updatePicture}
                logout={this.props.logout}
                setUsersView={this.props.setUsersView}
                currentEnvironment= {this.props.currentEnvironment}
                loadingMoreNotifications={this.state.loadingMoreNotifications}
                fetchNotifications={this.fetchNotifications}
              />
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="disconnectFacebook" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Disconnet Facebook Account
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to disconnect your Facebook account?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.disconnectFacebook(this.logout)
                  }} data-dismiss='modal'>Yes
                  </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

Header.defaultProps = {
  'skin': 'dark',
  'showToggleSidebar': true,
  'showHeaderMenu': true,
  'showHeaderTopbar': true,
  'showSelectPlatform': true,
  'showPlanPermissions': true,
  'showNotifcations': true,
  'showQuickActions': true,
  'showAppChooser': true,
  'showDocumentation': false
}

Header.propTypes = {
  'skin': PropTypes.string,
  'showToggleSidebar': PropTypes.bool,
  'showHeaderMenu': PropTypes.bool,
  'showHeaderTopbar': PropTypes.bool,
  'showSelectPlatform': PropTypes.bool,
  'showPlanPermissions': PropTypes.bool,
  'showNotifcations': PropTypes.bool,
  'showQuickActions': PropTypes.bool,
  'showAppChooser': PropTypes.bool,
  'showDocumentation': PropTypes.bool
}

function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser),
    automated_options: (state.basicInfo.automated_options),
    userView: (state.backdoorInfo.userView),
    subscribers: (state.subscribersInfo.subscribers),
    otherPages: (state.pagesInfo.otherPages),
    currentEnvironment: (state.basicInfo.currentEnvironment)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePlatform,
    fetchNotifications,
    updateMode,
    markRead,
    updatePicture,
    updateShowIntegrations,
    disconnectFacebook,
    logout,
    saveEnvironment,
    setUsersView,
    saveNotificationSessionId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
