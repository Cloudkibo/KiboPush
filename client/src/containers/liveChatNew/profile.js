/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { unSubscribe } from '../../redux/actions/livechat.actions'

// import Image from 'react-image-resizer'
//  import ChatBox from './chatbox'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      subscriber: ''
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }
  showDialog (subscriber) {
    this.setState({isShowingModal: true, subscriber: subscriber})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  render () {
    return (
        <div className='col-xl-3'>
          {
            this.state.isShowingModal &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeDialog}>
                <h3>Unsubscribe</h3>
                <p>Are you sure you want to Unsubscribe this Subscriber?</p>
                <div style={{width: '100%', textAlign: 'center'}}>
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button className='btn btn-primary' onClick={(e) => {
                      this.props.unSubscribe(this.state.subscriber, {company_id: this.props.user._id})
                      this.closeDialog()
                    }}>
                      Yes
                    </button>
                  </div>
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button className='btn btn-primary' onClick={this.closeDialog}>
                      No
                    </button>
                  </div>
                </div>
              </ModalDialog>
            </ModalContainer>
          }
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
                  {this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
                    <a className='m-card-profile__email m-link' onClick={() => this.showDialog(this.props.currentSession.subscriber_id._id)} style={{color: '#716aca', cursor: 'pointer'}}>
                      (Unsubscribe)
                    </a>
                  }
                  <br />
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
    chat: (state.liveChat.chat),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unSubscribe: (unSubscribe)
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
