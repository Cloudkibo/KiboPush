/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { Link } from 'react-router'

class ProgressBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false
    }
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
  }
  showProDialog () {
    this.setState({isShowingModalPro: true})
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }
  hideDropDown () {
    this.setState({showDropDown: false})
  }

  render () {
    var unsubscribeRate = (this.props.pageLikesSubscribes.unsubscribes && this.props.pageLikesSubscribes.subscribers) ? (this.props.pageLikesSubscribes.unsubscribes / (this.props.pageLikesSubscribes.unsubscribes + this.props.pageLikesSubscribes.subscribers) * 100).toFixed(1) + '%' : '0%'
    var broadcastSeenConvertRate = this.props.data.broadcast.broadcastSentCount !== 0 ? ((this.props.data.broadcast.broadcastSeenCount / this.props.data.broadcast.broadcastSentCount) * 100).toFixed(1) + '%' : '0%'
    var pollSeenConvertRate = this.props.data.poll.pollSentCount !== 0 ? ((this.props.data.poll.pollSeenCount / this.props.data.poll.pollSentCount) * 100).toFixed(1) + '%' : '0%'
    var pollResponseConvertRate = this.props.data.poll.pollSentCount !== 0 ? ((this.props.data.poll.pollResponseCount / this.props.data.poll.pollSentCount) * 100).toFixed(1) + '%' : '0%'
    var surveySeenConvertRate = this.props.data.survey.surveySentCount !== 0 ? ((this.props.data.survey.surveySeenCount / this.props.data.survey.surveySentCount) * 100).toFixed(1) + '%' : '0%'
    var surveyResponseConvertRate = this.props.data.survey.surveySentCount !== 0 ? ((this.props.data.survey.surveyResponseCount / this.props.data.survey.surveySentCount) * 100).toFixed(1) + '%' : '0%'
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  {this.props.pageLikesSubscribes.selectedPage ? this.props.pageLikesSubscribes.selectedPage : this.props.firstPage.pageName}
                </h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    Change Page
                  </a>
                  {
                    this.state.showDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Connected Pages
                                </span>
                              </li>
                              {
                                this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a onClick={() => this.changePage(page.pageName)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </a>
                                  </li>
                                ))
                              }
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='row'>
                <div className='col-4' style={{margin: '10px'}}>
                  <div className='row'>
                    <div className='col-2' style={{minWidth: '150px'}}>
                      <Link to='/subscribers' >
                        <div className='m-widget21__item' style={{display: 'flex'}}>
                          <span className='m-widget21__icon'>
                            <a className='btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                              <i className='fa flaticon-user-ok m--font-light' />
                            </a>
                          </span>
                          <div className='m-widget21__info' style={{marginLeft: '10px'}}>
                            <span className='m-widget21__title'>
                              {this.props.pageLikesSubscribes.subscribers ? this.props.pageLikesSubscribes.subscribers : this.props.firstPage.subscribers }
                            </span>
                            <br />
                            <span className='m-widget21__sub'>
                              Subscribers
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className='col-2' style={{minWidth: '150px'}}>
                      <Link to='/subscribers' >
                        <div className='m-widget21__item' style={{display: 'flex'}}>
                          <span className='m-widget21__icon'>
                            <a className='btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                              <i className='fa flaticon-users m--font-light' />
                            </a>
                          </span>
                          <div className='m-widget21__info' style={{marginLeft: '10px'}}>
                            <span className='m-widget21__title'>
                              {this.props.pageLikesSubscribes.unsubscribes ? this.props.pageLikesSubscribes.unsubscribes : this.props.firstPage.unsubscribes}
                            </span>
                            <br />
                            <span className='m-widget21__sub'>
                              Unsubscribes
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {unsubscribeRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Unsubscribe rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '300px'}}>
                          <div className='progress-bar bg-brand' role='progressbar' style={{width: unsubscribeRate}} aria-valuenow={(this.props.pageLikesSubscribes.subscribers / this.props.pageLikesSubscribes.likes) * 100} aria-valuemin='0' aria-valuemax='100' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2' style={{margin: '10px 50px 0px 50px'}}>
                  <div className='row'>
                    <div className='m-widget21__item' style={{display: 'flex'}}>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-success m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa flaticon-paper-plane m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info' style={{marginLeft: '10px'}}>
                        <span className='m-widget21__title'>
                          {this.props.data.broadcast.broadcastSentCount ? this.props.data.broadcast.broadcastSentCount : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Broadcasts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {broadcastSeenConvertRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Seen rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '150px'}}>
                          <div className='progress-bar bg-success' role='progressbar' style={{width: broadcastSeenConvertRate}} aria-valuenow={(this.props.data.broadcast.broadcastSeenCount / this.props.data.broadcast.broadcastSentCount) * 100} aria-valuemin='0' aria-valuemax='100' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2' style={{margin: '10px'}}>
                  <div className='row'>
                    <div className='m-widget21__item' style={{display: 'flex'}}>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa flaticon-graphic-2 m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info' style={{marginLeft: '10px'}}>
                        <span className='m-widget21__title'>
                          {this.props.data.poll.pollSentCount ? this.props.data.poll.pollSentCount : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Polls
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {pollSeenConvertRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Seen rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '150px'}}>
                          <div className='progress-bar bg-danger' role='progressbar' style={{width: pollSeenConvertRate}} aria-valuenow={(this.props.data.poll.pollSeenCount / this.props.data.poll.pollSentCount) * 100} aria-valuemin='0' aria-valuemax='100' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {pollResponseConvertRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Response rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '150px'}}>
                          <div className='progress-bar bg-danger' role='progressbar' style={{width: pollResponseConvertRate}} aria-valuenow={(this.props.data.poll.pollResponseCount / this.props.data.poll.pollSentCount) * 100} aria-valuemin='0' aria-valuemax='100' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2' style={{margin: '10px'}}>
                  <div className='row'>
                    <div className='m-widget21__item' style={{display: 'flex'}}>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-accent m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa flaticon-statistics m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info' style={{marginLeft: '10px'}}>
                        <span className='m-widget21__title'>
                          {this.props.data.survey.surveySentCount ? this.props.data.survey.surveySentCount : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Surveys
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {surveySeenConvertRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Seen rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '150px'}}>
                          <div className='progress-bar bg-accent' role='progressbar' style={{width: surveySeenConvertRate}} aria-valuenow={(this.props.data.survey.surveySeenCount / this.props.data.survey.surveySentCount) * 100} aria-valuemin='0' aria-valuemax='100' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <div className='row'>
                    <div className='m-widget15'>
                      <div className='m-widget15__item'>
                        <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                          {surveyResponseConvertRate}
                        </span>
                        <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                          Response rate
                        </span>
                        <div className='m--space-10' />
                        <div className='progress m-progress--sm' style={{height: '6px', minWidth: '150px'}}>
                          <div className='progress-bar bg-accent' role='progressbar' style={{width: surveyResponseConvertRate}} aria-valuenow={(this.props.data.survey.surveyResponseCount / this.props.data.survey.surveySentCount) * 100} aria-valuemin='0' aria-valuemax='100' />
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
    )
  }
}

export default ProgressBox
