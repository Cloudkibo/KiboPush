/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getuserdetails, getAutomatedOptions } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { fetchSessions, fetchSingleSession, fetchUserChats, resetSocket } from '../../redux/actions/livechat.actions'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      activeSession: '',
      currentProfile: {},
      loading: true,
      ignore: true,
      dashboard: true,
      broadcasts: true,
      surveys: true,
      polls: true,
      livechat: true,
      autoposting: true,
      persistentMenu: true,
      pages: true,
      subscribers: true,
      subscribeToMessenger: true,
      messengerLink: true,
      phoneNumber: true,
      settings: true,
      userGuide: true,
      inviteMembers: true,
      members: true,
      welcomeMessage: true,
      segmentSubscribers: true,
      commentCapture: true,
      smartReplies: true,
      templates: true,
      sequenceMessaging: true,
      waitingResponse: false
    }
    this.openUserGuide = this.openUserGuide.bind(this)
    this.closeUserGuide = this.closeUserGuide.bind(this)
    this.showOperationalDashboard = this.showOperationalDashboard.bind(this)
    this.showBroadcastTemplates = this.showBroadcastTemplates.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
    this.props.getAutomatedOptions()
  }

  openUserGuide () {
    this.setState({isShowingModal: true})
  }

  closeUserGuide () {
    this.setState({isShowingModal: false})
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in sidebar', nextProps)
    if (nextProps.user) {
      this.setState({broadcasts: nextProps.user.uiMode.broadcasts,
        polls: nextProps.user.uiMode.polls,
        surveys: nextProps.user.uiMode.surveys,
        sequenceMessaging: nextProps.user.uiMode.sequenceMessaging,
        templates: nextProps.user.uiMode.templates,
        livechat: nextProps.user.uiMode.livechat,
        smartReplies: nextProps.user.uiMode.smartReplies,
        abandonedCarts: nextProps.user.uiMode.abandonedCarts,
        subscribers: nextProps.user.uiMode.subscribers,
        segmentSubscribers: nextProps.user.uiMode.segmentSubscribers,
        autoposting: nextProps.user.uiMode.autoposting,
        persistentMenu: nextProps.user.uiMode.persistentMenu,
        pages: nextProps.user.uiMode.pages,
        phoneNumber: nextProps.user.uiMode.phoneNumber,
        inviteMembers: nextProps.user.uiMode.inviteMembers,
        members: nextProps.user.uiMode.members,
        welcomeMessage: nextProps.user.uiMode.welcomeMessage,
        commentCapture: nextProps.user.uiMode.commentCapture})
    }
  }
  showOperationalDashboard () {
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/operationalDashboard' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-statistics' title='Operational Dashboard' />
              <span className='m-menu__link-text'>Operational Dashboard</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  showCommentCapture () {
    if (this.props.user && this.props.user.advancedMode) {
      // include user persmissions
      if (this.state.commentCapture) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/commentCapture' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-comment' title='Comment Capture' />
              <span className='m-menu__link-text'>Comment Capture</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showSequenceMessaging () {
    if (this.props.user && this.state.sequenceMessaging && this.props.user.advancedMode) {
      if (this.props.user.isSuperUser) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/sequenceMessaging' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-dashboard' title='Sequence Messaging' />
              <span className='m-menu__link-text'>Sequence Messaging</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showDashboard () {
    if (this.props.user) {
      if (this.props.user.permissions.dashboardPermission && this.props.user.plan.dashboard) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/addfbpages' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-squares-4' title='Dashboard' />
              <span className='m-menu__link-text'>Dashboard</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showBroadcastsItem () {
    console.log('broadcasts state', this.state.broadcasts)
    if (this.props.user) {
      console.log('broadcasts props', this.props.user.uiMode)
      if (this.state.broadcasts && this.props.user.permissions.broadcastPermission && this.props.user.plan.broadcasts) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/broadcasts' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-paper-plane' title='Broadcasts' />
              <span className='m-menu__link-text'>Broadcasts</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showBroadcastTemplates () {
    if (this.props.user && this.props.user.isSuperUser && this.state.templates && this.props.user.advancedMode) {
      if ((this.props.user.role === 'buyer' || this.props.user.role === 'admin' || this.props.user.isSuperUser) && this.props.user.plan.broadcasts_templates) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/templates' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-file-1' title='Templates' />
              <span className='m-menu__link-text'>Templates</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showSurveysItem () {
    if (this.props.user) {
      if (this.state.surveys && this.props.user.permissions.surveyPermission && this.props.user.plan.surveys) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/surveys' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-statistics' title='Surveys' />
              <span className='m-menu__link-text'>Surveys</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showPollsItem () {
    if (this.props.user) {
      if (this.state.polls && this.props.user.permissions.pollsPermission && this.props.user.plan.polls) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/poll' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-graphic-2' title='Polls' />
              <span className='m-menu__link-text'>Polls</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showSmartRespliesItem () {
    // if (this.props.user && this.props.user.isSuperUser && this.state.smartReplies && this.props.user.advancedMode) {
    if (this.props.user && this.props.user.isSuperUser && this.state.smartReplies && this.props.user.advancedMode && this.props.automated_options && (this.props.automated_options.automated_options === 'MIX_CHAT' ||
     this.props.automated_options.automated_options === 'HUMAN_CHAT')) {
      return (
        <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
          <Link to='/bots' className='m-menu__link m-menu__toggle'>
            <i className='m-menu__link-icon flaticon-comment' title='Smart Replies' />
            <span className='m-menu__link-text'>Smart Replies</span>
          </Link>
        </li>
      )
    }
    // } else {
    //   return (null)
    // }
  }

  showLiveChatItem () {
    if (this.props.user && this.props.automated_options) {
      console.log('in live chat ' + this.props.automated_options)
      if (this.state.livechat && this.props.user.permissions.livechatPermission && this.props.user.plan.live_chat &&
          (this.props.automated_options.automated_options === 'MIX_CHAT' ||
           this.props.automated_options.automated_options === 'HUMAN_CHAT')) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/liveChat' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-chat-1' title='Live Chat' />
              <span className='m-menu__link-text'>Live Chat (Beta)</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showAutoPostingItem () {
    if (this.props.user) {
      if (this.state.autoposting && this.props.user.permissions.autopostingPermission && this.props.user.plan.autoposting) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/autoposting' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-time-3' title='Auto Posting' />
              <span className='m-menu__link-text'>Auto Posting</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showPersistentMenuItem () {
    if (this.props.user && this.props.user.advancedMode) {
      if (this.state.persistentMenu && this.props.user.permissions.menuPermission && this.props.user.plan.menu) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/menu' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-menu-button' title='Persistent Menu' />
              <span className='m-menu__link-text'>Persistent Menu</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showPagesItem () {
    if (this.props.user) {
      if (this.state.pages && this.props.user.permissions.pagesPermission && this.props.user.plan.manage_pages) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/pages' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-add' title='Manage Pages' />
              <span className='m-menu__link-text'>Manage Pages</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showSubscribersItem () {
    if (this.props.user) {
      if (this.state.subscribers && this.props.user.permissions.subscriberPermission && this.props.user.plan.manage_subscribers) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/subscribers' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-user-ok' title='Subscribers' />
              <span className='m-menu__link-text'>Subscribers</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  showCreatePhoneList () {
    if (this.state.segmentSubscribers && this.props.user && this.props.user.advancedMode && this.props.user.plan.customer_matching) {
      return (
        <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
          <Link to='/segmentedLists' className='m-menu__link m-menu__toggle'>
            <i className='m-menu__link-icon flaticon-list' title='Segment Subscribers' />
            <span className='m-menu__link-text'>Segment Subscribers</span>
          </Link>
        </li>
      )
    } else {
      return (null)
    }
  }
  showWelcomeMessageItem () {
    if (this.props.user) {
      if (this.state.welcomeMessage && this.props.user.permissions.pagesPermission) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/welcomeMessage' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-menu-button' title='Welcome Message' />
              <span className='m-menu__link-text'>Welcome Message</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showInviteMembersItem () {
    if (this.props.user) {
      if (this.state.inviteMembers && (this.props.user.permissions.inviteAdminPermission || this.props.user.permissions.inviteAgentPermission) && this.props.user.plan.invite_team) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/inviteMembers' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-user-add' title='Invite Memebers' />
              <span className='m-menu__link-text'>Invite Members</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showMembersItem () {
    if (this.props.user) {
      if (this.state.members && this.props.user.permissions.membersPermission && this.props.user.plan.team_members_management) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/members' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-users' title='Members' />
              <span className='m-menu__link-text'>Members</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showTeams () {
    if (this.props.user && this.props.user.advancedMode) {
      if (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D') {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/teams' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-map' title='Teams' />
              <span className='m-menu__link-text'>Teams</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  render () {
    console.log('render in sidebar')
    if (this.props.user && this.props.user.permissionsRevoked) {
      browserHistory.push({pathname: '/connectFb', state: {permissionsRevoked: true}})
    }
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
            data-menu-scrollable='1'>
            <div id='mCSB_2' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside' tabIndex='0' style={{maxHeight: 'none'}}>
              <div id='mCSB_2_container' className='mCSB_container' style={{position: 'relative', top: '0px', left: '0px'}} dir='ltr'>
                {this.props.user &&
                <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
                  {this.showOperationalDashboard()}
                  {this.showDashboard()}
                  {this.showBroadcastsItem()}
                  {this.showCommentCapture()}
                  {this.showSurveysItem()}
                  {this.showPollsItem()}
                  {this.showSmartRespliesItem()}
                  {this.showLiveChatItem()}
                  {this.showAutoPostingItem()}
                  {this.showPersistentMenuItem()}
                  {this.showPagesItem()}
                  {this.showSubscribersItem()}
                  {this.showSequenceMessaging()}
                  {this.showCreatePhoneList()}
                  {this.showInviteMembersItem()}
                  {this.showMembersItem()}
                  {this.showTeams()}
                  {this.showBroadcastTemplates()}
                  {this.props.user && this.props.user.advancedMode && this.state.phoneNumber && this.props.user.plan.customer_matching &&
                    <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                      <Link to='/customerMatchingUsingPhNum' className='m-menu__link m-menu__toggle'>
                        <i className='m-menu__link-icon flaticon-list-3' title='Invite using phone number' />
                        <span className='m-menu__link-text'>Invite using phone number</span>
                      </Link>
                    </li>
                  }
                  {this.state.settings &&
                    <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                      <Link to='/settings' className='m-menu__link m-menu__toggle'>
                        <i className='m-menu__link-icon flaticon-cogwheel' title='Settings' />
                        <span className='m-menu__link-text'>Settings</span>
                      </Link>
                    </li>
                  }
                  {this.state.userGuide &&
                    <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                      <a href='http://kibopush.com/user-guide/' target='_blank' className='m-menu__link m-menu__toggle'>
                        <i className='m-menu__link-icon flaticon-info' title='User Guide' />
                        <span className='m-menu__link-text'>User Guide</span>
                      </a>
                    </li>
                  }
                  {this.state.waitingResponse &&
                    <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                      <Link to='/waitingReplyList' className='m-menu__link m-menu__toggle'>
                        <i className='m-menu__link-icon flaticon-cogwheel' title='Waiting Response' />
                        <span className='m-menu__link-text'>Waiting Response</span>
                      </Link>
                    </li>
                 }
                </ul>
              }
              </div>
            </div>
            <div id='mCSB_2_scrollbar_vertical' className='mCSB_scrollTools mCSB_2_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical' style={{display: 'block'}}>
              <div className='mCSB_draggerContainer'>
                <div id='mCSB_2_dragger_vertical' className='mCSB_dragger' style={{position: 'absolute', minHeight: '50px', display: 'block', maxHeight: '303px', top: '0px'}}>
                  <div className='mCSB_dragger_bar' style={{lineHeight: '50px'}} />
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
  console.log('state in sidebar', state)
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
    getuserdetails: getuserdetails,
    getAutomatedOptions: getAutomatedOptions,
    fetchSessions: fetchSessions,
    fetchUserChats: fetchUserChats,
    resetSocket: resetSocket,
    fetchSingleSession: fetchSingleSession
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
