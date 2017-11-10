/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import auth from '../../utility/auth.service'
import { connect } from 'react-redux'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
class Header extends React.Component {
  componentWillMount () {
    this.props.getuserdetails()
  }
  render () {
    console.log('This user details', this.props.user)

    return (
      	<header className='m-grid__item    m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div className='m-stack__item m-brand  m-brand--skin-dark '>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 className='m-brand__logo-wrapper' style={{color: 'white'}}>
                    {/* <img alt="" src="assets/demo/default/media/img/logo/logo_default_dark.png"/> */}
                    KIBOPUSH
									</h4>
                </div>
                <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                  <a href='javascript:;' id='m_aside_left_minimize_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block'>
                    <span />
                  </a>
                  <a href='javascript:;' id='m_aside_left_offcanvas_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </a>

                  <a id='m_aside_header_menu_mobile_toggle' href='javascript:;' className='m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block'>
                    <span />
                  </a>
                  <a id='m_aside_header_topbar_mobile_toggle' href='javascript:;' className='m-brand__icon m--visible-tablet-and-mobile-inline-block'>
                    <i className='flaticon-more' />
                  </a>
                </div>
              </div>
            </div>
            <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <button className='m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-dark ' id='m_aside_header_menu_mobile_close_btn'>
                <i className='la la-close' />
              </button>
              <div id='m_header_menu' className='m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark ' >
                <ul className='m-menu__nav  m-menu__nav--submenu-arrow '>
                  <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-menu-submenu-toggle='click' data-redirect='true' aria-haspopup='true'>
                    <a href='#' className='m-menu__link m-menu__toggle'>
                      <i className='m-menu__link-icon flaticon-add' />
                      <span className='m-menu__link-text'>
												Quick Actions
											</span>
                      <i className='m-menu__hor-arrow la la-angle-down' />
                      <i className='m-menu__ver-arrow la la-angle-right' />
                    </a>
                    <div className='m-menu__submenu m-menu__submenu--classic m-menu__submenu--left'>
                      <span className='m-menu__arrow m-menu__arrow--adjust' />
                      <ul className='m-menu__subnav'>
                        <li className='m-menu__item ' aria-haspopup='true'>
                          <a href='header/actions.html' className='m-menu__link '>
                            <i className='m-menu__link-icon flaticon-tool-1' />
                            <span className='m-menu__link-text'>
															Send Page Invites
														</span>
                          </a>
                        </li>
                        <li className='m-menu__item ' data-redirect='true' aria-haspopup='true'>
                          <a href='header/actions.html' className='m-menu__link '>
                            <i className='m-menu__link-icon flaticon-interface-8' />
                            <span className='m-menu__link-text'>
																	Setup Messenger Menu
                            </span>
                          </a>
                        </li>

                        <li className='m-menu__item ' data-redirect='true' aria-haspopup='true'>
                          <a href='header/actions.html' className='m-menu__link '>
                            <i className='m-menu__link-icon flaticon-users' />
                            <span className='m-menu__link-text'>
															Subscribe to Messenger
														</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-topbar__nav-wrapper'>
                  <ul className='m-topbar__nav m-nav m-nav--inline'>

                    <li className='m-nav__item m-topbar__notifications m-topbar__notifications--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-center 	m-dropdown--mobile-full-width' data-dropdown-toggle='click' data-dropdown-persistent='true'>
                      <a href='#' className='m-nav__link m-dropdown__toggle' id='m_topbar_notification_icon'>
                        <span className='m-nav__link-badge m-badge m-badge--dot m-badge--dot-small m-badge--danger' />
                        <span className='m-nav__link-icon'>
                          <i className='flaticon-music-2' />
                        </span>
                      </a>
                      <div className='m-dropdown__wrapper'>
                        <span className='m-dropdown__arrow m-dropdown__arrow--center' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__body'>
                            <div className='m-dropdown__content'>
                              <ul className='nav nav-tabs m-tabs m-tabs-line m-tabs-line--brand' role='tablist'>
                                <li className='nav-item m-tabs__item'>
                                  <a className='nav-link m-tabs__link active' data-toggle='tab' href='#topbar_notifications_notifications' role='tab'>
																		Alerts
																	</a>
                                </li>
                              </ul>
                              <div className='tab-content'>
                                <div className='tab-pane active' id='topbar_notifications_notifications' role='tabpanel'>
                                  <div className='m-scrollable' data-scrollable='true' data-max-height='250' data-mobile-max-height='200'>
                                    <div className='m-list-timeline m-list-timeline--skin-light'>
                                      <div className='m-list-timeline__items'>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge -m-list-timeline__badge--state-success' />
                                          <span className='m-list-timeline__text'>
																						12 new users registered
																					</span>
                                          <span className='m-list-timeline__time'>
																						Just now
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						System shutdown
																						<span className='m-badge m-badge--success m-badge--wide'>
																							pending
																						</span>
                                          </span>
                                          <span className='m-list-timeline__time'>
																						14 mins
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						New invoice received
																					</span>
                                          <span className='m-list-timeline__time'>
																						20 mins
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						DB overloaded 80%
																						<span className='m-badge m-badge--info m-badge--wide'>
																							settled
																						</span>
                                          </span>
                                          <span className='m-list-timeline__time'>
																						1 hr
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						System error -
																						<a href='#' className='m-link'>
																							Check
																						</a>
                                          </span>
                                          <span className='m-list-timeline__time'>
																						2 hrs
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item m-list-timeline__item--read'>
                                          <span className='m-list-timeline__badge' />
                                          <span href='' className='m-list-timeline__text'>
																						New order received
																						<span className='m-badge m-badge--danger m-badge--wide'>
																							urgent
																						</span>
                                          </span>
                                          <span className='m-list-timeline__time'>
																						7 hrs
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item m-list-timeline__item--read'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						Production server down
																					</span>
                                          <span className='m-list-timeline__time'>
																						3 hrs
																					</span>
                                        </div>
                                        <div className='m-list-timeline__item'>
                                          <span className='m-list-timeline__badge' />
                                          <span className='m-list-timeline__text'>
																						Production server up
																					</span>
                                          <span className='m-list-timeline__time'>
																						5 hrs
																					</span>
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
                    </li>
                    <li className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                      <a href='#' className='m-nav__link m-dropdown__toggle'>
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
                                    <a href='#' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-file' />
                                      <span className='m-nav-grid__text'>
																				Send New Broadcast
																			</span>
                                    </a>
                                    <a href='#' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-time' />
                                      <span className='m-nav-grid__text'>
																				Send New Poll
																			</span>
                                    </a>
                                  </div>
                                  <div className='m-nav-grid__row'>
                                    <a href='#' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-folder' />
                                      <span className='m-nav-grid__text'>
																				Send New Survey
																			</span>
                                    </a>
                                    <a href='#' className='m-nav-grid__item'>
                                      <i className='m-nav-grid__icon flaticon-clipboard' />
                                      <span className='m-nav-grid__text'>
																				Create New Workflow
																			</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
                      <a href='#' className='m-nav__link m-dropdown__toggle'>
                        <span className='m-topbar__userpic'>
                          <img src='assets/app/media/img/users/user4.jpg' className='m--img-rounded m--marginless m--img-centered' alt='' />
                        </span>
                        <span className='m-topbar__username m--hide'>
													Nick
												</span>
                      </a>
                      <div className='m-dropdown__wrapper'>
                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__body'>
                            <div className='m-dropdown__content'>
                              <ul className='m-nav m-nav--skin-light'>
                                <li className='m-nav__section m--hide'>
                                  <span className='m-nav__section-text'>
																		Section
																	</span>
                                </li>
                                <li className='m-nav__item'>
                                  <a href='header/profile.html' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-profile-1' />
                                    <span className='m-nav__link-title'>
                                      <span className='m-nav__link-wrap'>
                                        <span className='m-nav__link-text'>
																					My Profile
																				</span>
                                        <span className='m-nav__link-badge'>
                                          <span className='m-badge m-badge--success'>
																						2
																					</span>
                                        </span>
                                      </span>
                                    </span>
                                  </a>
                                </li>
                                <li className='m-nav__item'>
                                  <a href='header/profile.html' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-share' />
                                    <span className='m-nav__link-text'>
																			Activity
																		</span>
                                  </a>
                                </li>
                                <li className='m-nav__item'>
                                  <a href='header/profile.html' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-chat-1' />
                                    <span className='m-nav__link-text'>
																			Messages
																		</span>
                                  </a>
                                </li>
                                <li className='m-nav__separator m-nav__separator--fit' />
                                <li className='m-nav__item'>
                                  <a href='header/profile.html' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-info' />
                                    <span className='m-nav__link-text'>
																			FAQ
																		</span>
                                  </a>
                                </li>
                                <li className='m-nav__item'>
                                  <a href='header/profile.html' className='m-nav__link'>
                                    <i className='m-nav__link-icon flaticon-lifebuoy' />
                                    <span className='m-nav__link-text'>
																			Support
																		</span>
                                  </a>
                                </li>
                                <li className='m-nav__separator m-nav__separator--fit' />
                                <li className='m-nav__item'>
                                  <a href='snippets/pages/user/login-1.html' className='btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder'>
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
                                        Documentation
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
export default connect(mapStateToProps, mapDispatchToProps)(Header)
