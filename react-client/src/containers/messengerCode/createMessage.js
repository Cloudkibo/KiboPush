/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import AlertContainer from 'react-alert'
import { browserHistory } from 'react-router'
import { validateFields } from '../../containers/convo/utility'
import { updateData } from '../../redux/actions/messengerCode.actions'

class messengerCodeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('props.messengerCode.pageId in messengerCodeMessage', props.messengerCode.pageId)
    console.log('props.pages', props.pages)

    this.state = {
      buttonActions: ['open website', 'open webview'],
      broadcast: props.messengerCode.optInMessage ? props.messengerCode.optInMessage : [],
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
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      document.title = `${title} | Edit Message`
    } else {
      document.title = `${title} | Create Message`
    }
  }

  goBack () {
    if (this.props.location.state.module === 'edit') {
      var newmessengerCode = this.props.location.state.selectedMessengerCode
      newmessengerCode['optInMessage'] = this.props.messengerCode.optInMessage
      console.log('find me i m here ',newmessengerCode)
      browserHistory.push({
        pathname: `/editMessengerCode`,
        state: {module: 'edit', messengerCode: newmessengerCode}
      })
    } else {
      console.log('go back page', this.props.messengerCode)
      browserHistory.push({
        pathname: `/createMessengerCode`,
        state: {messengerCode: this.props.messengerCode, module: 'createMessage'}
      })
    }
  }

  saveMessage () {
    console.log('this.state.broadcast', this.state.broadcast)
    console.log('create message messengercode', this.props.messengerCode)

    // console.log('In go saveMessage method messengerRefURL', this.props.messengerRefSelectedURL)
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    } else {
    var edit = {
      page_id: this.props.messengerCode.pageId,
      pageId: this.props.messengerCode.pageId,
      optInMessage: this.state.broadcast,
      QRCode: this.props.messengerCode.QRCode
    }
    this.props.updateData(this.props.messengerCode, edit)
    this.msg.success('Message has been saved.')
  }
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
    // console.log('this.props.messengerRefURL', this.props.messengerRefURL)
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
          pageId={this.props.messengerCode.pageId}
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
    messengerCode: state.messengerCodeInfo.messengerCode,
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(messengerCodeMessage)
