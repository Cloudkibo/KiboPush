/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAutomatedOptions } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { getCurrentProduct } from '../../utility/utils'

import MENUITEM from './menuItem'

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      menuItems: [],
      activeItem: ''
    }
    this.setMenuItems = this.setMenuItems.bind(this)
    this.setActiveItem = this.setActiveItem.bind(this)

    this.props.getAutomatedOptions()
  }

  setActiveItem (name) {
    const value = name.replace(/\s+/g, '')
    this.setState({activeItem: value.toLowerCase()})
  }

  setMenuItems (user, automated_options) {
    let menuItems = []
    const currentProduct = getCurrentProduct()
    const isLocalhost = (currentProduct === 'localhost')
    const isKiboChat = (currentProduct === 'KiboChat')
    const isKiboEngage = (currentProduct === 'KiboEngage')
    const isKiboLite = (currentProduct === 'KiboLite')
    const platform = user.platform
    const isMobile = this.props.isMobile
    let activeItem = this.state.activeItem

    if (!activeItem) {
      activeItem = isKiboChat ? 'livechat' : 'dashboard'
    }

    if (!isMobile && user.isSuperUser && (isKiboEngage || isLocalhost)) {
      menuItems.push({
        priority: 'a',
        name: 'Operational Dashboard',
        route: '/operationalDashboard',
        icon: 'flaticon-statistics'
      })
    }
    if (user.plan['dashboard']) {
      menuItems.push({
        priority: 'b',
        name: 'Dashboard',
        route: '/dashboard',
        routeState: { isKiboLite },
        icon: 'flaticon-squares-4'
      })
    }
    if (!isKiboLite && platform === 'messenger') {
      let submenu = []
      if (user.plan['manage_subscribers'] && user.permissions['subscriberPermission']) {
        submenu.push({
          priority: 'a',
          name: 'Subscribers',
          route: '/subscribers',
          icon: 'flaticon-user-ok'
        })
      }
      if (!isMobile && user.plan['manage_subscribers'] && user.permissions['subscriberPermission']) {
        submenu.push({
          priority: 'b',
          name: 'Custom Fields',
          route: '/customFields',
          icon: 'flaticon-profile'
        })
      }
      if (!isMobile && user.plan['manage_subscribers'] && user.permissions['subscriberPermission']) {
        submenu.push({
          priority: 'c',
          name: 'Tags',
          route: '/tags',
          icon: 'flaticon-interface-9'
        })
      }
      menuItems.push({
        priority: 'c',
        name: 'Subscriptions',
        submenu,
        icon: 'flaticon-users'
      })
    }
    if ((isKiboChat || isLocalhost) && platform === 'whatsApp' && user.currentPlan.unique_ID === 'plan_E') {
      let submenu = []
      submenu.push({
        priority: 'a',
        name: 'Automated Messages',
        nestedmenu: [
          {
            priority: 'b',
            name: 'Abandoned Cart',
            route: '/abandonedCart',
          },
          {
            priority: 'b',
            name: 'Orders CRM',
            route: '/ordersCRM',
          },
          {
            priority: 'b',
            name: 'Cash on Delivery',
            route: '/cashOnDelivery',
          }
        ]
      })
      submenu.push({
        priority: 'b',
        name: 'Manual Messages',
        nestedmenu: [
          {
            priority: 'b',
            name: 'Abandoned Cart',
            route: '/abandonedCartManual',
          },
          {
            priority: 'b',
            name: 'Orders CRM',
            route: '/ordersCRMManual',
          }
        ]
      })
      menuItems.push({
        priority: 'c',
        name: 'Commerce',
        submenu,
        icon: 'flaticon-cart'
      })
    }
    if (['sms', 'whatsApp'].includes(platform) && user.permissions['manage_subscribers']) {
      menuItems.push({
        priority: 'c',
        name: 'Subscribers',
        route: '/smsSubscribers',
        icon: 'flaticon-user-ok'
      })
    }
    if (!isMobile && isKiboLite) {
      menuItems.push({
        priority: 'd',
        name: 'Broadcast',
        route: '/businessGateway',
        icon: 'flaticon-network'
      })
    }
    if (!isMobile && (isKiboEngage || isLocalhost)) {
      let submenu = []
      if (user.plan['broadcasts'] && user.permissions['broadcastPermission']) {
        submenu.push({
          priority: 'a',
          name: 'Broadcasts',
          route: platform === 'messenger' ? '/broadcasts' : platform === 'sms' ? '/smsBroadcasts' : '/whatsAppBroadcasts'
        })
      }
      if (platform === 'messenger' && user.plan['surveys'] && user.permissions['surveyPermission']) {
        submenu.push({
          priority: 'b',
          name: 'Surveys',
          route: '/surveys'
        })
      }
      if (platform === 'messenger' && user.plan['polls'] && user.permissions['pollsPermission']) {
        submenu.push({
          priority: 'c',
          name: 'Polls',
          route: '/poll'
        })
      }
      if (platform === 'messenger') {
        submenu.push({
          priority: 'd',
          name: 'Segment Subscribers',
          route: '/segmentedLists'
        })
      }
      if (platform === 'messenger') {
        submenu.push({
          priority: 'e',
          name: 'Templates',
          route: '/templates'
        })
      }
      if (platform === 'messenger') {
        submenu.push({
          priority: 'f',
          name: 'Sponsored Broadcast (Beta)',
          route: '/sponsoredMessaging'
        })
      }
      menuItems.push({
        priority: 'e',
        name: 'Broadcasting',
        submenu,
        icon: 'flaticon-paper-plane'
      })
    }
    if (platform === 'sms') {
      menuItems.push({
        priority: 'f',
        name: 'Upload Contacts',
        route: '/uploadContacts',
        icon: 'fa fa-id-card-o'
      })
    }
    if (platform === 'whatsApp' && user.currentPlan.unique_ID !== 'plan_E') {
      menuItems.push({
        priority: 'f',
        name: 'Invite Subscribers',
        route: '/uploadContactsWhatsApp',
        icon: 'flaticon-user-add'
      })
    }
    if ((isKiboChat || isLocalhost) && user.plan['livechat'] && user.permissions['livechatPermission'] && ['MIX_CHAT', 'HUMAN_CHAT'].includes(automated_options.automated_options) && user.currentPlan.unique_ID !== 'plan_E') {
      menuItems.push({
        priority: 'g',
        name: 'Live Chat',
        route: platform === 'messenger' ? '/liveChat' : platform === 'sms' ? '/smsChat' : '/whatsAppChat',
        icon: 'flaticon-chat-1'
      })
    }
    if (!isMobile && (isKiboEngage || isKiboChat || isLocalhost) && user.currentPlan.unique_ID !== 'plan_E') {
      let submenu = []
      if ((isKiboChat || isLocalhost) && ['MIX_CHAT', 'AUTOMATED_CHAT'].includes(automated_options.automated_options)) {
        submenu.push({
          priority: 'a',
          name: 'Smart Replies',
          route: '/bots'
        })
      }
      if (platform !== 'messenger' && (isKiboChat || isLocalhost) && user.isSuperUser) {
        submenu.push({
          priority: 'b',
          name: 'Chatbots',
          route: '/chatbots'
        })
      }
      if (platform === 'messenger' && (isKiboChat || isLocalhost)) {
        submenu.push({
          priority: 'b',
          name: 'Chatbot Automation',
          route: '/chatbotAutomation'
        })
      }
      if ((isKiboEngage || isLocalhost) && user.plan['autoposting'] && user.permissions['autopostingPermission']) {
        submenu.push({
          priority: 'c',
          name: 'Autoposting',
          route: '/autoposting'
        })
      }
      if ((isKiboEngage || isLocalhost)) {
        submenu.push({
          priority: 'd',
          name: 'RSS Integration',
          route: '/rssIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost)) {
        submenu.push({
          priority: 'e',
          name: 'News Integration',
          route: '/newsIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost)) {
        submenu.push({
          priority: 'f',
          name: 'Sequence Messaging',
          route: '/sequenceMessaging'
        })
      }
      if (platform === 'whatsApp' && (isKiboChat || isLocalhost)) {
        submenu.push({
          priority: 'g',
          name: 'Commerce Chatbot',
          route: '/whatsAppCommerceChatbot'
        })
      }
      if (platform === 'whatsApp' && (isKiboChat || isLocalhost)) {
        submenu.push({
          priority: 'g',
          name: 'Airlines Chatbot',
          route: '/whatsAppAirlinesChatbot'
        })
      }
      menuItems.push({
        priority: 'h',
        name: 'Automation',
        submenu,
        icon: 'flaticon-share'
      })
    }
    if (!isMobile && (isKiboEngage || isLocalhost) && platform === 'messenger') {
      let submenu = []
      if (user) {
        submenu.push({
          priority: 'a',
          name: 'Comment Capture',
          route: '/commentCapture'
        })
      }
      if (user) {
        submenu.push({
          priority: 'b',
          name: 'Invite Using Phone Numbers',
          route: '/customerMatchingUsingPhNum'
        })
      }
      submenu.push({
        priority: 'c',
        name: 'Invite Subscribers',
        route: '/inviteSubscribers'
      })
      if (user) {
        submenu.push({
          priority: 'd',
          name: 'Messenger Code',
          route: '/messengerCode'
        })
      }
      if (user.isSuperUser) {
        submenu.push({
          priority: 'e',
          name: 'Landing Pages',
          route: '/landingPages'
        })
      }
      if (user.isSuperUser) {
        submenu.push({
          priority: 'f',
          name: 'JSON Ads',
          route: '/jsonAds'
        })
      }
      if (user) {
        submenu.push({
          priority: 'g',
          name: 'Messenger Ref Url',
          route: '/messengerRefURL'
        })
      }
      if (user) {
        submenu.push({
          priority: 'h',
          name: 'Message Us Button',
          route: '/messageUs'
        })
      }
      if (user) {
        submenu.push({
          priority: 'i',
          name: 'Customer Chat Plugin',
          route: '/chatWidget'
        })
      }
      if (user) {
        submenu.push({
          priority: 'j',
          name: 'Checkbox Plugin',
          route: '/checkbox'
        })
      }
      if (user.isSuperUser) {
        submenu.push({
          priority: 'k',
          name: 'Overlay Widgets',
          route: '/overlayWidgets'
        })
      }
      menuItems.push({
        priority: 'i',
        name: 'Growth Tools',
        submenu,
        icon: 'flaticon-diagram'
      })
    }
    if (platform === 'messenger') {
      let submenu = []
      if (user.plan['manage_pages'] && user.permissions['pagesPermission']) {
        submenu.push({
          priority: 'a',
          name: 'Pages',
          route: '/pages'
        })
      }
      if (!isMobile && user.plan['menu'] && user.permissions['menuPermission']) {
        submenu.push({
          priority: 'b',
          name: 'Persistent Menu',
          route: '/menu'
        })
      }
      if (!isMobile && user.plan['manage_pages'] && user.permissions['pagesPermission']) {
        submenu.push({
          priority: 'c',
          name: 'Welcome Message',
          route: '/welcomeMessage'
        })
      }
      if (!isMobile && user.plan['manage_pages'] && user.permissions['pagesPermission']) {
        submenu.push({
          priority: 'd',
          name: 'Greeting Text',
          route: '/greetingMessage'
        })
      }
      menuItems.push({
        priority: 'j',
        name: 'Manage Pages',
        submenu,
        icon: 'flaticon-add'
      })
    }
    if (!isMobile) {
      let submenu = []
      if (user.plan['invite_team'] && (user.permissions['inviteAdminPermission'] || user.permissions['inviteAgentPermission'])) {
        submenu.push({
          priority: 'a',
          name: 'Invite Members',
          route: '/inviteMembers'
        })
      }
      if (user.permissions['membersPermission'] && user.plan['team_members_management']) {
        submenu.push({
          priority: 'b',
          name: 'Members',
          route: '/members'
        })
      }
      if (user.plan['team_members_management']) {
        submenu.push({
          priority: 'c',
          name: 'Teams',
          route: '/teams'
        })
      }
      menuItems.push({
        priority: 'k',
        name: 'Organization',
        submenu,
        icon: 'flaticon-share'
      })
    }
    if (platform === 'messenger' && user.isSuperUser) {
      //       menuItems.push({
      //         priority: 'l',
      //         name: 'Abandoned Carts',
      //         route: '/abandonedCarts',
      //         icon: 'flaticon-comment'
      //       })
    }
    if (!isMobile) {
      menuItems.push({
        priority: 'm',
        name: 'Settings',
        route: '/settings',
        icon: 'flaticon-cogwheel'
      })
    }
    menuItems.push({
      priority: 'o',
      name: 'User Guide',
      link: 'http://kibopush.com/user-guide/',
      icon: 'flaticon-info'
    })
    return {menuItems: menuItems.sort((a, b) => (a.priority > b.priority) ? 1 : -1), activeItem}
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.automated_options) {
      const { menuItems, activeItem } = this.setMenuItems(nextProps.user, nextProps.automated_options)
      this.setState({ menuItems, activeItem })
    }
  }

  render() {
    return (
      <div id='sidebarDiv'>
        <button className='m-aside-left-close  m-aside-left-close--skin-dark ' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item m-aside-left  m-aside-left--skin-dark'>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark m-scroller mCustomScrollbar _mCS_2 mCS-autoHide'
            data-menu-vertical='1'
            data-menu-scrollable='1'
          >
            <div id='mCSB_2' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside' tabIndex='0' style={{ maxHeight: 'none' }}>
              <div id='mCSB_2_container' className='mCSB_container' style={{ position: 'relative', top: '0px', left: '0px' }} dir='ltr'>
                <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
                  {
                    this.state.menuItems.map((item, index) => (
                      <MENUITEM
                        {...item}
                        activeItem={this.state.activeItem}
                        onItemClick={this.setActiveItem}
                      />
                    ))
                  }
                </ul>
              </div>
            </div>
            <div id='mCSB_2_scrollbar_vertical' className='mCSB_scrollTools mCSB_2_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical' style={{ display: 'block' }}>
              <div className='mCSB_draggerContainer'>
                <div id='mCSB_2_dragger_vertical' className='mCSB_dragger' style={{ position: 'absolute', minHeight: '50px', display: 'block', maxHeight: '303px', top: '0px' }}>
                  <div className='mCSB_dragger_bar' style={{ lineHeight: '50px' }} />
                </div>
                <div className='mCSB_draggerRail' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    isMobile: (state.basicInfo.isMobile),
    updatedUser: (state.basicInfo.updatedUser),
    socketSession: (state.liveChat.socketSession),
    userChat: (state.liveChat.userChat),
    socketData: (state.liveChat.socketData),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAutomatedOptions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
