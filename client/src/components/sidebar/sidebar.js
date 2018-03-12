/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
// import Joyride from 'react-joyride'
import { Link } from 'react-router'
// import Icon from 'react-icons-kit'
//  import {ModalContainer, ModalDialog} from 'react-modal-dialog'
//  import UserGuide from '../../containers/userGuide/userGuide'
// import { question } from 'react-icons-kit/icomoon'   // userGuide
// import { dashboard } from 'react-icons-kit/fa/dashboard'  // dashboard
// import { bullhorn } from 'react-icons-kit/fa/bullhorn'  // broadcats
// import { listAlt } from 'react-icons-kit/fa/listAlt'  // poll
// import { facebook } from 'react-icons-kit/fa/facebook'  // pages
// import { ic_replay_30 } from 'react-icons-kit/md/ic_replay_30' // workflows
// import { facebookSquare } from 'react-icons-kit/fa/facebookSquare' // subscribe
// import { pencilSquareO } from 'react-icons-kit/fa/pencilSquareO'   // Autoposting
import { connect } from 'react-redux'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { fetchSessions, fetchSingleSession, fetchUserChats, resetSocket } from '../../redux/actions/livechat.actions'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      steps: [],
      activeSession: '',
      currentProfile: {},
      loading: true,
      ignore: true,
      dashboard: true,
      broadcasts: true,
      surveys: true,
      polls: true,
      workflows: true,
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
      createPhoneList: true
    }
    // props.fetchSessions({ company_id: this.props.user._id })
    this.openUserGuide = this.openUserGuide.bind(this)
    this.closeUserGuide = this.closeUserGuide.bind(this)
    this.showOperationalDashboard = this.showOperationalDashboard.bind(this)
    this.showBroadcastTemplates = this.showBroadcastTemplates.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
  }
  componentDidMount () {
    this.addSteps([
      {
        title: 'Dashboard',
        text: 'The Dashboard provides you with a summary of information regarding your pages',
        selector: 'li#dashboard',
        position: 'top-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Growth Tools',
        text: 'The growth tools allow you to upload csv files of customers, to integrate with messenger',
        selector: 'li#growthTools',
        position: 'left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Subscribers',
        text: 'It allows you to see the list of subscribers',
        selector: 'li#subscribers',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Conversation',
        text: 'Allow you to broadcast a totally customizable message to your subscribers',
        selector: 'li#convos',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Auto-Posting',
        text: 'Details of Auto-Posting',
        selector: 'li#autoposting',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Polls',
        text: 'Allows you to send Polls to your subscribers',
        selector: 'li#polls',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Surveys',
        text: 'Allows you to send multiple polls',
        selector: 'li#surveys',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Workflows',
        text: 'Workflows allow you to auto-reply to certain keywords or messages to your page',
        selector: 'li#workflows',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Pages',
        text: 'Allows you to connect or disconnect pages',
        selector: 'li#pages',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'UserGuide',
        text: 'Still confused? Check our User Guide',
        selector: 'li#userguide',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true}

    ])

    if (!this.state.ignore) {
      this.setState({ignore: true})
    }
  }
  openUserGuide () {
    this.setState({isShowingModal: true})
  }

  closeUserGuide () {
    this.setState({isShowingModal: false})
  }
  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
  }

  showOperationalDashboard () {
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/operationalDashboard' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-statistics' />
              <span className='m-menu__link-text'>Operational Dashboard</span>
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
            <Link to='/dashboard' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-squares-4' />
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
    if (this.props.user) {
      if (this.state.broadcasts && this.props.user.permissions.broadcastPermission && this.props.user.plan.broadcasts) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/convos' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-paper-plane' />
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
    if (this.props.user && this.props.user.isSuperUser) {
      if ((this.props.user.role === 'buyer' || this.props.user.role === 'admin' || this.props.user.isSuperUser) && this.props.user.plan.broadcasts_templates) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/templates' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-file-1' />
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
              <i className='m-menu__link-icon flaticon-list-1' />
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
              <i className='m-menu__link-icon flaticon-multimedia-2' />
              <span className='m-menu__link-text'>Polls</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showWorkflowsItem () {
    if (this.props.user) {
      if (this.state.workflows && this.props.user.permissions.workflowPermission && this.props.user.plan.workflows) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/workflows' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-interface-8' />
              <span className='m-menu__link-text'>Workflows</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  showLiveChatItem () {
    if (this.props.user && this.props.user.isSuperUser) {
      if (this.state.livechat && this.props.user.permissions.livechatPermission && this.props.user.plan.live_chat) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/live' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-chat-1' />
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
              <i className='m-menu__link-icon flaticon-signs-2' />
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
    if (this.props.user) {
      if (this.state.persistentMenu && this.props.user.permissions.menuPermission && this.props.user.plan.menu) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/menu' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-network' />
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
              <i className='m-menu__link-icon flaticon-add' />
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
              <i className='m-menu__link-icon flaticon-users' />
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
    if (this.props.user && this.props.user.isSuperUser) {
      if (this.state.createPhoneList && this.props.user && this.props.user.permissions.pagesPermission) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/segmentedLists' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-list' />
              <span className='m-menu__link-text'>Segment Subscribers</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  showWelcomeMessageItem () {
    if (this.props.user) {
      if (this.state.welcomeMessage && this.props.user.permissions.pagesPermission) {
        return (
          <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
            <Link to='/welcomeMessage' className='m-menu__link m-menu__toggle'>
              <i className='m-menu__link-icon flaticon-menu-button' />
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
              <i className='m-menu__link-icon flaticon-add' />
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
              <i className='m-menu__link-icon flaticon-add' />
              <span className='m-menu__link-text'>Members</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }

  render () {
    return (
      <div>
        <button className='m-aside-left-close  m-aside-left-close--skin-dark ' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item m-aside-left  m-aside-left--skin-dark ' style={{height: 100 + '%'}}>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark '
            data-menu-vertical='true'
            data-menu-scrollable='false' data-menu-dropdown-timeout='500'>
            <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
              {this.showOperationalDashboard()}
              {this.showDashboard()}
              {this.showBroadcastsItem()}
              {this.showSurveysItem()}
              {this.showPollsItem()}
              {this.showWorkflowsItem()}
              {this.showLiveChatItem()}
              {this.showAutoPostingItem()}
              {this.showPersistentMenuItem()}
              {this.showPagesItem()}
              {this.showSubscribersItem()}
              {/* this.showWelcomeMessageItem() */}
              {this.showCreatePhoneList()}
              {/* this.props.user && this.state.subscribeToMessenger && this.props.user.plan.subscribe_to_messenger &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/subscribeToMessenger' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-alarm' />
                  <span className='m-menu__link-text'>Subscribe to Messenger</span>
                </Link>
              </li> */
              }
              {this.showInviteMembersItem()}
              {this.showMembersItem()}
              {this.showBroadcastTemplates()}
              {/* this.props.user && this.state.messengerLink && this.props.user.plan.messenger_links &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/shareOptions' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-share' />
                  <span className='m-menu__link-text'>Messenger Link</span>
                </Link>
              </li>
              */}
              {this.props.user && this.state.phoneNumber && this.props.user.plan.customer_matching &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/customerMatchingUsingPhNum' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-file' />
                  <span className='m-menu__link-text'>Invite using phone number</span>
                </Link>
              </li>
              }
              {this.state.settings &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/settings' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-cogwheel' />
                  <span className='m-menu__link-text'>Settings</span>
                </Link>
              </li>
              }
              {this.state.userGuide &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <a href='http://kibopush.com/user-guide/' target='_blank' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-info' />
                  <span className='m-menu__link-text'>User Guide</span>
                </a>
              </li>
              }
            </ul>
          </div>

        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    sessions: (state.liveChat.sessions),
    user: (state.basicInfo.user),
    socketSession: (state.liveChat.socketSession),
    userChat: (state.liveChat.userChat),
    socketData: (state.liveChat.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    fetchSessions: fetchSessions,
    fetchUserChats: fetchUserChats,
    resetSocket: resetSocket,
    fetchSingleSession: fetchSingleSession
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
