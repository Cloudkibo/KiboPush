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
      userGuide: true
    }
    // props.fetchSessions({ company_id: this.props.user._id })
    this.openUserGuide = this.openUserGuide.bind(this)
    this.closeUserGuide = this.closeUserGuide.bind(this)
    this.showOperationalDashboard = this.showOperationalDashboard.bind(this)
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
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/dashboard' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-squares-4' />
                  <span className='m-menu__link-text'>Dashboard</span>
                </Link>
              </li>
              {this.state.broadcasts &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/convos' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-paper-plane' />
                  <span className='m-menu__link-text'>Broadcasts</span>
                </Link>
              </li>
              }
              {this.state.surveys &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/surveys' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-list-1' />
                  <span className='m-menu__link-text'>Surveys</span>
                </Link>
              </li>
              }
              {this.state.polls &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/poll' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-multimedia-2' />
                  <span className='m-menu__link-text'>Polls</span>
                </Link>
              </li>
              }
              {this.state.workflows &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/workflows' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-interface-8' />
                  <span className='m-menu__link-text'>Workflows</span>
                </Link>
              </li>
              }
              {this.state.livechat &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/live' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-chat-1' />
                  <span className='m-menu__link-text'>Live Chat</span>
                </Link>
              </li>
              }
              {this.state.autoposting &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/autoposting' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-signs-2' />
                  <span className='m-menu__link-text'>Auto Posting</span>
                </Link>
              </li>
              }
              {this.state.persistentMenu &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/menu' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-network' />
                  <span className='m-menu__link-text'>Persistent Menu</span>
                </Link>
              </li>
              }
              {this.state.pages &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/pages' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-add' />
                  <span className='m-menu__link-text'>Manage Pages</span>
                </Link>
              </li>
              }
              {this.state.subscribers &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/subscribers' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-users' />
                  <span className='m-menu__link-text'>Manage Subscriptions</span>
                </Link>
              </li>
              }
              {this.state.subscribeToMessenger &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/subscribeToMessenger' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-alarm' />
                  <span className='m-menu__link-text'>Subscribe to Messenger</span>
                </Link>
              </li>
              }
              {this.state.messengerLink &&
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/shareOptions' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-share' />
                  <span className='m-menu__link-text'>Messenger Link</span>
                </Link>
              </li>
              }
              {this.state.phoneNumber &&
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
              {this.state.settings &&
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
