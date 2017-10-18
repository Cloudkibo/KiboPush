/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { loadDashboardData, tourCompleted } from '../../redux/actions/dashboard.actions'
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
import { getuserdetails } from '../../redux/actions/basicinfo.actions'


class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadDashboardData()
    props.loadMyPagesList()
    props.loadSubscribersList()
    this.state = {
      isShowingModal: false,
      steps: []
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourfinished = this.tourFinished.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
  }

  componentWillReceiveProps (nextprops) {
    // if (nextprops.pages && nextprops.pages.length === 0) {
    //   // this means connected pages in 0
    //   browserHistory.push('/addPages')
    // } else if (nextprops.pages && nextprops.pages.length > 0 &&
    //   nextprops.subscribers && nextprops.subscribers.length === 0 &&
    //   this.props.dashboard.subscribers === 0) {
    this.setState({isShowingModal: true})
    // }
    if (nextprops.user) {
      console.log('fetchSession in dashboard')
      this.props.fetchSessions({ company_id: nextprops.user._id })
      joinRoom(nextprops.user._id)
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
    if (this.props.user.dashboardTourSeen) {
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
        title: 'Scheduled Broadcasts',
        text: 'These are the current number of posts scheduled to be broadcasted',
        selector: 'div#scheduled',
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
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      console.log('Tour Finished')
      tourCompleted({
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
        <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />
        <br /><br /><br /><br /><br /><br />
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        {
          this.state.isShowingModal &&
          <ModalContainer style={{width: '1000px'}} onClose={this.closeDialog}>
            <ModalDialog style={{width: '1000px'}} onClose={this.closeDialog}>
              <GettingStarted pages={this.props.pages} />
            </ModalDialog>
          </ModalContainer>
        }
        <div className='row'>
          <main
            className='col-xl-4 push-xl-4 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
            <div id='subscribers' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.subscribers}</h1>
                    <div className='author-content'>
                      <Link to='/subscribers' className='h5 author-name'>Subscribers</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id='polls' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.activityChart.polls}</h1>
                    <div className='author-content'>
                      <Link to='/poll' className='h5 author-name'>Polls</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
          <aside
            className='col-xl-4 pull-xl-4 col-lg-6 pull-lg-0 col-md-6 col-sm-12 col-xs-12'>
            <div id='pages' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.pages}</h1>
                    <div className='author-content'>
                      <Link to='/pages' className='h5 author-name'>Pages</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id='surveys' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.activityChart.surveys}</h1>
                    <div className='author-content'>
                      <Link to='/surveys'
                        className='h5 author-name'>Surveys</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </aside>
          <aside className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            <div id='scheduled' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.scheduledBroadcast}</h1>
                    <div className='author-content'>
                      <Link to='#' className='h5 author-name'>Scheduled
                        Broadcasts</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id='broadcasts' className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.activityChart.messages}</h1>
                    <div className='author-content'>
                      <Link to='/broadcasts' className='h5 author-name'>Broadcasts</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    dashboard: (state.dashboardInfo.dashboard),
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
      getuserdetails: getuserdetails
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
