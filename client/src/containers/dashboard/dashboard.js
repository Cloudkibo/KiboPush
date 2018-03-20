/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
import { joinRoom, registerAction } from '../../utility/socketio'
import { getuserdetails, getStartedCompleted } from '../../redux/actions/basicinfo.actions'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    props.loadMyPagesList()
    props.loadDashboardData()
    props.sentVsSeen()
    props.loadSubscribersList()
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.user && nextprops.user.emailVerified === false &&
      (nextprops.user.currentPlan === 'plan_C' || nextprops.user.currentPlan === 'plan_D')) {
      browserHistory.push({
        pathname: '/resendVerificationEmail'
      })
    }
    if (nextprops.user) {
      if ((nextprops.user.currentPlan === 'plan_A' || nextprops.user.currentPlan === 'plan_ B') && !nextprops.user.facebookInfo) {
        browserHistory.push({
          pathname: '/connectFb',
          state: { account_type: 'individual' }
        })
      } else if (nextprops.subscribers && nextprops.subscribers.length > 0) {
        // this means more than 0 subscribers
        this.setState({isShowingModal: false})
      } else if (nextprops.pages && nextprops.pages.length > 0 && nextprops.subscribers && nextprops.subscribers.length === 0) {
        // this means 0 subscribers
        this.setState({isShowingModal: true})
      } else if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
        // browserHistory.push({
          // pathname: '/addPages',
          // state: {showMsg: true}
        // })
      }
      if (nextprops.user) {
        joinRoom(nextprops.user.companyId)
      }
      if (nextprops.sentseendata) {
        var temp = []
        temp.push(nextprops.sentseendata)
        this.setState({sentseendata1: nextprops.sentseendata})
      }
    }
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Dashboard'
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/fb.js')
    // document.body.appendChild(addScript)
    var compProp = this.props
    registerAction({
      event: 'dashboard_updated',
      action: function (data) {
        compProp.loadMyPagesList()
        compProp.loadDashboardData()
      }
    })
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <AlertContainer ref={a => this.msg = a} {...alertOptions} />
          {
            this.props.user && !this.props.user.wizardSeen &&
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
  console.log('state', state)
  return {
    user: (state.basicInfo.user),
    dashboard: (state.dashboardInfo.dashboard),
    sentseendata: (state.sentSeenInfo.sentseendata),
    pages: (state.pagesInfo.pages),
    subscribers: (state.subscribersInfo.subscribers)
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
      getStartedCompleted: getStartedCompleted,
      sentVsSeen: sentVsSeen
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
