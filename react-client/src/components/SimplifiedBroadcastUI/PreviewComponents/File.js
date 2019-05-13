/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../../redux/actions/broadcast.actions'
import { uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import FileModal from '../FileModal'

class File extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: this.props.file ? this.props.file : null,
      editing: false
    }
    this.edit = this.edit.bind(this)
    this.closeEditButton = this.closeEditButton.bind(this)
    this.openFileModal = this.openFileModal.bind(this)
  }

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openFileModal () {
    console.log('opening FileModal for edit', this.state)
    return (<FileModal edit file={this.state.file} id={this.props.id} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
  }

  componentDidMount () {
    if (this.props.file && this.props.file !== '') {
      if (this.props.pages && this.props.file) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.file.fileurl.url,
          componentType: 'file',
          id: this.props.file.fileurl.id,
          name: this.props.file.fileurl.name
        }, {
          id: this.props.id,
          componentType: 'file',
          fileName: this.props.file.fileName,
          type: this.props.file.type,
          size: this.props.file.size
        }, this.props.handleFile, this.setLoading)
      }
    }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        {
          this.state.editing && this.openFileModal()
        }
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px', marginRight: '-15px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', marginRight: '15px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div className='discussion' style={{display: 'inline-block'}}>
          <div className='bubble recipient' style={{maxWidth: '100%', cursor: 'pointer', fontSize: '18px'}}>
            📁 <a href={this.state.file ? this.state.file.fileurl.url : null} target='_blank' download>{this.state.file ? this.state.file.fileName : 'File'}</a>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList,
    uploadFile: uploadFile,
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(File)
