import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAutomatedOptions } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import {
  fetchSingleSession,
  fetchUserChats,
  resetSocket
} from '../../redux/actions/livechat.actions'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      menuItems: this.setMenuItems()
    }
    this.setMenuItems = this.setMenuItems.bind(this)
    this.isPlanFeature = this.isPlanFeature.bind(this)
  }

  setMenuItems () {
    const url = window.location.hostname
    let menuItems = []
    const isLocalhost = url.includes('localhost')
    const isKiboChat = url.includes('kibochat.cloudkibo.com')
    const isKiboEngage = url.includes('kiboengage.cloudkibo.com')
    const isKiboLite = url.includes('kibolite.cloudkibo.com')
    const platform = this.props.user.platform
    // growth tools
    // manage pages
    // Organization
    // abandoned carts
    // settings
    // user guide
    if (this.props.user.isSuperUser) {
      menuItems.push({
        priority: 0,
        name: 'Operational Dashboard',
        route: '/operationalDashboard'
      })
    }
    if (this.isPlanFeature('dashboard')) {
      menuItems.push({
        priority: 1,
        name: 'Dashboard',
        route: '/dashboard',
        routeState: {isKiboLite}
      })
    }
    if (!isKiboLite && platform === 'messenger') {
      let submenu = []
      if (this.isPlanFeature('manage_subscribers')) {
        submenu.push({
          priority: 0,
          name: 'Subscribers',
          route: '/subscribers'
        })
      }
      if (this.isPlanFeature('custom_fields')) {
        submenu.push({
          priority: 1,
          name: 'Custom Fields',
          route: '/customFields'
        })
      }
      if (this.isPlanFeature('tags')) {
        submenu.push({
          priority: 2,
          name: 'Tags',
          route: '/tags'
        })
      }
      menuItems.push({
        priority: 2,
        name: 'Subscriptions',
        submenu
      })
    }
    if (['sms', 'whatsApp'].includes(platform)) {
      menuItems.push({
        priority: 2,
        name: 'Subscribers',
        route: '/smsSubscribers'
      })
    }
    if (isKiboLite) {
      menuItems.push({
        priority: 3,
        name: 'Broadcast',
        route: '/businessGateway'
      })
    }
    if (isKiboEngage || isLocalhost) {
      let submenu = []
      if (this.isPlanFeature('broadcasts')) {
        submenu.push({
          priority: 0,
          name: 'Broadcasts',
          route: platform === 'messenger' ? '/broadcasts' : platform === 'sms' ? '/smsBroadcasts' : '/whatsAppBroadcasts'
        })
      }
      if (platform === 'messenger' && this.isPlanFeature('surveys')) {
        submenu.push({
          priority: 1,
          name: 'Surveys',
          route: '/surveys'
        })
      }
      if (platform === 'messenger' && this.isPlanFeature('polls')) {
        submenu.push({
          priority: 2,
          name: 'Polls',
          route: '/poll'
        })
      }
      if (platform === 'messenger' && this.isPlanFeature('segmentation_lists')) {
        submenu.push({
          priority: 3,
          name: 'Segment Subscribers',
          route: '/segmentedLists'
        })
      }
      if (platform === 'messenger' && (this.isPlanFeature('broadcasts_templates') || this.isPlanFeature('poll_templates') || this.isPlanFeature('survey_templates'))) {
        submenu.push({
          priority: 4,
          name: 'Templates',
          route: '/templates'
        })
      }
      if (platform === 'messenger' && this.isPlanFeature('sponsored_broadcast')) {
        submenu.push({
          priority: 5,
          name: 'Sponsored Broadcast (Beta)',
          route: '/sponsoredMessaging'
        })
      }
      menuItems.push({
        priority: 4,
        name: 'Broadcasting',
        submenu
      })
    }
    if (platform === 'sms') {
      menuItems.push({
        priority: 5,
        name: 'Upload Contacts',
        route: '/uploadContacts'
      })
    }
    if ((isKiboChat || isLocalhost) && this.isPlanFeature('livechat') && this.props.automated_options && ['MIX_CHAT', 'HUMAN_CHAT'].includes(this.props.automated_options.automated_options)) {
      menuItems.push({
        priority: 6,
        name: 'Live Chat',
        route: platform === 'messenger' ? '/liveChat' : platform === 'sms' ? '/smsChat' : '/whatsAppChat'
      })
    }
    if (isKiboEngage || isKiboChat || isLocalhost) {
      let submenu = []
      if ((isKiboChat || isLocalhost) && this.isPlanFeature('smart_replies') && this.props.automated_options && ['MIX_CHAT', 'AUTOMATED_CHAT'].includes(this.props.automated_options.automated_options)) {
        submenu.push({
          priority: 0,
          name: 'Smart Replies',
          route: '/bots'
        })
      }
      if ((isKiboChat || isLocalhost) && this.isPlanFeature('chatbot_automation')) {
        submenu.push({
          priority: 1,
          name: 'Chatbot Automation',
          route: '/chatbotAutomation'
        })
      }
      if ((isKiboEngage || isLocalhost) && this.isPlanFeature('autoposting')) {
        submenu.push({
          priority: 2,
          name: 'Autoposting',
          route: '/autoposting'
        })
      }
      if ((isKiboEngage || isLocalhost) && this.isPlanFeature('rss_integration')) {
        submenu.push({
          priority: 3,
          name: 'RSS Integration',
          route: '/rssIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost) && this.isPlanFeature('news_integration')) {
        submenu.push({
          priority: 4,
          name: 'News Integration',
          route: '/newsIntegration'
        })
      }
      if ((isKiboEngage || isLocalhost) && this.isPlanFeature('sequence_messaging')) {
        submenu.push({
          priority: 5,
          name: 'Sequence Messaging',
          route: '/sequenceMessaging'
        })
      }
      menuItems.push({
        priority: 7,
        name: 'Automation',
        submenu
      })
    }
    if (isKiboEngage || isLocalhost) {
      let submenu = []
      if (this.isPlanFeature('comment_capture')) {
        submenu.push({
          priority: 0,
          name: 'Comment Capture',
          route: '/commentCapture'
        })
      }
      if (this.isPlanFeature('customer_matching')) {
        submenu.push({
          priority: 1,
          name: 'Invite Using Phone Numbers',
          route: '/customerMatchingUsingPhNum'
        })
      }
      submenu.push({
        priority: 2,
        name: 'Invite Subscribers',
        route: '/inviteSubscribers'
      })
      if (this.isPlanFeature('messenger_code')) {
        submenu.push({
          priority: 3,
          name: 'Messenger Code',
          route: '/messengerCode'
        })
      }
      if (this.isPlanFeature('landing_pages')) {
        submenu.push({
          priority: 4,
          name: 'Landing Pages',
          route: '/landingPages'
        })
      }
      if (this.isPlanFeature('json_ads')) {
        submenu.push({
          priority: 5,
          name: 'JSON Ads',
          route: '/jsonAds'
        })
      }
      if (this.isPlanFeature('messenger_links')) {
        submenu.push({
          priority: 6,
          name: 'Messenger Ref Url',
          route: '/messengerRefURL'
        })
      }
      if (this.isPlanFeature('subscribe_to_messenger')) {
        submenu.push({
          priority: 7,
          name: 'Message Us Button',
          route: '/messageUs'
        })
      }
      if (this.isPlanFeature('customer_chat_plugin')) {
        submenu.push({
          priority: 8,
          name: 'Customer Chat Plugin',
          route: '/chatWidget'
        })
      }
      if (this.isPlanFeature('checkbox_plugin')) {
        submenu.push({
          priority: 9,
          name: 'Checkbox Plugin',
          route: '/checkbox'
        })
      }
      if (this.isPlanFeature('overlay_widgets') && this.props.user.isSuperUser) {
        submenu.push({
          priority: 9,
          name: 'Overlay Widgets',
          route: '/overlayWidgets'
        })
      }
      menuItems.push({
        priority: 8,
        name: 'Growth Tools',
        submenu
      })
    }
  }

  isPlanFeature (feature) {
    return this.props.user.plan[feature]
  }
}

function mapStateToProps (state) {
  console.log('mapStateToProps in sidebar', state)
  return {
    sessions: (state.liveChat.sessions),
    user: (state.basicInfo.user),
    updatedUser: (state.basicInfo.updatedUser),
    socketSession: (state.liveChat.socketSession),
    userChat: (state.liveChat.userChat),
    socketData: (state.liveChat.socketData),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getAutomatedOptions,
    fetchUserChats,
    resetSocket,
    fetchSingleSession
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
