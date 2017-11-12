/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'

class CardsWithProgress extends React.Component {
  render () {
    var broadcastSeenConvertRate = (this.props.data.broadcastSeenCount[0].count / this.props.data.broadcastSentCount[0].count) * 100 + '%'
    var pollSeenConvertRate = (this.props.data.pollSeenCount[0].count / this.props.data.pollSentCount[0].count) * 100 + '%'
    var surveySeenConvertRate = (this.props.data.surveySeenCount[0].count / this.props.data.surveySentCount[0].count) * 100 + '%'
    return (
      <div className='row'>
        <div className='col-xl-4'>
          <div className='m-portlet m-portlet--bordered-semi m-portlet--half-height m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Broadcasts
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='m-portlet__nav'>
                  <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='hover' aria-expanded='true'>
                    <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                      Today
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget20'>
                <div className='m-widget20__number m--font-success'>
                  {this.props.data.broadcastSentCount[0].count ? this.props.data.broadcastSentCount[0].count : 0}
                </div>
                <div className='m-portlet__body'>
                  <div className='m-widget15'>
                    <div className='m-widget15__items'>
                      <div className='row'>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {broadcastSeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Seen
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-primary' role='progressbar' style={{width: broadcastSeenConvertRate}} aria-valuenow={(this.props.data.broadcastSeenCount[0].count / this.props.data.broadcastSentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
                            </div>
                          </div>
                        </div>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {broadcastSeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Responded
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-success' role='progressbar' style={{width: broadcastSeenConvertRate}} aria-valuenow={(this.props.data.broadcastSeenCount[0].count / this.props.data.broadcastSentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
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
        </div>
        <div className='col-xl-4'>
          <div className='m-portlet m-portlet--bordered-semi m-portlet--half-height m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Polls
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='m-portlet__nav'>
                  <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='hover' aria-expanded='true'>
                    <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                      Today
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget20'>
                <div className='m-widget20__number m--font-success'>
                  {this.props.data.pollSentCount[0].count ? this.props.data.pollSentCount[0].count : 0}
                </div>
                <div className='m-portlet__body'>
                  <div className='m-widget15'>
                    <div className='m-widget15__items'>
                      <div className='row'>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {pollSeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Seen
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-primary' role='progressbar' style={{width: pollSeenConvertRate}} aria-valuenow={(this.props.data.pollSeenCount[0].count / this.props.data.pollSentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
                            </div>
                          </div>
                        </div>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {pollSeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Responded
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-success' role='progressbar' style={{width: pollSeenConvertRate}} aria-valuenow={(this.props.data.pollSeenCount[0].count / this.props.data.pollSentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
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
        </div>
        <div className='col-xl-4'>
          <div className='m-portlet m-portlet--bordered-semi m-portlet--half-height m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Surveys
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='m-portlet__nav'>
                  <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='hover' aria-expanded='true'>
                    <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                      Today
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget20'>
                <div className='m-widget20__number m--font-success'>
                  {this.props.data.surveySentCount[0].count ? this.props.data.surveySentCount[0].count : 0}
                </div>
                <div className='m-portlet__body'>
                  <div className='m-widget15'>
                    <div className='m-widget15__items'>
                      <div className='row'>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {surveySeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Seen
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-primary' role='progressbar' style={{width: surveySeenConvertRate}} aria-valuenow={(this.props.data.surveySeenCount[0].count / this.props.data.surveySentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
                            </div>
                          </div>
                        </div>
                        <div className='col'>
                          <div className='m-widget15__item'>
                            <span className='m-widget15__stats'>
                              {surveySeenConvertRate}
                            </span>
                            <span className='m-widget15__text'>
                              Responded
                            </span>
                            <div className='m--space-10' />
                            <div className='progress m-progress--sm'>
                              <div className='progress-bar bg-success' role='progressbar' style={{width: surveySeenConvertRate}} aria-valuenow={(this.props.data.surveySeenCount[0].count / this.props.data.surveySentCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
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
        </div>
      </div>
    )
  }
}

export default CardsWithProgress
