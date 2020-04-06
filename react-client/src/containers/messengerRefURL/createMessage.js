/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import AlertContainer from 'react-alert'
import { validateFields } from '../../containers/convo/utility'
import { updateData } from '../../redux/actions/messengerRefURL.actions'
import { deleteInitialFiles, getFileIdsOfBroadcast, deleteFile } from '../../utility/utils'

class MessengerRefURLMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('props.messengerRefURL.pageId in MessengerRefURLMessage', props.messengerRefURL.pageId)
    console.log('props.pages', props.pages)
    this.state = {
      buttonActions: ['open website', 'open webview'],
      broadcast: props.messengerRefURL.reply ? props.messengerRefURL.reply : [],
      pageId: props.pages.filter((page) => page.pageId === props.messengerRefURL.pageId)[0]._id,
      convoTitle: 'Opt-In Message',
      initialFiles: this.props.location.state.initialFiles
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
    this.editing = true
    if (this.props.location.state.module === 'edit') {
      var newMessengerRefURL = this.props.location.state.messengerRefSelectedURL
      newMessengerRefURL['reply'] = this.props.messengerRefURL.reply
      newMessengerRefURL['initialFiles'] = this.props.location.state.realInitialFiles
      this.props.history.push({
        pathname: `/editMessengerRefURL`,
        state: {pageId: this.props.pageId, _id: this.props.pages[0], module: 'edit', messengerRefURL: newMessengerRefURL, pageName: this.props.location.state.pageName}
      })
    } else {
      this.props.history.push({
        pathname: `/createMessengerRefURL`,
        state: {pageId: this.props.pageId, _id: this.state.pageId, pageName: this.props.location.state.pageName,  messengerRefURL: this.props.messengerRefURL}
      })
    }
  }

  saveMessage () {
    console.log('this.state.broadcast', this.state.broadcast)

    // console.log('In go saveMessage method messengerRefURL', this.props.messengerRefSelectedURL)
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    let newFiles = this.props.location.state.newFiles
    if (newFiles) {
      newFiles = newFiles.concat(this.state.newFiles)
    } else {
      newFiles = this.state.newFiles
    }
    newFiles = deleteInitialFiles(newFiles, getFileIdsOfBroadcast(this.state.broadcast))
    if (this.props.location.state.module === 'edit') {
      var edit = {
        pageId: this.props.messengerRefURL.pageId,
        ref_parameter: this.props.messengerRefURL.ref_parameter,
        reply: this.state.broadcast,
        sequenceId: this.props.messengerRefURL.sequenceId,
        newFiles: newFiles
      }
      this.props.updateData(this.props.messengerRefURL, 'reply', this.state.broadcast, edit)
    } else {
      this.props.messengerRefURL.newFiles = newFiles
      this.props.updateData(this.props.messengerRefURL, 'reply', this.state.broadcast)
    }
    let initialFiles = this.state.initialFiles.concat(newFiles)
    this.setState({newFiles: [], initialFiles})
    this.msg.success('Message has been saved.')
  }

  componentWillUnmount () {
    if (!this.editing) {
      if (this.state.newFiles) {
        for (let i = 0; i < this.state.newFiles.length; i++) {
          deleteFile(this.state.newFiles[i])
        }
      }
      if (this.props.messengerRefURL.newFiles) {
        for (let i = 0; i < this.props.messengerRefURL.newFiles.length; i++) {
          deleteFile(this.props.messengerRefURL.newFiles[i])
        }
      }
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
          newFiles={this.state.newFiles}
          initialFiles={this.state.initialFiles}
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
