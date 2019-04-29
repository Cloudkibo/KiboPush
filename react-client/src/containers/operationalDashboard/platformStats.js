/* eslint-disable no-useless-constructor */
import React from 'react'

class PlatformStats extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedValue: 'all',
      users: 0,
      broadcasts: 0,
      polls: 0,
      surveys: 0
    }
    this.updateCurrentState = this.updateCurrentState.bind(this)
  }

  aggregateStats (data) {
    let aggregate = {
      totalBroadcasts: 0,
      totalUsers: 0,
      totalPolls: 0,
      totalSurveys: 0
    }
    data.map((item) => {
      aggregate.totalBroadcasts += item.totalBroadcasts
      aggregate.totalPolls += item.totalPolls
      aggregate.totalSurveys += item.totalSurveys
      aggregate.totalUsers += item.totalUsers
    })

    return aggregate
  }

  updateCurrentState (data) {
    this.setState({
      users: (data.totalUsers) ? data.totalUsers : 0,
      broadcasts: (data.totalBroadcasts) ? data.totalBroadcasts : 0,
      polls: (data.totalPolls) ? data.totalPolls : 0,
      surveys: (data.totalSurveys) ? data.totalSurveys : 0
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.platformStats && this.state.selectedValue === 'all') {
      this.updateCurrentState(this.props.platformStats)
    }
  }

  onChange (event) {
    this.setState({selectedValue: event.target.value})
    switch (event.target.value) {
      case 'all':
        this.updateCurrentState(this.props.platformStats)
        break
      case '10':
        let weeklyStats = this.aggregateStats(this.props.weeklyPlatformStats)
        this.updateCurrentState(weeklyStats)
        break
      case '30':
        let monthlyStats = this.aggregateStats(this.props.monthlyPlatformStats)
        this.updateCurrentState(monthlyStats)
        break

      default:
        break
    }
  }

  render () {
    console.log('Props from Platform Stats', this.props)
    return (
      <div className='row'>
        <div className='col-xl-8' style={{height: '366px'}}>
          { (this.props.platformStats)
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
                          {(this.props.platformStats) ? this.props.platformStats.totalPages : 0}
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
                          {(this.props.platformStats) ? this.props.platformStats.totalConnectedPages : 0}
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
                          {(this.props.platformStats) ? this.props.platformStats.totalSubscribers : 0}
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
                      {(this.props.platformStats) ? Math.floor(this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100) + '%' : 0 + '%'}
                    </span>
                    <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                      Pages Connected
                    </span>
                    <div className='m--space-10' />
                    <div className='progress m-progress--sm' style={{height: '6px'}}>
                      {
                      (this.props.platformStats)
                      ? <div className='progress-bar bg-success' role='progressbar' style={{width: (this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100) + '%'}} aria-valuenow={(this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100)} aria-valuemin='0' aria-valuemax='100' />
                      : <div className='progress-bar bg-success' role='progressbar' style={{width: 0 + '%'}} aria-valuenow={0} aria-valuemin='0' aria-valuemax='100' />
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
          <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit' style={{height: 'fit-content'}}>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Other Info
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools' style={{textAlign: 'left'}}>
                <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.selectedValue} onChange={this.onChange.bind(this)}>
                  <option value='' disabled>Filter by last</option>
                  <option value='all'>All</option>
                  <option value='10'>10 days</option>
                  <option value='30'>30 days</option>
                </select>
              </div>
            </div>
          </div>
          <div className='m-portlet__body' style={{marginTop: '-28px'}}>
            <div className='row m-row--full-height'>
              <div className='col-sm-12 col-md-12 col-lg-6' style={{paddingRight: '2px'}}>
                <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-brand'>
                  <div className='m-portlet__body'>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.state.users}
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
                        {this.state.polls}
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
                        {this.state.broadcasts}
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
                        {this.state.surveys}
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

export default PlatformStats
