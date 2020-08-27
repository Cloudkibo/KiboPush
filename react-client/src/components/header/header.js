/**
 * Created by sojharo on 20/07/2017.
 */
import React from 'react'
import auth from '../../utility/auth.service'
import { connect } from 'react-redux'
import {
  updateShowIntegrations,
  disconnectFacebook,
  updateMode,
  updatePlatform,
  updatePicture
} from '../../redux/actions/basicinfo.actions'
import { fetchNotifications, markRead } from '../../redux/actions/notifications.actions'
import { resetSocket } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import cookie from 'react-cookie'
import AlertContainer from 'react-alert'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    props.fetchNotifications()
    this.state = {
      url: window.location.hostname.includes('kibolite'),
      planInfo: '',
      seenNotifications: [],
      unseenNotifications: [],
      showDropDown: false,
      showViewingAsDropDown: false,
      mode: 'All',
      userView: false
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.getPlanInfo = this.getPlanInfo.bind(this)
    this.timeSince = this.timeSince.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.logout = this.logout.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.updatePlatformValue = this.updatePlatformValue.bind(this)
    this.removeActingAsUser = this.removeActingAsUser.bind(this)
    this.showViewingAsDropDown = this.showViewingAsDropDown.bind(this)
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
  }

  goToSettings () {
    this.props.history.push({
      pathname: '/settings',
      state: {tab: 'notificationSettings'}
    })
  }

  removeActingAsUser() {
    auth.removeActingAsUser()
    window.location.reload()
  }

  updatePlatformValue(e, value) {
    console.log('in updatePlatformValue', value)
    if (this.props.user && this.props.user.role === 'buyer') {
      if (value === 'sms' && this.props.automated_options && !this.props.automated_options.twilio) {
        this.props.history.push({
          pathname: '/integrations',
          state: 'sms'
        })
      } else if (value === 'whatsApp' && this.props.automated_options && !this.props.automated_options.whatsApp) {
        this.props.history.push({
          pathname: '/integrations',
          state: 'whatsApp'
        })
      } else if (value === 'messenger' && this.props.user && !this.props.user.facebookInfo) {
        this.props.history.push({
          pathname: '/integrations',
          state: 'messenger'
        })
      } else {
        this.redirectToDashboard(value)
        this.props.updatePlatform({ platform: value })
      }
    } else {
      if (value === 'sms' && this.props.automated_options && !this.props.automated_options.twilio) {
        this.msg.error('SMS Twilio is not connected. Please ask your account buyer to connect it.')
      } else if (value === 'whatsApp' && this.props.automated_options && !this.props.automated_options.whatsApp) {
        this.msg.error('WhatsApp is not connected. Please ask your account buyer to connect it.')
      } else {
        this.redirectToDashboard(value)
        this.props.updatePlatform({ platform: value })
      }
    }
  }

  redirectToDashboard(value) {
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
    auth.logout()
  }
  showDropDown() {
    console.log('showDropDown')
    this.setState({ showDropDown: true })
    // this.changeMode = this.changeMode.bind(this)
  }

  showViewingAsDropDown() {
    console.log('show viewing as dropdown')
    this.setState({ showViewingAsDropDown: true })
  }

  changeMode(mode) {
    this.props.updateMode({ mode: mode }, this.props.user)
  }
  changeStatus(e, id) {
    this.props.updateMode({ _id: id, advancedMode: e.target.checked })
  }

  toggleSidebar() {
    /* eslint-disable */
    $('body').toggleClass(' m-aside-left--minimize m-brand--minimize')
    /* eslint-enable */
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in header', nextProps)
    if (nextProps.userView) {
      this.setState({ userView: nextProps.userView })
    }
    if (nextProps.user) {
      let mode = nextProps.user.uiMode && nextProps.user.uiMode.mode === 'kiboengage' ? 'Customer Engagement' : nextProps.user.uiMode.mode === 'kibochat' ? 'Customer Chat' : nextProps.user.uiMode.mode === 'kibocommerce' ? 'E-Commerce' : 'All'
      this.setState({ mode: mode })
      // FS.identify(nextProps.user.email, {
      //   displayName: nextProps.user.name,
      //   email: nextProps.user.email,
      //   // TODO: Add your own custom user variables here, details at
      //   // http://help.fullstory.com/develop-js/setuservars.
      //   reviewsWritten_int: 14
      // })
      // console.log('FS identify Executed')
      var plan = nextProps.user.currentPlan.unique_ID
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
  timeSince(date) {
    var newDate = new Date(date)
    var seconds = Math.floor((new Date() - newDate) / 1000)

    var interval = Math.floor(seconds / 31536000)

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

  gotoView(id, _id, type) {
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
      this.props.history.push({
        pathname: `/liveChat`,
        state: { id: id }
      })
    }
  }

  goToSubProduct(product) {
    let productUrls = {
      'kiboengage': {
        'staging': 'https://skiboengage.cloudkibo.com/',
        'production': 'https://kiboengage.cloudkibo.com/'
      },
      'kibochat': {
        'staging': 'https://skibochat.cloudkibo.com/',
        'production': 'https://kibochat.cloudkibo.com/'
      },
      'kibodash': {
        'staging': 'https://skibodash.cloudkibo.com/',
        'production': 'https://kibodash.cloudkibo.com/'
      },
      'kibocommerce': {
        'staging': 'https://skibocommerce.cloudkibo.com/',
        'production': 'https://kibocommerce.cloudkibo.com/'
      },
      'KiboLite': {
        'staging': 'https://skibolite.cloudkibo.com/',
        'production': 'https://kibolite.cloudkibo.com/'
      },
      'KiboAPI': {
        'production': 'https://kiboapi.cloudkibo.com/',
        'staging': 'https://kiboapi.cloudkibo.com/'
      }
    }

    const environment = cookie.load('environment')
    console.log('environment header', environment)
    return productUrls[product][environment]
  }

  render() {
    console.log('this.props.socketData', this.props.socketData)
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <header id='headerDiv' className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        <div className='fb-customerchat'
          data-page_id='151990922046256'
          data-minimized='true'
          data-logged_in_greeting='Hi, Let us know if you find any bugs or have a feature request'
          data-logged_out_greeting='Hi, Let us know if you find any bugs or have a feature request' />

        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div className='m-stack__item m-brand  m-brand--skin-dark '>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 className='m-brand__logo-wrapper' style={{ color: 'white' }}>
                    {/* <img alt='' src='assets/demo/default/media/img/logo/logo_default_dark.png'/> */}
                    KIBOPUSH</h4>
                </div>
                <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                  <span onClick={this.toggleSidebar} id='m_aside_left_minimize_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block'>
                    <span />
                  </span>
                  <span id='m_aside_left_offcanvas_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </span>

                  <span id='m_aside_header_menu_mobile_toggle' className='m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </span>

                  <span id='m_aside_header_topbar_mobile_toggle' className='m-brand__icon m--visible-tablet-and-mobile-inline-block'>
                    <i className='flaticon-more' />
                  </span>
                </div>
              </div>
            </div>
            <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <button className='m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark ' id='m_aside_header_menu_mobile_close_btn'>
                <i className='la la-close' />
              </button>
              <div id='m_header_menu' className='m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark'>
                <ul className='m-menu__nav  m-menu__nav--submenu-arrow '>
                  {
                    this.props.user && !this.state.url &&
                    <li className='m-menu__item  m-menu__item--submenu m-menu__item--relm-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                      <span>Select Platform: </span>&nbsp;&nbsp;&nbsp;
                      <span onClick={this.showDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                        {this.props.user && this.props.user.platform === 'messenger' ? 'Messenger' : this.props.user.platform === 'sms' ? 'SMS' : 'WhatsApp'}
                      </span>
                      {
                        this.state.showDropDown &&
                        <div className='m-dropdown__wrapper'>
                          <span className='m-dropdown__arrow m-dropdown__arrow--left m-dropdown__arrow--adjust' />
                          <div className='m-dropdown__inner'>
                            <div className='m-dropdown__body'>
                              <div className='m-dropdown__content'>
                                <ul className='m-nav'>
                                  <li key={'messenger'} className='m-nav__item'>
                                    <span onClick={(e) => this.updatePlatformValue(e, 'messenger')} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                      <i className='m-nav__link-icon fa fa-facebook-square' />
                                      <span className='m-nav__link-text'>
                                        Messenger
                                      </span>
                                    </span>
                                  </li>
                                  <li key={'sms'} className='m-nav__item'>
                                    <span onClick={(e) => this.updatePlatformValue(e, 'sms')} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                      <i className='m-nav__link-icon flaticon flaticon-chat-1' />
                                      <span className='m-nav__link-text'>
                                        SMS
                                      </span>
                                    </span>
                                  </li>
                                  <li key={'whatsApp'} className='m-nav__item'>
                                    <span onClick={(e) => this.updatePlatformValue(e, 'whatsApp')} className='m-nav__link' style={{ cursor: 'pointer' }}>
                                      <i className='m-nav__link-icon socicon socicon-whatsapp' />
                                      <span className='m-nav__link-text'>
                                        WhatsApp
                                      </span>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </li>
                  }
                  {
                    this.props.user && this.props.user.isSuperUser
                      ? <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-menu-submenu-toggle='click' data-redirect='true' aria-haspopup='true'>
                        <span className='m-menu__link m-menu__toggle'>
                          <i className='m-menu__link-icon flaticon-settings' />
                          <span className='m-menu__link-text'>
                            Plans & Permissions
                        </span>
                          <i className='m-menu__hor-arrow la la-angle-down' />
                          <i className='m-menu__ver-arrow la la-angle-right' />
                        </span>
                        <div className='m-menu__submenu m-menu__submenu--classic m-menu__submenu--left'>
                          <span className='m-menu__arrow m-menu__arrow--adjust' />
                          <ul className='m-menu__subnav'>
                            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.changeMode('kiboengage') }}>
                              <Link to='/plans' className='m-menu__link '>
                                <i className='m-menu__link-icon fa fa-cc-stripe' />
                                <span className='m-menu__link-text'>
                                  Plans
                              </span>
                              </Link>
                            </li>
                            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.changeMode('kibochat') }}>
                              <Link to='/permissions' className='m-menu__link '>
                                <i className='m-menu__link-icon fa fa-key' />
                                <span className='m-menu__link-text'>
                                  Permissions
                              </span>
                              </Link>
                            </li>
                            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.changeMode('kibocommerce') }}>
                              <Link to='/features' className='m-menu__link '>
                                <i className='m-menu__link-icon fa fa-th-list' />
                                <span className='m-menu__link-text'>
                                  Features
                              </span>
                              </Link>
                            </li>
                            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.changeMode('all') }}>
                              <Link to='/usage' className='m-menu__link '>
                                <i className='m-menu__link-icon fa fa-pie-chart' />
                                <span className='m-menu__link-text'>
                                  Usage
                              </span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                      : <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-redirect='true' aria-haspopup='true'>
                        <a href='https://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' className='m-menu__link m-menu__toggle'>
                          <i className='m-menu__link-icon flaticon-info' />
                          <span className='m-menu__link-text'>
                            Documentation
                        </span>
                        </a>
                      </li>
                  }
                </ul>
              </div>
              <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-topbar__nav-wrapper'>
                  {this.props.user &&
                    <ul className='m-topbar__nav m-nav m-nav--inline'>
                      {this.props.user.isSuperUser && (auth.getActingAsUser() !== undefined || this.state.userView) &&
                        <li style={{ marginRight: '20px', padding: '0' }} className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                          <div style={{ marginTop: '15px' }}>
                            <span className='m-topbar__userpic'>
                              <div style={{ display: 'inline-block', height: '41px' }}>

                                <span className='m-nav__link-text' style={{ lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center' }}>
                                  <li className='m-menu__item  m-menu__item--submenu m-menu__item--relm-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                    <span style={{ fontSize: '0.85em' }} onClick={this.showViewingAsDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                                      Viewing As...
                                  </span>
                                    {
                                      this.state.showViewingAsDropDown &&
                                      <div className='m-dropdown__wrapper'>
                                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                                        <div className='m-dropdown__inner'>
                                          <div className='m-dropdown__body'>
                                            <div className='m-dropdown__content'>
                                              <ul className='m-nav'>
                                                <li style={{ textAlign: 'center' }} className='m-nav__item'>
                                                  <span>
                                                    Currently viewing as: <strong>{auth.getActingAsUserName()} </strong>
                                                  </span>
                                                </li>
                                                <li style={{ textAlign: 'center' }} className='m-nav__item'>
                                                  <span onClick={this.removeActingAsUser} className='m-btn m-btn--pill m-btn--hover-brand btn btn-secondary' style={{ cursor: 'pointer' }}>
                                                    <span className='m-nav__link-text'>
                                                      Switch back to my view
                                                  </span>
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  </li>
                                </span>
                              </div>
                            </span>
                          </div>
                        </li>
                      }
                      <li style={{ marginRight: '10px', padding: '0' }} className='m-nav__item m-topbar__notifications m-topbar__notifications--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-center m-dropdown--mobile-full-width' data-dropdown-toggle='click'>
                        <span className='m-nav__link m-dropdown__toggle' id='m_topbar_notification_icon'>
                          {this.props.notifications && this.state.unseenNotifications.length > 0 &&
                            <span className='m-nav__link-badge m-badge m-badge--dot m-badge--dot-small m-badge--danger' />
                          }
                          {this.props.notifications && this.state.unseenNotifications.length > 0
                            ? <span className='m-nav__link-icon m-animate-shake'>
                              <i className='flaticon-music-2' />
                            </span>
                            : <span className='m-nav__link-icon'>
                              <i className='flaticon-music-2' />
                            </span>
                          }
                        </span>
                        <div className='m-dropdown__wrapper'>
                          <span className='m-dropdown__arrow m-dropdown__arrow--center' />
                          <div className='m-dropdown__inner'>
                            <div className='m-dropdown__header' style={{ background: 'assets/app/media/img/misc/notification_bg.jpg', backgroundSize: 'cover' }}>
                              <div className='m--align-center'>
                                {this.props.notifications && this.state.unseenNotifications.length > 0
                                  ? <span className='m-dropdown__header-title'>
                                    {this.state.unseenNotifications.length} New
                              </span>
                                  : <span className='m-dropdown__header-title'>
                                    No New
                              </span>
                                }
                              <span className='m-dropdown__header-subtitle'>
                                Notifications
                              </span>
                            </div>
                            <div className='m--align-right' style={{position: 'relative', top: '-32px'}}><i onClick={this.goToSettings} style={{fontSize: '1.5rem', cursor: 'pointer'}} className='la la-gear'/></div>
                            </div>
                            {this.props.notifications && (this.state.seenNotifications.length > 0 || this.state.unseenNotifications.length > 0) &&
                              <div className='m-dropdown__body'>
                                <div className='m-dropdown__content'>
                                  <div className='tab-content'>
                                    <div className='tab-pane active' id='topbar_notifications_notifications' role='tabpanel' aria-expanded='true'>
                                      <div className='tab-pane active m-scrollable' role='tabpanel'>
                                        <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                                          <div style={{ height: '300px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom' }} className='m-messenger__messages'>
                                            <div style={{ position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr' }}>
                                              <div style={{ position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto' }} >
                                                <div className='m-list-timeline m-list-timeline--skin-light'>
                                                  <div className='m-list-timeline__items'>
                                                    {
                                                      this.state.unseenNotifications.map((unseen, i) => (
                                                        <div className='m-list-timeline__item'>
                                                          <span className='m-list-timeline__badge m-list-timeline__badge--brand' />
                                                          <span className='m-list-timeline__text' onClick={() => this.gotoView(unseen.category.id, unseen._id, unseen.category.type)} style={{ cursor: 'pointer' }}>
                                                            {unseen.message}
                                                          </span>
                                                          <span className='m-list-timeline__time' style={{ width: '100px' }}>
                                                            {unseen.date}
                                                          </span>
                                                        </div>
                                                      ))
                                                    }
                                                    {this.state.seenNotifications.map((seen, i) => (
                                                      <div className='m-list-timeline__item m-list-timeline__item--read'>
                                                        <span className='m-list-timeline__badge' />
                                                        <span href='' className='m-list-timeline__text' onClick={() => this.gotoView(seen.category.id, seen._id)} style={{ cursor: 'pointer' }}>
                                                          {seen.message}
                                                        </span>
                                                        <span className='m-list-timeline__time' style={{ width: '100px' }}>
                                                          {seen.date}
                                                        </span>
                                                      </div>
                                                    ))
                                                    }
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      </li>
                      {this.props.user && this.props.user.isSuperUser && this.props.user.facebookInfo &&
                        <li style={{ marginRight: '10px', padding: '0' }} className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                          <span className='m-nav__link m-dropdown__toggle'>
                            <span className='m-nav__link-badge m-badge m-badge--dot m-badge--info m--hide' />
                            <span className='m-nav__link-icon'>
                              <i className='flaticon-share' />
                            </span>
                          </span>
                          <div className='m-dropdown__wrapper'>
                            <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                            <div className='m-dropdown__inner'>
                              <div className='m-dropdown__body m-dropdown__body--paddingless'>
                                <div className='m-dropdown__content'>
                                  <div className='m-scrollable' data-scrollable='false' data-max-height='380' data-mobile-max-height='200'>
                                    <div className='m-nav-grid m-nav-grid--skin-light'>
                                      <div className='m-nav-grid__row'>
                                        {
                                          (window.location.hostname.toLowerCase().includes('kiboengage') &&
                                            this.props.subscribers &&
                                            this.props.subscribers.length === 0)
                                            ? <Link to='/broadcasts' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-file' />
                                              <span className='m-nav-grid__text'>Send New Broadcast</span>
                                            </Link>
                                            : (window.location.hostname.toLowerCase().includes('kiboengage')) ? <Link to='/broadcasts' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-file' />
                                              <span className='m-nav-grid__text'>Send New Broadcast</span>
                                            </Link>
                                              : null
                                        }

                                        {
                                          (window.location.hostname.toLowerCase().includes('kiboengage') &&
                                            this.props.subscribers &&
                                            this.props.subscribers.length === 0)
                                            ? <Link to='/poll' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-time' />
                                              <span className='m-nav-grid__text'>Send New Poll</span>
                                            </Link>
                                            : (window.location.hostname.toLowerCase().includes('kiboengage')) ? <Link to='/poll' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-time' />
                                              <span className='m-nav-grid__text'>Send New Poll</span>
                                            </Link>
                                              : null

                                        }

                                      </div>
                                      <div className='m-nav-grid__row'>

                                        {
                                          (window.location.hostname.toLowerCase().includes('kiboengage') && this.props.subscribers &&
                                            this.props.subscribers.length === 0)
                                            ? <Link to='/surveys' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-folder' />
                                              <span className='m-nav-grid__text'>Send New Survey</span>
                                            </Link>
                                            : (window.location.hostname.toLowerCase().includes('kiboengage')) ? <Link to='/surveys' className='m-nav-grid__item'>
                                              <i className='m-nav-grid__icon flaticon-folder' />
                                              <span className='m-nav-grid__text'>Send New Survey</span>
                                            </Link>
                                              : null
                                        }
                                        {
                                          !window.location.hostname.toLowerCase().includes('kiboengage') &&
                                          <Link to='/bots' className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-clipboard' />
                                            <span className='m-nav-grid__text'>Create New Bot</span>
                                          </Link>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      }
                      {/* APP CHOOSER */}
                      <li style={{ marginRight: '20px', padding: '0' }} className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                        <span style={{ cursor: 'pointer' }} className='m-nav__link m-dropdown__toggle'>
                          <span className='m-nav__link-badge m-badge m-badge--dot m-badge--info m--hide' />
                          <span className='m-nav__link-icon'>
                            <i className='flaticon-app' />
                          </span>
                        </span>
                        <div className='m-dropdown__wrapper'>
                          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                          <div className='m-dropdown__inner'>
                            <div className='m-dropdown__body m-dropdown__body--paddingless'>
                              <div className='m-dropdown__content'>
                                <div className='m-scrollable' data-scrollable='false' data-max-height='380' data-mobile-max-height='200'>
                                  <div className='m-nav-grid m-nav-grid--skin-light'>
                                    <div className='m-nav-grid__row'>
                                      {
                                        (!window.location.hostname.toLowerCase().includes('kiboengage'))
                                          ? <a href={this.goToSubProduct('kiboengage')} className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-network' />
                                            <span className='m-nav-grid__text'>KiboEngage</span>
                                          </a>
                                          : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-network' />
                                            <span className='m-nav-grid__text'>KiboEngage</span>
                                          </span>
                                      }

                                      {
                                        (!window.location.hostname.toLowerCase().includes('kibochat'))
                                          ? <a href={this.goToSubProduct('kibochat')} className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-speech-bubble' />
                                            <span className='m-nav-grid__text'>KiboChat</span>
                                          </a>
                                          : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-speech-bubble' />
                                            <span className='m-nav-grid__text'>KiboChat</span>
                                          </span>
                                      }
                                    </div>
                                    <div className='m-nav-grid__row'>
                                      {/*
                                        (!window.location.hostname.toLowerCase().includes('kibodash'))
                                          ? <a href='#kibodash' className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-analytics' />
                                            <span className='m-nav-grid__text'>KiboDash (Coming Soon)</span>
                                          </a>
                                          : <a style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-analytics' />
                                            <span className='m-nav-grid__text'>KiboDash</span>
                                          </a>
                                        */
                                      }

                                      {/*
                                        (!window.location.hostname.toLowerCase().includes('kibocommerce'))
                                          ? <a href='#kibocommerce' className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-truck' />
                                            <span className='m-nav-grid__text'>KiboCommerce (Coming Soon)</span>
                                          </a>
                                          : <a style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-truck' />
                                            <span className='m-nav-grid__text'>KiboCommerce</span>
                                          </a>
                                      */}

                                      {
                                        (!window.location.hostname.toLowerCase().includes('KiboLite'))
                                          ? <a href={this.goToSubProduct('KiboLite')} className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-truck' />
                                            <span className='m-nav-grid__text'>KiboLite</span>
                                          </a>
                                          : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-truck' />
                                            <span className='m-nav-grid__text'>KiboLite</span>
                                          </span>
                                      }
                                      {
                                        (!window.location.hostname.toLowerCase().includes('kiboapi'))
                                          ? <a href={this.goToSubProduct('KiboAPI')} className='m-nav-grid__item'>
                                            <i className='m-nav-grid__icon flaticon-share' />
                                            <span className='m-nav-grid__text'>KiboAPI</span>
                                          </a>
                                          : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                                            <i className='m-nav-grid__icon flaticon-share' />
                                            <span className='m-nav-grid__text'>KiboAPI</span>
                                          </span>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                        <span className='m-nav__link m-dropdown__toggle'>
                          <span className='m-topbar__userpic'>
                            <div style={{ display: 'inline-block', marginRight: '5px' }}>
                              <img onError={this.profilePicError} src={(this.props.user && this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic) ? this.props.user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless m--img-centered' alt='' />
                            </div>
                            <div style={{ display: 'inline-block', height: '41px' }}>
                              <span className='m-nav__link-text' style={{ lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center' }}>{(this.props.user) ? this.props.user.name : ''} <i className='fa fa-chevron-down' />
                              </span>
                            </div>
                          </span>
                          <span className='m-topbar__username m--hide'>
                            {(this.props.user) ? this.props.user.name : ''}
                          </span>
                        </span>
                        <div className='m-dropdown__wrapper'>
                          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                          <div className='m-dropdown__inner'>
                            <div className='m-dropdown__header m--align-center'>
                              <div className='m-card-user m-card-user--skin-dark'>
                                <div className='m-card-user__pic'>
                                  <img src={(this.props.user && this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic) ? this.props.user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless' alt='' />
                                </div>
                                <div className='m-card-user__details'>
                                  <span className='m-card-user__name m--font-weight-500'>
                                    {(this.props.user) ? this.props.user.name : ''}
                                  </span>
                                  <span className='m-card-user__email'>
                                    {(this.props.user) ? this.props.user.email : ''}
                                  </span>
                                  <span className='m-card-user__email'>
                                    {this.state.planInfo}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='m-dropdown__body'>
                              <div className='m-dropdown__content'>
                                <ul className='m-nav m-nav--skin-light'>
                                  <li className='m-nav__section m--hide'>
                                    <span className='m-nav__section-text'>My Pages</span>
                                  </li>
                                  {this.props.user && this.props.user.role !== 'agent' &&
                                    <li className='m-nav__item'>
                                      <Link to='/inviteUsingLinkWizard' className='m-nav__link'>
                                        <i className='m-nav__link-icon flaticon-list-2' />
                                        <span className='m-nav__link-text'>Setup Using Wizard</span>
                                      </Link>
                                    </li>
                                  }
                                  <li className='m-nav__item'>
                                    {window.location.hostname.toLowerCase().includes('kibochat')
                                      && <Link to='/liveChat' className='m-nav__link'>
                                        <i className='m-nav__link-icon flaticon-chat-1' />
                                        <span className='m-nav__link-text'>Messages</span>
                                      </Link>
                                    }
                                  </li>
                                  {this.props.user && this.props.user.role === 'buyer' &&
                                    <li className='m-nav__item'>
                                      <span data-toggle="modal" data-target="#disconnectFacebook" className='m-nav__link'>
                                        <i className='m-nav__link-icon la la-unlink' />
                                        <span className='m-nav__link-text'>Disconnect Facebook</span>
                                      </span>
                                    </li>
                                  }
                                  <li className='m-nav__separator m-nav__separator--fit' />
                                  <li className='m-nav__item'>
                                    <a href='http://kibopush.com/faq/' target='_blank' rel='noopener noreferrer' className='m-nav__link'>
                                      <i className='m-nav__link-icon flaticon-info' />
                                      <span className='m-nav__link-text'>FAQ</span>
                                    </a>
                                  </li>
                                  <li className='m-nav__item'>
                                    <Link to='/settings'>
                                      <i className='m-nav__link-icon flaticon-settings' />
                                      <span className='m-nav__link-text'>&nbsp;&nbsp;&nbsp;Settings</span>
                                    </Link>
                                  </li>
                                  <li className='m-nav__separator m-nav__separator--fit' />
                                  <li className='m-nav__item'>
                                    <span onClick={() => { auth.logout() }} className='btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder'>
                                      Logout
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* <li className=' btn btn-sm m-btn m-btn--pill m-btn--gradient-from-focus m-btn--gradient-to-danger'>
                      <a href='http://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' style={{color: 'white', textDecoration: 'none'}}> Documentation </a>
                    </li> */}
                    </ul>
                  }
                </div>
              </div>
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

function mapStateToProps(state) {
  console.log('state in header', state)
  return {
    user: (state.basicInfo.user),
    socketData: (state.liveChat.socketData),
    socketSession: (state.liveChat.socketSession),
    subscribers: (state.subscribersInfo.subscribers),
    notifications: (state.notificationsInfo.notifications),
    updatedUser: (state.basicInfo.updatedUser),
    automated_options: (state.basicInfo.automated_options),
    userView: (state.backdoorInfo.userView),

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchNotifications: fetchNotifications,
    resetSocket: resetSocket,
    markRead: markRead,
    updateMode: updateMode,
    updateShowIntegrations,
    disconnectFacebook,
    updatePlatform,
    updatePicture
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
