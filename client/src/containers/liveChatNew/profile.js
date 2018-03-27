/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import Image from 'react-image-resizer'
//  import ChatBox from './chatbox'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {

    }
  }

  render () {
    return (
      <div className='col-xl-3'>
        <div className='m-portlet m-portlet--full-height'>
          <div className='m-portlet__body'>
            <div className='m-card-profile'>
              <div className='m-card-profile__pic'>
                <div className='m-card-profile__pic-wrapper'>
                  <img style={{width: '80px', height: '80px'}} src={this.props.currentSession.subscriber_id.profilePic} alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.currentSession.subscriber_id.firstName + ' ' + this.props.currentSession.subscriber_id.lastName}
                </span>
                <a className='m-card-profile__email m-link'>
                  {this.props.currentSession.subscriber_id.gender + ', ' + this.props.currentSession.subscriber_id.locale}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    chat: (state.liveChat.chat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
