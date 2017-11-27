/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import PageLikesSubscribers from '../../components/Dashboard/PageLikesSubscribers'
import CardBoxes from '../../components/Dashboard/CardBoxes'
import CardsWithProgress from '../../components/Dashboard/CardsWithProgress'
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
import { joinRoom } from '../../utility/socketio'
import { getuserdetails, dashboardTourCompleted, getStartedCompleted } from '../../redux/actions/basicinfo.actions'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    props.loadDashboardData()
    props.getuserdetails()
    props.sentVsSeen()
    props.loadSubscribersList()

    this.state = {
      isShowingModal: false,
      steps: [],
      sentseendata1: []
    }
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
  }

  componentWillReceiveProps (nextprops) {
    console.log('NextProps :', nextprops)
    if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
      browserHistory.push('/addPages')
    } else if (nextprops.subscribers && nextprops.subscribers.length > 0) {
      // this means more than 0 subscribers
      console.log('More than 0 subscribers')
      this.setState({isShowingModal: false})
    } else if (nextprops.pages && nextprops.pages.length > 0 && nextprops.subscribers && nextprops.subscribers.length === 0) {
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
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Dashboard'
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
    console.log('props', this.props)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            !(this.props.user && this.props.user.dashboardTourSeen) &&
            <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />
          }
          <AlertContainer ref={a => this.msg = a} {...alertOptions} />
          {
            this.state.isShowingModal &&
            <GettingStarted pages={this.props.pages} />
          }
          <div className='row'>
            {
              this.props.pages && this.props.pages.length > 0 &&
              <PageLikesSubscribers connectedPages={this.props.pages} />
            }
            {
              this.props.dashboard &&
              <CardBoxes data={this.props.dashboard} />
            }
          </div>
          {
            this.props.sentseendata &&
            <CardsWithProgress data={this.props.sentseendata} />
          }
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
