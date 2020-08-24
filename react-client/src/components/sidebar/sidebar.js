import React, {Component} from 'react'
import { connect } from 'react-redux'
import { getAutomatedOptions } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import MENUITEM from './menuItem'

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      menuItems: []
    }
    this.setMenuItems = this.setMenuItems.bind(this)

    this.props.getAutomatedOptions()
  }

  setMenuItems (user, automated_options) {
    const url = window.location.hostname
    let menuItems = []
    const isLocalhost = url.includes('localhost')
    const isKiboChat = url.includes('kibochat.cloudkibo.com')
    const isKiboEngage = url.includes('kiboengage.cloudkibo.com')
    const isKiboLite = url.includes('kibolite.cloudkibo.com')
    const platform = user.platform
    if (user.isSuperUser && (isKiboEngage || isLocalhost)) {
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
        routeState: {isKiboLite},
        icon: 'flaticon-squares-4'
      })
    }
    if (!isKiboLite && platform === 'messenger') {
      let submenu = []
      if (user.plan['manage_subscribers'] && user.permissions['view_subscribers']) {
        submenu.push({
          priority: 'a',
          name: 'Subscribers',
          route: '/subscribers',
          icon: 'flaticon-user-ok'
        })
      }
      if (user.plan['custom_fields'] && user.permissions['view_custom_fields']) {
        submenu.push({
          priority: 'b',
          name: 'Custom Fields',
          route: '/customFields',
          icon: 'flaticon-profile'
        })
      }
      if (user.plan['tags'] && user.permissions['view_tags']) {
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
    if (['sms', 'whatsApp'].includes(platform) && user.permissions['view_subscribers']) {
      menuItems.push({
        priority: 'c',
        name: 'Subscribers',
        route: '/smsSubscribers',
        icon: 'flaticon-user-ok'
      })
    }
    if (isKiboLite) {
      menuItems.push({
        priority: 'd',
        name: 'Broadcast',
        route: '/businessGateway',
        icon: 'flaticon-network'
      })
    }
    if (isKiboEngage || isLocalhost) {
      let submenu = []
      if (user.plan['broadcasts'] && user.permissions['view_broadcasts']) {
        submenu.push({
          priority: 'a',
          name: 'Broadcasts',
          route: platform === 'messenger' ? '/broadcasts' : platform === 'sms' ? '/smsBroadcasts' : '/whatsAppBroadcasts'
        })
      }
      if (platform === 'messenger' && user.plan['surveys'] && user.permissions['view_surveys']) {
        submenu.push({
          priority: 'b',
          name: 'Surveys',
          route: '/surveys'
        })
      }
      if (platform === 'messenger' && user.plan['polls'] && user.permissions['view_polls']) {
        submenu.push({
          priority: 'c',
          name: 'Polls',
          route: '/poll'
        })
      }
      if (platform === 'messenger' && user.plan['segmentation_lists'] && user.permissions['view_segmentation_lists']) {
        submenu.push({
          priority: 'd',
          name: 'Segment Subscribers',
          route: '/segmentedLists'
        })
      }
      if (platform === 'messenger' && (user.plan['broadcasts_templates'] || user.plan['poll_templates'] || user.plan['survey_templates'])) {
        submenu.push({
          priority: 'e',
          name: 'Templates',
          route: '/templates'
        })
      }
      if (platform === 'messenger' && user.plan['sponsored_broadcast'] && user.permissions['view_sponsored_broadcast']) {
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
    if (platform === 'whatsApp') {
      menuItems.push({
        priority: 'f',
        name: 'Invite Subscribers',
        route: '/uploadContactsWhatsApp',
        icon: 'flaticon-user-add'
      })
    }
    if ((isKiboChat || isLocalhost) && user.plan['livechat'] && user.permissions['manage_livechat'] && ['MIX_CHAT', 'HUMAN_CHAT'].includes(automated_options.automated_options)) {
      menuItems.push({
        priority: 'g',
        name: 'Live Chat',
        route: platform === 'messenger' ? '/liveChat' : platform === 'sms' ? '/smsChat' : '/whatsAppChat',
        icon: 'flaticon-chat-1'
      })
    }
    if (isKiboEngage || isKiboChat || isLocalhost) {
      let submenu = []
      if ((isKiboChat || isLocalhost) && user.plan['smart_replies'] && user.permissions['view_bots'] && ['MIX_CHAT', 'AUTOMATED_CHAT'].includes(automated_options.automated_options)) {
        submenu.push({
          priority: 'a',
          name: 'Smart Replies',
          route: '/bots'
        })
      }
      if ((isKiboChat || isLocalhost) && user.plan['chatbot_automation'] && user.permissions['configure_chatbot_automation']) {
        submenu.push({
          priority: 'b',
          name: 'Chatbot Automation',
          route: '/chatbotAutomation'
        })
      }
      if ((isKiboChat || isLocalhost) && user.isSuperUser && user.plan['chatbot_automation'] && user.permissions['configure_chatbot_automation']) {
        submenu.push({
          priority: 'b',
          name: 'Chatbot Automation (NEW)',
          route: '/chatbotAutomationNew'
        })
      }
      if ((isKiboEngage || isLocalhost) && user.plan['autoposting'] && user.permissions['view_autoposting_feeds']) {
        submenu.push({
          priority: 'c',
          name: 'Autoposting',
          route: '/autoposting'
        })
      }
      if ((isKiboEngage || isLocalhost) && user.plan['rss_integration'] && user.permissions['view_rss_fedds']) {
        submenu.push({
          priority: 'd',
          name: 'RSS Integration',
          route: '/rssIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost) && user.plan['news_integration'] && user.permissions['view_news_fedds']) {
        submenu.push({
          priority: 'e',
          name: 'News Integration',
          route: '/newsIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost) && user.plan['sequence_messaging'] && user.permissions['view_sequences']) {
        submenu.push({
          priority: 'f',
          name: 'Sequence Messaging',
          route: '/sequenceMessaging'
        })
      }
      if ((isKiboChat || isLocalhost) && platform === 'whatsApp') {
        submenu.push({
          priority: 'g',
          name: 'Chatbot',
          route: '/whatsAppChatbot'
        })
      }
      menuItems.push({
        priority: 'h',
        name: 'Automation',
        submenu,
        icon: 'flaticon-share'
      })
    }
    if (isKiboEngage || isLocalhost) {
      let submenu = []
      if (user.plan['comment_capture'] && user.permissions['view_comment_capture_rules']) {
        submenu.push({
          priority: 'a',
          name: 'Comment Capture',
          route: '/commentCapture'
        })
      }
      if (user.plan['customer_matching'] && user.permissions['invite_subscribers_using_phone_number']) {
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
      if (user.plan['messenger_code'] && user.permissions['view_messenger_codes']) {
        submenu.push({
          priority: 'd',
          name: 'Messenger Code',
          route: '/messengerCode'
        })
      }
      if (user.plan['landing_pages']) {
        submenu.push({
          priority: 'e',
          name: 'Landing Pages',
          route: '/landingPages'
        })
      }
      if (user.plan['json_ads']) {
        submenu.push({
          priority: 'f',
          name: 'JSON Ads',
          route: '/jsonAds'
        })
      }
      if (user.plan['messenger_links'] && user.permissions['view_messenger_ref_urls']) {
        submenu.push({
          priority: 'g',
          name: 'Messenger Ref Url',
          route: '/messengerRefURL'
        })
      }
      if (user.plan['subscribe_to_messenger']) {
        submenu.push({
          priority: 'h',
          name: 'Message Us Button',
          route: '/messageUs'
        })
      }
      if (user.plan['customer_chat_plugin']) {
        submenu.push({
          priority: 'i',
          name: 'Customer Chat Plugin',
          route: '/chatWidget'
        })
      }
      if (user.plan['checkbox_plugin']) {
        submenu.push({
          priority: 'j',
          name: 'Checkbox Plugin',
          route: '/checkbox'
        })
      }
      if (user.plan['overlay_widgets'] && user.isSuperUser) {
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
      if (user.plan['manage_pages'] && user.permissions['manage_facebook_pages']) {
        submenu.push({
          priority: 'a',
          name: 'Pages',
          route: '/pages'
        })
      }
      if (user.plan['menu'] && user.permissions['set_persistent_menu']) {
        submenu.push({
          priority: 'b',
          name: 'Persistent Menu',
          route: '/menu'
        })
      }
      if (user.plan['welcome_message'] && user.permissions['manage_welcome_message']) {
        submenu.push({
          priority: 'c',
          name: 'Welcome Message',
          route: '/welcomeMessage'
        })
      }
      if (user.plan['greeting_text'] && user.permissions['manage_greeting_text']) {
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
    if (true) {
      let submenu = []
      if (user.plan['invite_members'] && user.permissions['invite_members']) {
        submenu.push({
          priority: 'a',
          name: 'Invite Members',
          route: '/inviteMembers'
        })
      }
      if (user.permissions['view_members']) {
        submenu.push({
          priority: 'b',
          name: 'Members',
          route: '/members'
        })
      }
      if (user.plan['team_members_management'] && user.permissions['view_teams']) {
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
    menuItems.push({
      priority: 'm',
      name: 'Settings',
      route: '/settings',
      icon: 'flaticon-cogwheel'
    })
    menuItems.push({
      priority: 'n',
      name: 'User Guide',
      link: 'http://kibopush.com/user-guide/',
      icon: 'flaticon-info'
    })
    return menuItems.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.automated_options) {
       this.setState({menuItems: this.setMenuItems(nextProps.user, nextProps.automated_options)})
    }
  }

  render () {
    return (
      <div id='sidebarDiv'>
        <button className='m-aside-left-close m-aside-left-close--skin-dark' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item m-aside-left  m-aside-left--skin-dark'>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark m-scroller mCustomScrollbar _mCS_2 mCS-autoHide'
            data-menu-vertical='1'
            data-menu-scrollable='1'
          >
            <div id='mCSB_2' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside' tabIndex='0' style={{maxHeight: 'none'}}>
              <div id='mCSB_2_container' className='mCSB_container' style={{position: 'relative', top: '0px', left: '0px'}} dir='ltr'>
                <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
                  {
                    this.state.menuItems.map((item, index) => (
                      <MENUITEM {...item} />
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

function mapStateToProps (state) {
  console.log('mapStateToProps in sidebar', state)
  return {
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAutomatedOptions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
