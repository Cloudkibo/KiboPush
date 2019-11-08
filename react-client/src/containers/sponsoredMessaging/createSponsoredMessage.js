/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Header from './header'
import Tabs from './tabs'
import {updateSponsoredMessage} from '../../redux/actions/sponsoredMessaging.actions'


class CreateSponsoredMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isEdit: false
    }
    this.onEdit = this.onEdit.bind(this)
    this.onSend = this.onSend.bind(this)
  }
  componentDidMount () {
    console.log('this.props.location.state', this.props.location.state)
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      this.setState({isEdit: true})
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit Sponsored Message`
    } else {
      document.title = `${title} | Create Sponsored Message`
    }
  }
  onEdit () {
   
  }
  onSend () {
   
  }
  setStatus (value) {
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <Header onSend={this.onSend}
                  onEdit={this.onEdit}
                  isEdit={this.state.isEdit}
                />
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-md-12 col-lg-12 col-sm-12'>
                    <Tabs />
                    </div>
                  </div>
                </div>
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
    sponsoredMessage: (state.sponsoredMessagingInfo.sponsoredMessage),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage:updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSponsoredMessage)
