
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import auth from '../../utility/auth.service'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showViewingAsDropDown: false,
    }
    this.showViewingAsDropDown = this.showViewingAsDropDown.bind(this)

  }
  showViewingAsDropDown () {
    console.log('show viewing as dropdown')
    this.setState({showViewingAsDropDown: true})
  }

  removeActingAsUser () {
    auth.removeActingAsUser()
    window.location.reload()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in header', nextProps)
  }

  render () {
    let liveChatLink = '';
    let hostname = window.location.hostname;
    if (hostname === 'skiboengage.cloudkibo.com') {
      liveChatLink = 'https://skibochat.cloudkibo.com/liveChat'
    } else if (hostname === 'kiboengage.cloudkibo.com') {
      liveChatLink = 'https://kibochat.cloudkibo.com/liveChat'
    }
    return (
      <header className='m-grid__item    m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            {
              this.props.showTitle &&
              <div style={{paddingLeft: '20px'}} className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 style={{cursor: 'pointer'}} onClick={() => {this.props.history.push({pathname: '/'})}} className='m-brand__logo-wrapper'>
                    KIBOPUSH
                  </h4>
                </div>
              </div>
            }
            <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-topbar__nav-wrapper'>
                  <ul className='m-topbar__nav m-nav m-nav--inline'>
                  {this.props.user.isSuperUser && this.props.user.actingAsUser &&
                        <li style={{marginRight: '20px', padding: '0'}} className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                          <div style={{marginTop: '15px'}}>
                            <span className='m-topbar__userpic'>
                              <div style={{ display: 'inline-block', height: '41px' }}>

                                <span className='m-nav__link-text' style={{ lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <li className='m-menu__item  m-menu__item--submenu m-menu__item--relm-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                  <span style={{fontSize: '0.85em'}} onClick={this.showViewingAsDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
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
                                              <li style={{textAlign: 'center'}} className='m-nav__item'>
                                                <span>
                                                  Currently viewing as: <strong>{this.props.user.actingAsUser.name}</strong>
                                                </span>
                                              </li>
                                              <li style={{textAlign: 'center'}} className='m-nav__item'>
                                                <span onClick={this.removeActingAsUser} className='m-btn m-btn--pill m-btn--hover-brand btn btn-secondary' style={{cursor: 'pointer'}}>
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
                  {this.props.user && this.props.user.facebookInfo && this.props.otherPages &&
                    <li className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                      <a href='#/' className='m-nav__link m-dropdown__toggle'>
                        <span className='m-nav__link-badge m-badge m-badge--dot m-badge--info m--hide' />
                        <span className='m-nav__link-icon'>
                          <i className='flaticon-share' />
                        </span>
                      </a>
                      <div className='m-dropdown__wrapper'>
                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__body m-dropdown__body--paddingless'>
                            <div className='m-dropdown__content'>
                              <div className='m-scrollable' data-scrollable='false' data-max-height='380' data-mobile-max-height='200'>
                                <div className='m-nav-grid m-nav-grid--skin-light'>
                                  <div className='m-nav-grid__row'>
                                    {
                                    (window.location.hostname.toLowerCase().includes('kiboengage') && this.props.subscribers &&
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
                                    (window.location.hostname.toLowerCase().includes('kiboengage') && this.props.subscribers &&
                                    this.props.subscribers.length === 0)
                                    ? <Link to='/poll' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-time' />
                                      <span className='m-nav-grid__text'>Send New Poll</span>
                                    </Link>
                                    : (window.location.hostname.toLowerCase().includes('kiboengage')) ?<Link to='/poll' className='m-nav-grid__item'>
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
                                     : (window.location.hostname.toLowerCase().includes('kiboengage')) ?<Link to='/surveys' className='m-nav-grid__item'>
                                       <i className='m-nav-grid__icon flaticon-folder' />
                                       <span className='m-nav-grid__text'>Send New Survey</span>
                                     </Link>
                                      : null
                                  }
                                    {!window.location.hostname.toLowerCase().includes('kiboengage') ?
                                    <Link to='/bots' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-clipboard' />
                                      <span className='m-nav-grid__text'>Create New Bot</span>
                                    </Link>
                                     : null
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
                    <li className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                      <a href='#/' className='m-nav__link m-dropdown__toggle'>
                        <span className='m-topbar__userpic'>
                          <div style={{display: 'inline-block', marginRight: '5px'}}>
                            <img src={(this.props.user && this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic) ? this.props.user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless m--img-centered' alt='' />
                          </div>
                          <div style={{display: 'inline-block', height: '41px'}}>
                            <span className='m-nav__link-text' style={{lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center'}}>{(this.props.user) ? this.props.user.name : ''} <i className='fa fa-chevron-down' />
                            </span>
                          </div>
                        </span>
                        <span className='m-topbar__username m--hide'>
                          {(this.props.user) ? this.props.user.name : 'Richard Hennricks'}
                        </span>
                      </a>
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
                                  {(this.props.user) ? this.props.user.name : 'Richard Hennricks'}
                                </span>
                                <span className='m-card-user__email'>
                                  {(this.props.user) ? this.props.user.email : ''}
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
                                <li className='m-nav__item'>
                                { window.location.hostname.toLowerCase().includes('kiboengage') ?
                                    <a href={liveChatLink} target='_blank' rel='noopener noreferrer' className='m-nav__link'>
                                      <i className='m-nav__link-icon flaticon-chat-1' />
                                      <span className='m-nav__link-text'>Messages</span>
                                    </a>
                                    : <Link to='/liveChat' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-chat-1' />
                                    <span className='m-nav__link-text'>Messages</span>
                                  </Link>
                                  }
                                </li>
                                <li className='m-nav__separator m-nav__separator--fit' />
                                <li className='m-nav__item'>
                                  <a href='http://kibopush.com/faq/' taregt='_blank' className='m-nav__link'>
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
                                  <a href='#/' onClick={() => { auth.logout() }} className='btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder'>
                                    Logout
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className=' btn btn-sm m-btn m-btn--pill m-btn--gradient-from-focus m-btn--gradient-to-danger'>
                      <a href='https://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' style={{color: 'white', textDecoration: 'none'}}> Documentation </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    subscribers: (state.subscribersInfo.subscribers),
    otherPages: (state.pagesInfo.otherPages),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
