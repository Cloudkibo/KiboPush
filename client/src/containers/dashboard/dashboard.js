/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { loadDashboardData } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadDashboardData()
    props.loadMyPagesList()
    props.loadSubscribersList()
    this.state = {
      inviteUrl: '',
    }
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
      browserHistory.push('/addPages')
    }
    if(nextprops.pages && nextprops.pages.length !== 0){
      this.setState({inviteUrl: 'https://m.me/' + nextprops.pages[0].pageId})
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
    if(this.props.pages && this.props.pages.length !== 0){
      this.setState({inviteUrl: 'https://m.me/' + this.props.pages[0].pageId})
    }
  }

  selectPage(event){
     this.setState({inviteUrl: 'https://m.me/' + event.target.value})
  }

  render () {
    return (
      <div className='container'>
        <br /><br /><br /><br /><br /><br />
        <div className='row'>
          <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2>Getting Started</h2>
            <div className='row'>
              <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
                <div className='ui-block align-center' style={{padding: 25, height: 250}}>
                  <h5>Step 1: </h5>
                  <p>Select A Page From The Drop Down</p>
                  <div class='col-xl-12 align-center padding80'>
                    <select onChange={this.selectPage}>
                      {
                              (this.props.pages) ? this.props.pages.map((page) => {
                                return <option value={page.pageId}>{page.pageName}</option>
                              }) : <p> No Pages Found </p>
                            }
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
                <div className='ui-block align-center' style={{padding: 25, height: 250}}>
                  <h5>Step 2: </h5>
                  <p>Become a subscriber of the page. Make sure you send a message to you page in order to subscribe</p>
                  <div class='col-xl-12 align-center padding80'>
                    <a className='btn btn-primary btn-sm'> Subscribe Now </a>
                  </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
                <div className='ui-block align-center' style={{padding: 25, height: 250}}>
                  <h5>Step 3: </h5>
                  <p>Try to send a test broadcast to see how it works</p>
                  <div class='col-xl-12 align-center padding80'>
                    <button className='btn btn-primary btn-sm'> Send Test Broadcast </button>
                  </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-3'>
                <div className='ui-block align-center' style={{padding: 25, height: 250}}>
                  <h5>Step 4: </h5>
                  <p>Invite other people to subscribe by sharing this link: <a href= {this.state.inviteUrl}>{this.state.inviteUrl}</a></p>
                  <div class='col-xl-12 align-center padding80'>
                    <button className='btn btn-primary btn-sm'> Copy Link </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className='row'>
          <main
            className='col-xl-4 push-xl-4 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
            <div className='ui-block' data-mh='friend-groups-item'>
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

            <div className='ui-block' data-mh='friend-groups-item'>
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
            <div className='ui-block' data-mh='friend-groups-item'>
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

            <div className='ui-block' data-mh='friend-groups-item'>
              <div className='friend-item friend-groups'>
                <div className='friend-item-content'>
                  <div className='friend-avatar'>
                    <h1>{this.props.dashboard.activityChart.surveys}</h1>
                    <div className='author-content'>
                      <Link to='/surveys' className='h5 author-name'>Surveys</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </aside>
          <aside className='col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            <div className='ui-block' data-mh='friend-groups-item'>
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

            <div className='ui-block' data-mh='friend-groups-item'>
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
    {loadDashboardData: loadDashboardData, loadMyPagesList: loadMyPagesList, loadSubscribersList: loadSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
