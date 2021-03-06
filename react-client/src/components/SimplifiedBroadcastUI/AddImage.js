/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { RingLoader } from 'halogenium'
import { uploadImage, uploadTemplate } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { deleteFile } from '../../utility/utils'

class Image extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.state = {
      file: this.props.file ? this.props.file : null,
      initialFile: this.props.initialFile,
      imgSrc: this.props.imgSrc ? this.props.imgSrc : '',
      showPreview: false,
      loading: false,
      imgWidth: null,
      imgHeight: null
    }
    this.handleImage = this.handleImage.bind(this)
    this.clickFile = this.clickFile.bind(this)
  }

  clickFile () {
    this.file.click()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    let newState = {
      file: nextProps.file ? nextProps.file : null,
      imgSrc: nextProps.imgSrc ? nextProps.imgSrc : ''
    }
    console.log('AddImage newState', newState)
    this.setState(newState)
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
    console.log('finished loading AddImage')
    this.setState({loading: false})
  }

  _onChange (images) {
  // Assuming only image
    console.log('in _onChange')
    if (this.state.file && this.state.file.fileurl && this.state.file.fileurl.id) {
      let canBeDeleted = true
      for (let i = 0; i < this.props.initialFiles.length; i++) {
        if (this.state.file.fileurl.id === this.props.initialFiles[i]) {
          canBeDeleted = false
          break
        }
      }
      for (let i = 0; i < this.props.initialModalFiles.length; i++) {
        if (this.state.file.fileurl.id === this.props.initialModalFiles[i]) {
          canBeDeleted = false
          break
        }
      }
      if (canBeDeleted) {
        this.props.setTempFiles(null, [this.state.file.fileurl.id])
        deleteFile(this.state.file.fileurl.id)
      }
    }
    if (this.props.onSelect) {
      this.props.onSelect(images)
    }
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
          imgSrc: [reader.result], fileName: file.name
        }, () => {
          this.props.updateImage(this.state.imgSrc)
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
      }, this.handleImage, this.setLoading, this.props.alertMsg)
    }
  }

  handleImage (fileInfo) {
    console.log('finished uploading file', fileInfo)
    this.props.updateFile(fileInfo)
    this.setState({file: fileInfo})
    //this.props.handleImage(fileInfo)
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
      <div className='broadcast-component' style={{marginBottom: 20 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div onClick={this.clickFile} className='ui-block hoverborder' style={{borderColor: this.props.required && !this.state.file ? 'red': ''}}>
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
              onChange={this._onChange} style={{display: 'none'}} />
            {
              (this.state.imgSrc === '')
              ? <div className='align-center' style={{padding: '5px', marginTop: '-5px'}}>
                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                <h6 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline'}}> Upload Image </h6>
              </div>
              : <div className='align-center' style={{padding: '5px'}}>
                <img src={this.state.imgSrc} style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40, maxWidth: '100%'}} alt='Text' />
                <h6 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', overflowWrap: 'break-word'}}>{this.state.file ? this.state.file.fileName : 'Image'}</h6>
              </div>
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
        <div style={{color: 'red', textAlign: 'left'}}>{this.props.required && !this.state.file ? '*Required' : ''}</div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage,
    uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Image)
