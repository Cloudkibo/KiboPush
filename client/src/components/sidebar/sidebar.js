/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import Icon from 'react-icons-kit'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'
import UserGuide from '../../containers/userGuide/userGuide'
import { question } from 'react-icons-kit/icomoon'   // userGuide
import { dashboard } from 'react-icons-kit/fa/dashboard'  // dashboard
import { bullhorn } from 'react-icons-kit/fa/bullhorn'  // broadcats
import { listAlt } from 'react-icons-kit/fa/listAlt'  // poll
import { facebook } from 'react-icons-kit/fa/facebook'  // pages
import { ic_replay_30 } from 'react-icons-kit/md/ic_replay_30' // workflows
import { facebookSquare } from 'react-icons-kit/fa/facebookSquare' // subscribe
import { pencilSquareO } from 'react-icons-kit/fa/pencilSquareO'   // Autoposting
import { connect } from 'react-redux'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false
    }
    this.openUserGuide = this.openUserGuide.bind(this)
    this.closeUserGuide = this.closeUserGuide.bind(this)
    this.showOperationalDashboard = this.showOperationalDashboard.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
  }
  openUserGuide () {
    this.setState({isShowingModal: true})
  }

  closeUserGuide () {
    this.setState({isShowingModal: false})
  }
  showOperationalDashboard1 () {
    //  abc
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li>
            <Link to='/operationalDashboard'>
              <div data-toggle='tooltip' data-placement='right' title='' data-original-title='operationalDashboard' style={{paddingRight: 20}}>
                <Icon icon={dashboard} size={20} />
              </div>
              <span className='left-menu-title'>Operational Dashboard</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  showOperationalDashboard () {
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li>
            <Link to='/operationalDashboard' data-toggle='tooltip' data-for='operationalDashboard' data-tip>
              <div style={{paddingRight: 20}}>
                <Icon icon={dashboard} size={20} />
              </div>
            </Link>
            <ReactTooltip place='right' type='dark' effect='float' id='operationalDashboard'>
              <span>Operational Dashboard</span>
            </ReactTooltip>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  render () {
    return (
      <div className='fixed-sidebar open'>
        <div className='fixed-sidebar-left sidebar--small' id='sidebar-left'>
          <Link to='02-ProfilePage.html' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              <li>
                <a className='js-sidebar-open'>
                  <svg className='olymp-menu-icon left-menu-icon' >
                    <use xlinkHref='icons/icons.svg#olymp-menu-icon' />
                  </svg>
                </a>
              </li>
              {this.showOperationalDashboard()}
              <li>
                <Link to='/dashboard' data-toggle='tooltip' data-for='dashboard' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={dashboard} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='dashboard'>
                  <span>Dashboard</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/growthTools' data-for='growthTools' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={bullhorn} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='growthTools'>
                  <span>Growth Tools</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/subscribers' data-for='subscribers' data-tip>
                  <svg className='olymp-star-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-happy-faces-icon' />
                  </svg>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='subscribers'>
                  <span>Subscribers</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/convos' data-for='broadcasts' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={bullhorn} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='broadcasts'>
                  <span>Conversations</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/autoposting' data-for='autoposting' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={pencilSquareO} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='autoposting'>
                  <span>Autoposting</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/poll' data-for='poll' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={listAlt} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='poll'>
                  <span>Polls</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/surveys' data-for='surveys' data-tip>
                  <svg className='olymp-calendar-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-calendar-icon' />
                  </svg>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='surveys'>
                  <span>Surveys</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/workflows' data-for='workflows' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={ic_replay_30} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='workflows'>
                  <span>Workflows</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/subscribeToMessenger' data-for='subscribe' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={facebookSquare} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='subscribe'>
                  <span>Subscribe to Messenger</span>
                </ReactTooltip>
              </li>
              {
                /*
                     <li>
                <Link to='/stats' data-for='stats' data-tip>
                  <svg className='olymp-stats-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-stats-icon' />
                  </svg>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='stats'>
                  <span>Analytics</span>
                </ReactTooltip>
              </li>

                */
              }

              <li>
                <Link to='/pages' data-for='pages' data-tip>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={facebook} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='pages'>
                  <span>Pages</span>
                </ReactTooltip>

              </li>
              <li>
                <Link onClick={this.openUserGuide} data-for='userGuide' data-tip target='_blank'>
                  <div style={{paddingRight: 20}}>
                    <Icon icon={question} size={20} />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='userGuide'>
                  <span>User Guide</span>
                </ReactTooltip>
              </li>
            </ul>
          </div>
        </div>

        <div className='fixed-sidebar-left sidebar--large' id='sidebar-left-1'>
          <Link to='02-ProfilePage.html' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
            <h6 className='logo-title'>olympus</h6>
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              {this.showOperationalDashboard1()}
              <li>
                <Link to='/dashboard'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Dashboard' style={{paddingRight: 20}}>
                    <Icon icon={dashboard} size={20} />
                  </div>
                  <span className='left-menu-title'>Dashboard</span>
                </Link>
              </li>

              <li>
                <Link to='/subscribers'>
                  <svg className='olymp-happy-faces-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Subscribers'><use xlinkHref='icons/icons.svg#olymp-happy-faces-icon' /></svg>
                  <span className='left-menu-title'>Subscribers</span>
                </Link>
              </li>
              <li>
                <Link to='/convos'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Broadcasts' style={{paddingRight: 20}}>
                    <Icon icon={bullhorn} size={20} />
                  </div>
                  <span className='left-menu-title'>Conversations</span>
                </Link>
              </li>

              <li>
                <Link to='/autoposting'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Autoposting' style={{paddingRight: 20}}>
                    <Icon icon={pencilSquareO} size={20} />
                  </div>
                  <span className='left-menu-title'>Autoposting</span>
                </Link>
              </li>
              <li>
                <Link to='/poll'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Polls' style={{paddingRight: 20}}>
                    <Icon icon={listAlt} size={20} />
                  </div>
                  <span className='left-menu-title'>Polls</span>
                </Link>
              </li>
              <li>
                <Link to='/surveys'>
                  <svg className='olymp-calendar-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Surveys'><use xlinkHref='icons/icons.svg#olymp-calendar-icon' /></svg>
                  <span className='left-menu-title'>Surveys</span>
                </Link>
              </li>
              <li>
                <Link to='/workflows'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Workflows' style={{paddingRight: 20}}>
                    <Icon icon={ic_replay_30} size={20} />
                  </div>
                  <span className='left-menu-title'>Workflows</span>
                </Link>
              </li>
              <li>
                <Link to='/subscribeToMessenger'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Subscribe To Messenger' style={{paddingRight: 20}}>
                    <Icon icon={facebookSquare} size={20} />
                  </div>
                  <span className='left-menu-title'>Subscribe To Messenger</span>
                </Link>
              </li>
              {/*
                <li>
                <Link to='stats'>
                  <svg className='olymp-stats-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Account Stats'><use xlinkHref='icons/icons.svg#olymp-stats-icon' /></svg>
                  <span className='left-menu-title'>Analytics</span>
                </Link>
                </li>
              */}

              <li>
                <Link to='/pages'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Pages' style={{paddingRight: 20}}>
                    <Icon icon={facebook} size={20} />
                  </div>
                  <span className='left-menu-title'>Pages</span>
                </Link>
              </li>
              <li>
                <Link onClick={this.openUserGuide}>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='User Guide' style={{paddingRight: 20}}>
                    <Icon icon={question} size={20} />
                  </div>
                  <span className='left-menu-title'>User Guide</span>
                </Link>
              </li>
            </ul>
          </div>
          {
                this.state.isShowingModal &&
                <ModalContainer style={{marginTop: '50px'}} onClose={this.closeUserGuide}>
                  <ModalDialog style={{marginTop: '50px'}} onClose={this.closeUserGuide}>
                    <UserGuide />
                  </ModalDialog>
                </ModalContainer>
              }
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
