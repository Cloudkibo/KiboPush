import React from 'react'
import { connect } from 'react-redux'
import { RingLoader } from 'halogenium'
import { uploadImage, uploadTemplate } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import PropTypes from 'prop-types'

class CardArea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialFile: this.props.initialFile,
      showPreview: false,
      loading: false,
      imgWidth: null,
      imgHeight: null,
      file: props.card.fileurl ? {
        fileurl: props.card.fileurl,
        image_url: props.card.image_url,
        fileName: props.card.fileName,
        type: props.card.type,
        size: props.card.size
      } : null,
      title: props.card.title ? props.card.title : '',
      subtitle: props.card.description ? props.card.description : '',
      imgSrc: props.card.image_url ? props.card.image_url : '',
    }

    this._onChange = this._onChange.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.clickFile = this.clickFile.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value})
    this.props.updateParentState({
      id: 1,
      componentName: 'card',
      componentType: 'card',
      fileurl: this.state.file && this.state.file.fileurl ? this.state.file.fileurl : '',
      image_url: this.state.file && this.state.file.image_url ? this.state.file.image_url : '',
      fileName: this.state.file  && this.state.file.fileName ? this.state.file.fileName : '',
      type: this.state.file && this.state.file.type ? this.state.file.type : '',
      size: this.state.file && this.state.file.size ? this.state.file.size : '',
      title: e.target.value,
      description: this.state.subtitle,
      buttons: this.props.card.buttons ? this.props.card.buttons : []
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value})
    this.props.updateParentState({
      id: 1,
      componentName: 'card',
      componentType: 'card',
      fileurl: this.state.file && this.state.file.fileurl ? this.state.file.fileurl : '',
      image_url: this.state.file && this.state.file.image_url ? this.state.file.image_url : '',
      fileName: this.state.file  && this.state.file.fileName ? this.state.file.fileName : '',
      type: this.state.file && this.state.file.type ? this.state.file.type : '',
      size: this.state.file && this.state.file.size ? this.state.file.size : '',
      title: this.state.title,
      description: e.target.value,
      buttons: this.props.card.buttons ? this.props.card.buttons : []
    })
  }

  clickFile () {
    this.file.click()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    // let newState = {
    //   file: nextProps.file ? nextProps.file : null,
    //   imgSrc: nextProps.imgSrc ? nextProps.imgSrc : ''
    // }
    // console.log('AddImage newState', newState)
    // this.setState(newState)
  }

  componentDidMount () {
    // if (this.props.image && this.props.image.url) {
    //   console.log('in componentDidMount of Image', this.props.image)
    //   this.setState({imgSrc: this.props.image.url, showPreview: true})
      // if (this.props.pages) {
      //   this.props.uploadTemplate({pages: this.props.pages,
      //     url: this.props.image.url,
      //     componentType: 'image',
      //     id: this.props.image.id,
      //     name: this.props.image.name
      //   }, {id: this.props.id,
      //     componentType: 'image',
      //     fileName: this.props.image.name,
      //     fileurl: '',
      //     image_url: '',
      //     type: 'jpg', // jpg, png, gif
      //     size: ''
      //   }, this.props.handleImage, this.setLoading)
      // }
    // }
  }

  setLoading () {
    this.setState({loading: false})
  }

  _onChange (images) {
    var file = this.file.files[0]
    if (file) {
      if (file && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        this.setState({
          imgSrc: [reader.result], fileName: file.name
        }, () => {
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
      }, this.handleImage, this.setLoading)
    }
  }

  handleImage (fileInfo) {
    this.setState({file: fileInfo})
    this.props.updateParentState({
      id: 1,
      componentName: 'card',
      componentType: 'card',
      fileurl: fileInfo.fileurl,
      image_url: fileInfo.image_url,
      fileName: fileInfo.fileName,
      type: fileInfo.type,
      size: fileInfo.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.props.card.buttons ? this.props.card.buttons : []
    })
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '20px'}}>
        <label>Image:</label>
      <div className='broadcast-component' style={{marginBottom: '30px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div onClick={this.clickFile} className='ui-block hoverborder' style={{borderColor: this.props.required && !this.state.file ? 'red': '', height: '120px'}}>
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
              ? <div className='align-center' style={{padding: '28px'}}>
                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                <h6 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline'}}> Upload Image </h6>
              </div>
              : <div className='align-center'>
                <img src={this.state.imgSrc} style={{pointerEvents: 'none', zIndex: -1, maxHeight: 100, maxWidth: '100%'}} alt='Text' />
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
      <div className='form-group m-form__group' style={{marginBottom: '35px'}}>
        <span style={{fontWeight: 'bold'}}>Image title:</span>
        <input type='text' className='form-control m-input' value={this.state.title}
          placeholder='Enter a title for your image' onChange={this.handleTitleChange} />
      </div>
      <div className='form-group m-form__group'>
        <span style={{fontWeight: 'bold'}}>Image subtitle (optional):</span>
        <input type='text' className='form-control m-input' placeholder='Enter a subtitle to provide more information'
          onChange={this.handleSubtitleChange} value={this.state.subtitle} />
      </div>
    </div>
    )
  }
}

CardArea.propTypes = {
  'card': PropTypes.object.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage,
    uploadTemplate
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(CardArea)
