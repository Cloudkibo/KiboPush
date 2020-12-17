import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Select from 'react-select'

import { loadMyPagesList } from '../../redux/actions/pages.actions'

import SLAStats from './sla_stats'
import SLAGraph from './sla_graph'

class SLADashboard extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      totalSessions: 999,
      resolvedSessions: 99,
      pendingSessions: 99,
      openSessions: 99,
      messagesReceived: 999,
      messagesSent: 999,
      avgResponseTime: 120,
      avgResolveTime: 1000,
      daysFilter: 30,
      graphData: [
        {
          avgResponseTime: 30,
          avgResolveTime: 100,
          date: '2020-12-08'
        },
        {
          avgResponseTime: 40,
          avgResolveTime: 120,
          date: '2020-12-09'
        },
        {
          avgResponseTime: 50,
          avgResolveTime: 150,
          date: '2020-12-10'
        },
        {
          avgResponseTime: 60,
          avgResolveTime: 190,
          date: '2020-12-11'
        },
        {
          avgResponseTime: 20,
          avgResolveTime: 110,
          date: '2020-12-12'
        },
        {
          avgResponseTime: 80,
          avgResolveTime: 200,
          date: '2020-12-13'
        },
        {
          avgResponseTime: 90,
          avgResolveTime: 250,
          date: '2020-12-14'
        },
        {
          avgResponseTime: 30,
          avgResolveTime: 100,
          date: '2020-12-15'
        }
      ],
      pageOptions: []
    }
    props.loadMyPagesList()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pages) {
      const pageOptions = nextProps.pages.map((page) => {
        return {
          label: page.pageName,
          value: page._id
        }
      })
      return { pageOptions }
    }
    return null
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
        {this.state.loading ? (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <div className='m-loader m-loader--brand' style={{ width: '30px', display: 'inline-block' }}></div>
            <span className='m--font-brand'>Please wait...</span>
          </div>
        ) : (
          <div className='col-12'>
            <div className='m-portlet'>
              <div className='m-portlet__head'>
                <div className='m-portlet__head-caption'>
                  <div className='m-portlet__head-title'>
                    <h3 className='m-portlet__head-text'>SLA Dashboard</h3>
                  </div>
                </div>
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
              </div>
              <div className='m-portlet__body'>
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
                  totalSessions={this.state.totalSessions}
                  resolvedSessions={this.state.resolvedSessions}
                  pendingSessions={this.state.pendingSessions}
                  openSessions={this.state.openSessions}
                  messagesReceived={this.state.messagesReceived}
                  messagesSent={this.state.messagesSent}
                />

                <SLAGraph
                  graphData={this.state.graphData}
                  avgResolveTime={this.state.avgResolveTime}
                  avgResponseTime={this.state.avgResponseTime}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    pages: state.pagesInfo.pages,
    user: state.basicInfo.user,
    superUser: state.basicInfo.superUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadMyPagesList
    },
    dispatch
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SLADashboard)
