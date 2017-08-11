/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Responsive from '../sidebar/responsive'
import Dashboard from '../dashboard/dashboard'
import Header from '../header/header'
import HeaderResponsive from '../header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {addPoll, loadPollsList, sendpoll} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import {formatAMPM,handleDate} from '../../utility/utils'

class Poll extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.polls) {
      console.log('Polls Updated', nextProps.polls)
			// this.setState({broadcasts: nextProps.broadcasts});
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
   this.props.loadPollsList()
 }

  gotoEdit (broadcast) {
		 this.props.history.push({
   pathname: '/editbroadcast',
   state: broadcast
 })
  }
  gotoView (poll) {
		 this.props.history.push({
   pathname: `/pollResult/${poll._id}`,
   state: poll
 })
  }
  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>Polls</h3>
                  <Link to='createpoll' className='pull-right'>
                    <button className='btn btn-primary btn-sm'> Create Poll</button>
                  </Link>
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th>Statment</th>
                          <th>Created At</th>
                          <th>Sent</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        { (this.props.polls)
								? this.props.polls.map((poll, i) => (
  <tr>
    <td>{poll.platform}</td>
    <td>{poll.statement}</td>
    <td>{handleDate(poll.datetime)}</td>
    <td>{poll.sent}</td>
    <td>
      <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.props.sendpoll(poll)}>Send</button>
      <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.gotoView(poll)}>Report</button>
    </td>
  </tr>
								)) : <br />
							}

                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </main>

          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    polls: (state.pollsInfo.polls)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPollsList: loadPollsList, addPoll: addPoll, sendpoll: sendpoll}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Poll)
