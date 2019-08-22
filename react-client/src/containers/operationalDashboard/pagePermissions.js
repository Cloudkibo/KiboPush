/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadPagePermissions } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class PageUsers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      appLevelKeys: [],
      pageLevelKeys: []
    }
    props.loadPagePermissions(this.props.location.state.pageId)

  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentDidMount () {
    this.scrollToTop()

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Page Permissions`
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pagePermissions) {
      let appLevelKeys = Object.keys(nextProps.pagePermissions.appLevelPermissions)
      let pageLevelKeys = Object.keys(nextProps.pagePermissions.pageLevelPermissions)
      this.setState({appLevelKeys: appLevelKeys, pageLevelKeys: pageLevelKeys})
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.pageName}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                  { this.props.pagePermissions && this.state.appLevelKeys.length > 0
                  ? <div className='m-section'>
											<h3 className='m-section__heading'>
												App Level Permissions
											</h3>
											<div className='m-section__content'>
												<div className='m-demo' data-code-preview='true' data-code-html='true' data-code-js='false'>
													<div className='m-demo__preview'>
														<div className='m-list-timeline'>
															<div className='m-list-timeline__items'>
                                { this.state.appLevelKeys.map((appLevelKey, i) => (
  																<div className='m-list-timeline__item'>
  																	<span className='m-list-timeline__badge'></span>
  																	<span className='m-list-timeline__text'>
  																		{appLevelKey}&nbsp;&nbsp;&nbsp;
                                      {this.props.pagePermissions.appLevelPermissions[appLevelKey]
                                      ? <i className='fa fa-check' style={{fontSize: 'large', color: '#34bfa3'}}></i>
                                      : <i className='fa fa-close' style={{fontSize: 'large', color: '#f4516c'}}></i>
                                      }
                                      </span>
    																</div>
                                  ))
                                }
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
                  : <span>
                    <p> No data to display </p>
                  </span>
                }
                { this.props.pagePermissions && this.state.pageLevelKeys.length > 0
                ? <div className='m-section'>
                    <h3 className='m-section__heading'>
                      App Level Permissions
                    </h3>
                    <div className='m-section__content'>
                      <div className='m-demo' data-code-preview='true' data-code-html='true' data-code-js='false'>
                        <div className='m-demo__preview'>
                          <div className='m-list-timeline'>
                            <div className='m-list-timeline__items'>
                              { this.state.pageLevelKeys.map((pageLevelKey, i) => (
                                <div className='m-list-timeline__item'>
                                  <span className='m-list-timeline__badge'></span>
                                  <span className='m-list-timeline__text'>
                                    {pageLevelKey}&nbsp;&nbsp;&nbsp;
                                    {this.props.pagePermissions.pageLevelPermissions[pageLevelKey] === 'rejected'
                                    ? <span className='m-badge m-badge--wide m-badge--danger'>Rejected</span>
                                    : this.props.pagePermissions.pageLevelPermissions[pageLevelKey] === 'approved'
                                    ? <span className='m-badge m-badge--wide m-badge--success'>Approved</span>
                                    : <span className='m-badge m-badge--wide m-badge--info'>{this.props.pagePermissions.pageLevelPermissions[pageLevelKey]}</span>
                                    }
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                : <span>
                  <p> No data to display </p>
                </span>
              }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pagePermissions: (state.backdoorInfo.pagePermissions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPagePermissions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageUsers)
