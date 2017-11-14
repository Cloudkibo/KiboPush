/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
// import Joyride from 'react-joyride'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
// import Icon from 'react-icons-kit'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'
import UserGuide from '../../containers/userGuide/userGuide'
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
import Notification from 'react-web-notification'
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
      ignore: true
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
  showOperationalDashboard1 () {
    //  abc
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li>
            <Link to='/operationalDashboard'>
              <div data-toggle='tooltip' data-placement='right' title='' data-original-title='operationalDashboard' style={{paddingRight: 20}}>
                <img className='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />
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
          <li>
            <Link to='/operationalDashboard' data-toggle='tooltip' data-for='operationalDashboard' data-tip>
              <div style={{paddingRight: 20}}>
                <img className='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />
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

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    this.setState({ignore: true})

    if (nextProps.sessions) {
      this.setState({loading: false})
    }

    if (nextProps.socketSession !== '' && nextProps.socketSession !== this.props.socketSession) {
      this.setState({ignore: false, body: 'You got a new message from ' + nextProps.socketData.name + ' : ' + nextProps.socketData.text})
    }

    if (nextProps.socketSession && nextProps.socketSession !== '') {
      console.log('New Message Received at following session id', nextProps.socketSession)
      console.log('New Message data', nextProps.socketData)
      if (this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].session_id === nextProps.socketSession) {
        this.props.fetchUserChats(nextProps.socketSession)
      } else if (nextProps.socketSession !== '') {
        var isPresent = false
        this.props.sessions.map((sess) => {
          if (sess._id === nextProps.socketSession) {
            isPresent = true
          }
        })

        if (isPresent) {
          console.log('Session exists ignoring the message')
          this.props.resetSocket()
        } else {
          console.log('New Session Detected, initiating session fetch')
          this.props.fetchSessions({ company_id: this.props.user._id })
        }
      }
    }
  }

  handleNotificationOnShow () {
    this.setState({ignore: true})
  }

  onNotificationClick () {
    window.focus()
    console.log('Notificaation was clicked')
    this.setState({ignore: true})
  }

  render () {
    return (
      <div>
        <button className='m-aside-left-close  m-aside-left-close--skin-dark ' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item	m-aside-left  m-aside-left--skin-dark ' style={{height: 100 + 'vh'}}>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark '
            data-menu-vertical='true'
            data-menu-scrollable='false' data-menu-dropdown-timeout='500'
		>
            <ul className='m-menu__nav  m-menu__nav--dropdown-submenu-arrow '>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/dashboard' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-squares-4' />
                  <span className='m-menu__link-text'>
										Dashboard
									</span>
                </Link>
              </li>
              <li className='m-menu__section'>
                <h4 className='m-menu__section-text'>
									Actions
								</h4>
                <i className='m-menu__section-icon flaticon-more-v3' />
              </li>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/subscribers' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-users' />
                  <span className='m-menu__link-text'>
										Subscribers
									</span>
                </Link>
              </li>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <a href='#' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-rocket' />
                  <span className='m-menu__link-text'>
										Growth Tools
									</span>
                  <i className='m-menu__ver-arrow la la-angle-right' />
                </a>
                <div className='m-menu__submenu'>
                  <span className='m-menu__arrow' />
                  <ul className='m-menu__subnav'>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/customerMatchingUsingPhNum' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Customer Matching
												</span>
                      </Link>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/subscribeToMessenger' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Subscribe to Messenger
												</span>
                      </Link>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/shareOptions' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Share
												</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/live' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-chat-1' />
                  <span className='m-menu__link-text'>
										Live Chat
									</span>
                </Link>
              </li>

              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <a href='#' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-paper-plane' />
                  <span className='m-menu__link-text'>
										Broadcasting
									</span>
                  <i className='m-menu__ver-arrow la la-angle-right' />
                </a>
                <div className='m-menu__submenu'>
                  <span className='m-menu__arrow' />
                  <ul className='m-menu__subnav'>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/broadcasts' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Broadcasts
												</span>
                      </Link>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/surveys' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>Surveys</span>
                      </Link>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <a href='components/icons/lineawesome.html' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Polls
												</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <a href='#' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-share' />
                  <span className='m-menu__link-text'>
										Automation
									</span>
                  <i className='m-menu__ver-arrow la la-angle-right' />
                </a>
                <div className='m-menu__submenu'>
                  <span className='m-menu__arrow' />
                  <ul className='m-menu__subnav'>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <a href='components/icons/flaticon.html' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Autoposting
												</span>
                      </a>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <Link to='/workflows' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Workflows
												</span>
                      </Link>
                    </li>
                    <li className='m-menu__item ' aria-haspopup='true' >
                      <a href='components/icons/lineawesome.html' className='m-menu__link '>
                        <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                          <span />
                        </i>
                        <span className='m-menu__link-text'>
													Messenger Menu
												</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li className='m-menu__section'>
                <h4 className='m-menu__section-text'>
									Settings
								</h4>
                <i className='m-menu__section-icon flaticon-more-v3' />
              </li>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <Link to='/pages' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-add' />
                  <span className='m-menu__link-text'>
										Pages
									</span>
                </Link>
              </li>
              <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
                <a href='http://kibopush.com/user-guide/' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-info' />
                  <span className='m-menu__link-text'>
										User Guide
									</span>
                </a>
              </li>
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
