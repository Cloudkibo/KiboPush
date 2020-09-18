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
  logout
} from '../../redux/actions/basicinfo.actions'
import { fetchNotifications, markRead } from '../../redux/actions/notifications.actions'
import auth from '../../utility/auth.service'

// Components
import HEADERMENU from './headerMenu'
import HEADERTOPBAR from './headerTopbar'

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
      seenNotifications: [],
      unseenNotifications: []
    }

    this.changePlatform = this.changePlatform.bind(this)
    this.setPlatform = this.setPlatform.bind(this)
    this.getPlanInfo = this.getPlanInfo.bind(this)
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.timeSince = this.timeSince.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.logout = this.logout.bind(this)

    props.fetchNotifications()
  }

  componentDidMount () {
    if (this.props.user) {
      this.setPlatform(this.props.user)
    }
  }

  changePlatform (value) {
    document.getElementById('m_aside_header_menu_mobile_close_btn').click()
    const userRole = this.props.user.role
    if (
      (value === 'messenger' && (!this.props.user.facebookInfo || !this.props.user.connectFacebook)) ||
      (this.props.automated_options &&
        ((value === 'sms' && !this.props.automated_options.twilio) || (value === 'whatsApp' && !this.props.automated_options.whatsApp))
      )
    ) {
      if (userRole === 'buyer') {
        this.props.history.push({
          pathname: '/integrations',
          state: value
        })
      } else {
        this.props.alertMsg.error(`${value} platform is not configured for your account. Please contact your account buyer.`)
      }
    } else {
      this.redirectToDashboard(value)
      this.props.updatePlatform({ platform: value }, this.props.fetchNotifications)
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
        pathname: '/SmsDashboard',
        state: 'sms'
      })
    } else if (value === 'whatsApp') {
      this.props.history.push({
        pathname: '/WhatsAppDashboard',
        state: 'whatsApp'
      })
    } else if (value === 'messenger') {
      this.props.history.push({
        pathname: '/messengerDashboard',
        state: 'messenger'
      })
    }
  }

  profilePicError(e) {
    console.log('profile picture error for user')
    // e.target.src = 'https://emblemsbf.com/img/27447.jpg'
    this.props.updatePicture({ user: this.props.user })
  }
  logout() {
    this.props.updateShowIntegrations({ showIntegrations: true })
    // auth.logout()
  }
  showDropDown() {
    console.log('showDropDown')
    this.setState({ showDropDown: true })
    // this.changeMode = this.changeMode.bind(this)
  }
  gotoView (id, _id, type) {
    this.props.markRead({ notificationId: _id })
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
          state: { id: id }
        })
      } else if (this.props.user.platform === 'whatsApp') {
        this.props.history.push({
          pathname: `/whatsAppChat`,
          state: { id: id }
        })
      } else if (this.props.user.platform === 'sms') {
        this.props.history.push({
          pathname: `/smsChat`,
          state: { id: id }
        })
      }
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

  logout() {
    this.props.updateShowIntegrations({ showIntegrations: true })
    auth.logout()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setPlatform(nextProps.user)
      let plan = nextProps.user.currentPlan.unique_ID
      this.getPlanInfo(plan)
    }
    if (nextProps.notifications) {
      var seen = []
      var unseen = []
      for (var i = 0; i < nextProps.notifications.length; i++) {
        var jsonObject = {
          message: nextProps.notifications[i].message,
          category: nextProps.notifications[i].category,
          date: this.timeSince(nextProps.notifications[i].datetime),
          seen: nextProps.notifications[i].seen,
          _id: nextProps.notifications[i]._id
        }
        if (nextProps.notifications[i].seen === true) {
          seen.push(jsonObject)
        } else {
          unseen.push(jsonObject)
        }
      }
      this.setState({ seenNotifications: seen, unseenNotifications: unseen })
    }
  }


  render() {
    console.log('headerMenu render', this.props)
    const {
      skin,
      showToggleSidebar,
      showHeaderMenu,
      showHeaderTopbar
    } = this.props
    return (
      <header className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div className={`m-stack__item m-brand ${skin === 'dark' ? 'm-brand--skin-dark' : ''}`}>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 style={skin === 'dark' ? darkSkinStyle : whiteSkinStyle} onClick={() => {this.props.history.push({pathname: '/'})}} className='m-brand__logo-wrapper'>
                    KIBOPUSH
                  </h4>
                </div>
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
                notifications={this.props.notifications}
                seenNotifications={this.state.seenNotifications}
                unseenNotifications={this.state.unseenNotifications}
                gotoView={this.gotoView}
                goToSettings={this.goToSettings}
                subscribers={this.props.subscribers}
                otherPages={this.props.otherPages}
                updatePicture={this.props.updatePicture}
                logout={this.props.logout}
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
    automated_options: (state.basicInfo.automated_options),
    userView: (state.backdoorInfo.userView),
    notifications: (state.notificationsInfo.notifications),
    subscribers: (state.subscribersInfo.subscribers),
    otherPages: (state.pagesInfo.otherPages)
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
    logout
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
