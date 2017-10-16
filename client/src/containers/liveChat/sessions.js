/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import ChatBox from './chatbox'

class Sessions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
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
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

  render () {
    return (
         <div className='ui-block'>
                <div className='ui-block-title'>
                  <h6 className='title'>Messages</h6>
                </div>

                <ul className='widget w-activity-feed notification-list'>
                {this.props.chat.map((singleChat) => {
                    return <li>
                    <div className='author-thumb'>
                      <img src='img/avatar49-sm.jpg' alt='author' />
                    </div>
                    <div className='notification-event'>
                      <a href='#' className='h6 notification-friend'>{ singleChat.userInfo.name }</a> { singleChat.messages[0].message} 
                        <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>2 mins ago</time></span>
                    </div>
                  </li>;
                })}
                  
                </ul>
              </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    chat: (state.liveChat.chat),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sessions)
