import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Select from 'react-select'

import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadSLADashboardData } from '../../redux/actions/dashboard.actions'

import SLAStats from './sla_stats'
import SLAGraph from './sla_graph'

class SLADashboard extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pageOptions: [],
      loading: !props.slaDashboard,
      daysFilter: 30,
      error: ''
    }
    props.loadSLADashboardData()
    props.loadMyPagesList()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {}
    if (nextProps.pages) {
      const pageOptions = nextProps.pages.map((page) => {
        return {
          label: page.pageName,
          value: page._id
        }
      })
      newState.pageOptions = pageOptions
    }
    if (nextProps.slaDashboard) {
      newState.loading = false
    } else if (nextProps.slaDashboardError) {
      newState.error = nextProps.slaDashboardError
      newState.loading = false
    }
    return newState
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <>
        <AlertContainer
          ref={(a) => {
            this.msg = a
          }}
          {...alertOptions}
        />
        <div className='col-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>SLA Dashboard</h3>
                </div>
              </div>
              {!this.state.loading && !this.state.error && (
                <div className='m-portlet__head-tools'>
                  <div style={{ display: 'flex', float: 'right' }}>
                    <span htmlFor='example-text-input' className='col-form-label'>
                      Show records for last:&nbsp;&nbsp;
                    </span>
                    <div style={{ width: '100px' }}>
                      <input
                        placeholder='days'
                        type='number'
                        min='1'
                        step='1'
                        value={this.state.daysFilter}
                        className='form-control'
                        onChange={this.props.onDaysChange}
                      />
                    </div>
                    <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className='m-portlet__body'>
              {this.state.loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className='m-loader m-loader--brand' style={{ width: '50px', height: '50px' }}></div>
                  <span className='m--font-brand'>Loading...Please wait</span>
                </div>
              )}
              {this.state.error && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i
                    className='la la-exclamation-triangle m--font-danger'
                    style={{ marginRight: '5px', fontSize: '1.5rem' }}
                  />
                  <span className='m--font-danger'>{this.state.error}</span>
                </div>
              )}
              {!this.state.loading && !this.state.error && (
                <>
                  <div
                    className='row'
                    style={{
                      marginBottom: '35px',
                      paddingBottom: '35px',
                      borderBottom: '2px solid lightgray',
                      borderBottomStyle: 'dotted'
                    }}
                  >
                    <div className='col-4'>
                      <h6>Select Page:</h6>
                      <Select
                        isClearable
                        isSearchable
                        options={this.state.pageOptions}
                        onChange={this.onSelectChange}
                        value={this.state.currentSelected}
                        placeholder={'No Page Selected'}
                      />
                    </div>
                    <div className='col-4'>
                      <h6>Select Agent:</h6>
                      <Select
                        isClearable
                        isSearchable
                        options={this.state.pageOptions}
                        onChange={this.onSelectChange}
                        value={this.state.currentSelected}
                        placeholder={'No Agent Selected'}
                      />
                    </div>
                    <div className='col-4'>
                      <h6>Select Team:</h6>
                      <Select
                        isClearable
                        isSearchable
                        options={this.state.pageOptions}
                        onChange={this.onSelectChange}
                        value={this.state.currentSelected}
                        placeholder={'No Team Selected'}
                      />
                    </div>
                  </div>
                  <SLAStats
                    totalSessions={this.props.slaDashboard.sessions.total}
                    resolvedSessions={this.props.slaDashboard.sessions.resolved}
                    pendingSessions={this.props.slaDashboard.sessions.pending}
                    openSessions={this.props.slaDashboard.sessions.open}
                    messagesReceived={this.props.slaDashboard.messages.received}
                    messagesSent={this.props.slaDashboard.messages.sent}
                  />

                  <SLAGraph
                    graphData={this.props.slaDashboard.graphData}
                    resolveTime={this.props.slaDashboard.resolveTime}
                    responseTime={this.props.slaDashboard.responseTime}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    slaDashboard: state.dashboardInfo.slaDashboard,
    slaDashboardError: state.dashboardInfo.slaDashboardError,
    pages: state.pagesInfo.pages,
    user: state.basicInfo.user,
    superUser: state.basicInfo.superUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadMyPagesList,
      loadSLADashboardData
    },
    dispatch
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SLADashboard)
