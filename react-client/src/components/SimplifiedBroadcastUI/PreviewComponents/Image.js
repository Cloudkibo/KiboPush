/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast,
  uploadRequest
} from '../../../redux/actions/broadcast.actions'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import ImageModal from '../ImageModal'

class Image extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      imgSrc: this.props.image ? this.props.image.url : '',
      editing: false
    }
    this.edit = this.edit.bind(this)
    this.closeEditButton = this.closeEditButton.bind(this)
    this.openImageModal = this.openImageModal.bind(this)
  }

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openImageModal () {
    console.log('opening ImageModal for edit', this.state)
    return (<ImageModal edit file={this.state.file} id={this.props.id} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
  }

  componentDidMount () {
    if (this.props.image && this.props.image.url) {
      console.log('in componentDidMount of Image', this.props.image)
      if (this.props.pages) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.image.url,
          componentType: 'image',
          id: this.props.image.id,
          name: this.props.image.name
        }, {id: this.props.id,
          componentType: 'image',
          fileName: this.props.image.name,
          fileurl: '',
          image_url: '',
          type: 'jpg', // jpg, png, gif
          size: ''
        }, this.props.handleImage, this.setLoading)
      }
    }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          this.state.editing && this.openImageModal()
        }
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-15px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={(this.state.imgWidth ? {marginLeft: this.state.imgWidth + 'px', height: 20 + 'px'} : {float: 'right', height: 20 + 'px', margin: -15 + 'px'})}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='broadcast-component' >
          <div className='ui-block' >
            {
              this.state.imgSrc &&
              <img src={this.state.imgSrc} style={{maxWidth: '90%'}} />
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
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
    uploadRequest: uploadRequest,
    uploadImage: uploadImage,
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Image)
