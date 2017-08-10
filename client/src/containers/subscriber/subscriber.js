/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Responsive from '../sidebar/responsive'
import Dashboard from '../dashboard/dashboard'
import Header from '../header/header'
import HeaderResponsive from '../header/headerResponsive'
import { connect } from 'react-redux'
import {loadSubscribersList} from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'

class Subscriber extends React.Component {
  constructor (props, context) {
    super(props, context)
   		props.loadSubscribersList()
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
                  <h3>Subscribers</h3>
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Firstname</th>
                          <th>Lastname</th>
                          <th>Email</th>
                          <th>Locale</th>
                          <th>Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                      				  this.props.subscribers.map((subscriber, i) => (
                        <tr>
                          <td>{subscriber.firstName}</td>
                          <td>{subscriber.lastName}</td>
                          <td>{subscriber.email}</td>
                          <td>{subscriber.locale}</td>
                          <td>{subscriber.gender}</td>
                        </tr>
                        		))
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
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
