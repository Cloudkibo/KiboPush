/* eslint-disable no-useless-constructor */
import React from 'react'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    var convertRate = this.props.objectsData.AllPagesCount && this.props.objectsData.AllPagesCount.length > 0 && this.props.objectsData.PagesCount && this.props.objectsData.PagesCount.length > 0 ? ((this.props.objectsData.PagesCount[0].count / this.props.objectsData.AllPagesCount[0].count) * 100).toFixed(1) + '%' : '0%'
    return (
      <div className='row'>
        <div className='col-xl-8' style={{height: '366px'}}>
          { this.props.objectsData !== null && this.props.length > 0
          ? <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Pages Info
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='m-widget21'>
                <div className='row'>
                  <div className='col'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa fa-facebook m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {this.props.objectsData.AllPagesCount && this.props.objectsData.AllPagesCount.length > 0 ? this.props.objectsData.AllPagesCount[0].count : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Total Pages
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='col'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa fa-facebook m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {this.props.objectsData.PagesCount && this.props.objectsData.PagesCount.length > 0 ? this.props.objectsData.PagesCount[0].count : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Connected Pages
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='col'>
                    <div className='m-widget21__item'>
                      <span className='m-widget21__icon'>
                        <a className='btn btn-accent m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                          <i className='fa flaticon-users m--font-light' />
                        </a>
                      </span>
                      <div className='m-widget21__info'>
                        <span className='m-widget21__title'>
                          {this.props.objectsData.SubscribersCount && this.props.objectsData.SubscribersCount.length > 0 ? this.props.objectsData.SubscribersCount[0].count : 0}
                        </span>
                        <br />
                        <span className='m-widget21__sub'>
                          Subscribers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m--space-30' />
                <div className='m-widget15'>
                  <div className='m-widget15__item'>
                    <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                      {convertRate}
                    </span>
                    <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                      Pages Connected
                    </span>
                    <div className='m--space-10' />
                    <div className='progress m-progress--sm' style={{height: '6px'}}>
                      { this.props.objectsData.AllPagesCount && this.props.objectsData.AllPagesCount.length > 0 && this.props.objectsData.PagesCount && this.props.objectsData.PagesCount.length > 0 &&
                      <div className='progress-bar bg-success' role='progressbar' style={{width: convertRate}} aria-valuenow={(this.props.objectsData.PagesCount[0].count / this.props.objectsData.AllPagesCount[0].count) * 100} aria-valuemin='0' aria-valuemax='100' />
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : <p>No data to display </p>
          }
        </div>
        <div className='col-xl-4'>
          <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit' style={{height: 'fit-content', width: '400px'}}>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Other Info
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className='m-portlet__body' style={{marginTop: '-28px'}}>
            <div className='row m-row--full-height' style={{width: '430px'}}>
              <div className='col-sm-12 col-md-12 col-lg-6' style={{paddingRight: '2px'}}>
                <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-brand'>
                  <div className='m-portlet__body'>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.props.objectsData.UsersCount && this.props.objectsData.UsersCount.length > 0 ? this.props.objectsData.UsersCount[0].count : 0}
                        <small>
                          Users
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m--space-30' />
                <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-danger' style={{marginTop: '-26px'}}>
                  <div className='m-portlet__body'>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.props.objectsData.PollsCount && this.props.objectsData.PollsCount.length > 0 ? this.props.objectsData.PollsCount[0].count : 0}
                        <small>
                          Polls
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-6' style={{paddingLeft: '2px'}}>
                <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-success'>
                  <div className='m-portlet__body'>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.props.objectsData.BroadcastsCount && this.props.objectsData.BroadcastsCount.length > 0 ? this.props.objectsData.BroadcastsCount[0].count : 0}
                        <small>
                          Broadcasts
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m--space-30' />
                <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-accent' style={{marginTop: '-26px'}}>
                  <div className='m-portlet__body'>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.props.objectsData.SurveysCount && this.props.objectsData.SurveysCount.length > 0 ? this.props.objectsData.SurveysCount[0].count : 0}
                        <small>
                          Surveys
                        </small>
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

export default dataObjectsCount
