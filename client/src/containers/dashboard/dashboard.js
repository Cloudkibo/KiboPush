/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { loadDashboardData } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  createbroadcast
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import GettingStarted from './gettingStarted'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

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
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
      browserHistory.push('/addPages')
    } else if (nextprops.pages && nextprops.pages.length > 0 &&
      nextprops.subscribers && nextprops.subscribers.length === 0 &&
      this.props.dashboard.subscribers === 0) {
      this.setState({isShowingModal: true})
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
      title: 'Component',
      text: 'You can add components to your conversation using these button',
      selector: 'div#subscribers',
      position: 'top-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Edit Title',
      text: 'You can edit the title of your conversation by clicking the pencil icon',
      selector: 'div#polls',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Send Conversation',
      text: 'You can send your conversation using these buttons',
      selector: 'div#pages',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true}])
  }

  closeDialog () {
    this.setState({isShowingModal: false})
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
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadDashboardData: loadDashboardData,
      loadMyPagesList: loadMyPagesList,
      loadSubscribersList: loadSubscribersList,
      createbroadcast: createbroadcast
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
