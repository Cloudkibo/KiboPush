/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import StackedBar from './stackedBar'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { loadDashboardData, sentVsSeen } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { fetchSessions } from '../../redux/actions/livechat.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  createbroadcast
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import GettingStarted from './gettingStarted'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { joinRoom } from '../../utility/socketio'
import { getuserdetails, dashboardTourCompleted, getStartedCompleted } from '../../redux/actions/basicinfo.actions'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)

    props.loadSubscribersList()
    props.loadDashboardData()
    props.loadMyPagesList()
    props.getuserdetails()
    props.sentVsSeen()

    this.state = {
      isShowingModal: false,
      steps: [],
      sentseendata1: []
    }

    console.log('anishachhatwani')
    this.closeDialog = this.closeDialog.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
  }

  componentWillReceiveProps (nextprops) {
    console.log('NextProps :', nextprops)
    console.log('seens :', nextprops.user.dashboardTourSeen)
    if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
      browserHistory.push('/addPages')
    } else if (nextprops.subscribers && nextprops.subscribers.length > 0) {
      // this means more than 0 subscribers
      console.log('More than 0 subscribers')
      this.setState({isShowingModal: false})
    } else if (nextprops.pages && nextprops.pages.length === 0 && nextprops.subscribers && nextprops.subscribers.length === 0) {
      // this means 0 subscribers
      console.log('0 subscribers')
      this.setState({isShowingModal: true})
    }
    if (nextprops.user) {
      console.log('fetchSession in dashboard')
      joinRoom(nextprops.user._id)
    }
    if (nextprops.sentseendata) {
      console.log('sentseendata', nextprops.sentseendata)
      var temp = []
      temp.push(nextprops.sentseendata)
      console.log('temp', temp)
      this.setState({sentseendata1: nextprops.sentseendata})
      console.log('sentseendata1', this.state.sentseendata1)
    }
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/fb.js')
    // document.body.appendChild(addScript)
    this.addSteps([{
      title: 'Pages',
      text: 'This shows the number of pages currently connected',
      selector: 'div#pages',
      position: 'top-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Subscribers',
      text: 'These are the total number of subscribers you have',
      selector: 'div#subscribers',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'New Messages',
      text: 'The number of unread message',
      selector: 'div#newMessages',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Survey',
      text: 'The number of surveys you have created',
      selector: 'div#surveys',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Polls',
      text: 'The Polls you have made till now',
      selector: 'div#polls',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Broadcasts',
      text: 'Broadcasts you have made to your subscribers',
      selector: 'div#broadcasts',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true}
    ])
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      console.log('this: ', this)
      console.log('Tour Finished')
      this.props.dashboardTourCompleted({
        'dashboardTourSeen': true
      })
    }
  }

  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='container'>
        {
          !(this.props.user && this.props.user.dashboardTourSeen) &&
          <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />
        }
        <br /><br /><br /><br /><br /><br />
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        {
          this.state.isShowingModal && this.props.user && !this.props.user.gettingStartedSeen &&
          <ModalContainer style={{width: '1000px'}} onClose={this.closeDialog}>
            <ModalDialog style={{width: '1000px'}} onClose={this.closeDialog}>
              <GettingStarted pages={this.props.pages} />
            </ModalDialog>
          </ModalContainer>
        }
        <h3>Dashboard</h3>
        <div className='ui-block'>
          <div className='ui-block-content'>
            <div className='row'>
              <div id='pages' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-primary'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-facebook fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>{this.props.dashboard.pages}</div>
                        <div>Pages!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/pages'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
              <div id='subscribers' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-green'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-users fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>{this.props.dashboard.subscribers}</div>
                        <div>Subscribers!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/subscribers'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
              <div id='newMessages' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-yellow'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-comments fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>0</div>
                        <div>New Messages!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/live'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className='row'>
              <div id='broadcasts' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-purple'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-bullhorn fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>{this.props.dashboard.activityChart.messages}</div>
                        <div>Broadcasts!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/convos'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
              <div id='polls' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-red'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-list fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>{this.props.dashboard.activityChart.polls}</div>
                        <div>Polls!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/poll'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
              <div id='surveys' className='col-lg-4 col-md-12'>
                <div className='dashboard-panel dashboard-panel-grey'>
                  <div className='dashboard-panel-heading'>
                    <div className='row'>
                      <div className='dashboard-col-xs-4'>
                        <i className='fa fa-list-alt fa-5x' />
                      </div>
                      <div className='dashboard-col-xs-8 text-right'>
                        <div className='dashboard-huge'>{this.props.dashboard.activityChart.surveys}</div>
                        <div>Surveys!</div>
                      </div>
                    </div>
                  </div>
                  <Link to='/surveys'>
                    <div className='panel-footer'>
                      <span className='pull-left'>View Details</span>
                      <span className='pull-right'><i className='fa fa-arrow-circle-right' /></span>
                      <div className='clearfix' />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className='row'>
              <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                <div className='ui-block'>
                  <div className='birthday-item inline-items badges'>
                    <StackedBar sentseendata={this.state.sentseendata1} />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
 // console.log(state)
  return {
    dashboard: (state.dashboardInfo.dashboard),
    sentseendata: (state.sentSeenInfo.sentseendata),
    pages: (state.pagesInfo.pages),
    subscribers: (state.subscribersInfo.subscribers),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadDashboardData: loadDashboardData,
      loadMyPagesList: loadMyPagesList,
      loadSubscribersList: loadSubscribersList,
      createbroadcast: createbroadcast,
      fetchSessions: fetchSessions,
      getuserdetails: getuserdetails,
      dashboardTourCompleted: dashboardTourCompleted,
      getStartedCompleted: getStartedCompleted,
      sentVsSeen: sentVsSeen
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
