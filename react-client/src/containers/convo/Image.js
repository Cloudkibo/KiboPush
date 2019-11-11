/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast,
  uploadRequest
} from '../../redux/actions/broadcast.actions'
import { RingLoader } from 'halogenium'
import { uploadImage, uploadTemplate } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class Image extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.state = {
      imgSrc: '',
      showPreview: false,
      loading: false,
      imgWidth: null,
      imgHeight: null
    }
    this.onImgLoad = this.onImgLoad.bind(this)
  }

  componentDidMount () {
    if (this.props.image && this.props.image.url) {
      console.log('in componentDidMount of Image', this.props.image)
      this.setState({imgSrc: this.props.image.url, showPreview: true})
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

  setLoading () {
    this.setState({loading: false})
  }

  _onChange (images) {
  // Assuming only image
    console.log('in _onChange')
    var file = this.file.files[0]
    if (file) {
      if (file && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      console.log('image file', file)
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        console.log('FileReader', reader)
        this.setState({
          imgSrc: [reader.result]
        })
      }

      this.setState({
        showPreview: false,
        loading: true
      })
      this.props.uploadImage(file, this.props.pages, 'image', {
        id: this.props.id,
        componentType: 'image',
        fileName: file.name,
        fileurl: '',
        image_url: '',
        type: file.type, // jpg, png, gif
        size: file.size
      }, this.props.handleImage, this.setLoading)
    }

  // TODO: concat files
  }

  onImgLoad (e) {
    e.persist()
    console.log('image dimensions after load', {width: e.target.width, height: e.target.height})
    this.setState({imgWidth: e.target.width, imgHeight: e.target.height})
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
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {!this.state.loading &&
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={(this.state.imgWidth ? {marginLeft: this.state.imgWidth + 'px', height: 20 + 'px'} : {float: 'right', height: 20 + 'px', margin: -15 + 'px'})}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        }
        <div className='ui-block hoverborder' style={(this.state.imgWidth ? {minHeight: (this.state.imgHeight + 25) + 'px', minWidth: (this.state.imgWidth + 25) + 'px'} : {minHeight: 100, maxWidth: 400, padding: 25})}>
          {
          this.state.loading
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : <div>
            <input
              ref={el => { this.file = el }}
              type='file'
              name='user[image]'
              multiple='true'
              accept='image/*'
              title=' '
              onChange={this._onChange} style={{position: 'absolute', opacity: 0, minHeight: 150, margin: -25, zIndex: 5, cursor: 'pointer'}} />
            {
              (this.state.imgSrc === '')
              ? <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                <h4 style={{pointerEvents: 'none', zIndex: -1}}> Image </h4>
              </div>
              : <img alt='' onLoad={this.onImgLoad} ref={el => { this.image = el }} style={{maxWidth: 300, margin: -25, padding: 25}} src={this.state.imgSrc} />
          }
          </div>
          }
          { this.state.showPreview &&
            <div style={{padding: '10px', marginTop: '40px'}}>
              <a href={this.state.imgSrc} target='_blank' rel='noopener noreferrer' download>
                <h6><i className='fa fa-file-image-o' /><strong> Download Image </strong></h6>
              </a>
            </div>
          }
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
