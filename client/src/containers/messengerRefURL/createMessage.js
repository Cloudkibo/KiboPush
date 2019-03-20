/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GenericMessage from '../../components/GenericMessage'
import AlertContainer from 'react-alert'
import { browserHistory } from 'react-router'
import { validateFields } from '../../containers/convo/utility'
import { updateData } from '../../redux/actions/messengerRefURL.actions'

class MessengerRefURLMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('props.messengerRefURL.pageId in MessengerRefURLMessage', props.messengerRefURL.pageId)
    console.log('props.pages', props.pages)

    this.state = {
      buttonActions: ['open website', 'open webview', 'add share'],
      broadcast: props.messengerRefURL.reply ? props.messengerRefURL.reply : [],
      pageId: props.pages.filter((page) => page.pageId === props.messengerRefURL.pageId)[0]._id,
      convoTitle: 'Opt-In Message'
    }
    this.saveMessage = this.saveMessage.bind(this)
    this.goBack = this.goBack.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Message`
  }

  goBack () {
    if (this.props.location.state.module === 'edit') {
      var new_messengerRefURL = this.props.location.state.messengerRefSelectedURL
      new_messengerRefURL['reply'] = this.props.messengerRefURL.reply
      browserHistory.push({
        pathname: `/createMessengerRefURL`,
        state: {pageId: this.props.pageId, _id: this.props.pages[0], module: 'edit', messengerRefURL: new_messengerRefURL}
      })
    }
   else {
    browserHistory.push({
      pathname: `/createMessengerRefURL`,
      state: {pageId: this.props.pageId, _id: this.state.pageId}
    })
   }
  }

  saveMessage () {
    console.log('this.state.broadcast', this.state.broadcast)

    //console.log('In go saveMessage method messengerRefURL', this.props.messengerRefSelectedURL)
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    if (this.props.location.state.module === 'edit') {
      var edit = {
        pageId: this.props.messengerRefURL.pageId,
        ref_parameter: this.props.messengerRefURL.ref_parameter,
        reply: this.state.broadcast,
        sequenceId: this.props.messengerRefURL.sequenceId
      }
    this.props.updateData(this.props.messengerRefURL, 'reply', this.state.broadcast, edit)
    }
    else {
    this.props.updateData(this.props.messengerRefURL, 'reply', this.state.broadcast)
    }
    this.msg.success('Message has been saved.')
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
   // console.log('this.props.location.state.messengerRefSelectedURL', this.props.location.state.messengerRefSelectedURL)
    //console.log('this.props.messengerRefURL', this.props.messengerRefURL)
   // console.log('this.props.pages', this.props.pages)
  //  console.log('this.state.pageId', this.state.pageId)
    console.log('this.state.broadcast', this.state.broadcast)
    return (
      <div style={{width: '100%'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content' style={{marginBottom: '-30px'}}>
          <div className='row'>
            <div className='col-12'>
              <div className='pull-right'>
                <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.goBack}>
                Back
              </button>
                <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.saveMessage}>
                Save
              </button>
              </div>
            </div>
          </div>
        </div>
        <GenericMessage
          pageId={this.props.messengerRefURL.pageId}
          pages={[this.state.pageId]}
          broadcast={this.state.broadcast}
          handleChange={this.handleChange}
          convoTitle={this.state.convoTitle}
          buttonActions={this.state.buttonActions}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerRefURL: state.messengerRefURLInfo.messengerRefURL,
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerRefURLMessage)
