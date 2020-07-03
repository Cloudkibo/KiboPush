/* eslint-disable no-useless-constructor */
import React from 'react'
import IconStack from '../../components/Dashboard/IconStack'

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

  aggregateStats (data = []) {
    let aggregate = {
      totalBroadcasts: 0,
      totalUsers: 0,
      totalPolls: 0,
      totalSurveys: 0
    }
    for (let a = 0; a < data.length; a++) {
      let item = data[a]
      aggregate.totalBroadcasts += item.totalBroadcasts
      aggregate.totalPolls += item.totalPolls
      aggregate.totalSurveys += item.totalSurveys
      aggregate.totalUsers += item.totalUsers
    }

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

  UNSAFE_componentWillReceiveProps (nextProps) {
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
              <div className='m-portlet__head-tools'>
                <div style={{display: 'flex', float: 'right'}}>
                <span htmlFor='example-text-input' className='col-form-label'>
                  Show records for last:&nbsp;&nbsp;
                </span>
                <div style={{width: '200px'}}>
                  <input placeholder='Enter number of days' type='number' min='1' step='1' value={this.props.days} className='form-control' onChange={this.props.onDaysChange} />
                </div>
                <span htmlFor='example-text-input' className='col-form-label'>
                &nbsp;&nbsp;days
                </span>
              </div>
            </div>
            </div>
            <div className='m-portlet__body'>
                <div className='row'>
                  <div className='col-md-6'>
                    <IconStack
                      icon='fa fa-facebook'
                      title={this.props.platformStats.totalPages}
                      subtitle='Total Pages'
                      iconStyle='danger'
                      id='totalPages'
                    />
                  </div>
                  <div className='col-md-6'>
                    <IconStack
                      icon='fa fa-facebook'
                      title={this.props.platformStats.totalConnectedPages}
                      subtitle='Connected Pages'
                      iconStyle='success'
                      id='connectedPages'
                    />
                  </div>
                </div>
                <div className='m--space-30'></div>
                <div className='row'>
                  <div className='col-md-6'>
                    <IconStack
                      icon='fa fa-users'
                      title={this.props.platformStats.totalSubscribers}
                      subtitle='Subscribers'
                      iconStyle='primary'
                      id='subscribers'
                    />
                  </div>
                  <div className='col-md-6'>
                    <IconStack
                      icon='fa fa-send-o'
                      title={this.props.platformStats.totalMessagesSent}
                      subtitle='Messages Sent'
                      iconStyle='warning'
                      id='messagesSent'
                    />
                  </div>
                </div>
                <div className='m--space-30'></div>
                <div className='m-widget15'>
                  <div className='m-widget15__item'>
                    <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                      {(this.props.platformStats) ? Math.floor(this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100) + '%' : 0 + '%'}
                    </span>
                    <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                      Pages Connected
                    </span>
                    <div className='m--space-10'></div>
                    <div className='progress m-progress--sm' style={{height: '6px'}}>
                      {
                      (this.props.platformStats)
                      ? <div className='progress-bar bg-success' role='progressbar' style={{width: (this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100) + '%'}} aria-valuenow={(this.props.platformStats.totalConnectedPages / this.props.platformStats.totalPages * 100)} aria-valuemin='0' aria-valuemax='100' />
                      : <div className='progress-bar bg-success' role='progressbar' style={{width: 0 + '%'}} aria-valuenow={0} aria-valuemin='0' aria-valuemax='100' />
                    }
                    </div>
                  </div>
                </div>
                <a href="http://167.71.253.114:8080/dashbuilder/" target="_blank" rel='noopener noreferrer'><strong>Performance Dashboard</strong> (Username: root Password: root) </a>
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
