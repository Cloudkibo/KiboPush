/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'

class Media extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.updateMediaDetails = this.updateMediaDetails.bind(this)
    this.state = {
      errorMsg: '',
      showErrorDialogue: false,
      imgSrc: props.img ? props.img : '',
      button: props.buttons ? props.buttons : [],
      fileurl: '',
      fileName: '',
      type: '',
      size: '',
      image_url: '',
      loading: false,
      showPreview: false,
      file: '',
      previewUrl: '',
      mediaType: '',
      styling: {minHeight: 30, maxWidth: 400},
      buttonActions: this.props.buttonActions.slice(0, 2)
    }
  }

  componentDidMount () {
    if (this.props.media) {
      var video = this.props.media.type.match('video.*')
      var image = this.props.media.type.match('image.*')
      if (image) {
        if (this.props.pages) {
          this.props.uploadTemplate({pages: this.props.pages,
            url: this.props.media.fileurl.url,
            componentType: 'image',
            id: this.props.media.fileurl.id,
            name: this.props.media.fileurl.name
          }, { fileurl: '',
            fileName: this.props.media.fileurl.name,
            type: this.props.media.type,
            image_url: '',
            size: this.props.media.size
          }, this.updateImageUrl, this.setLoading)
        }
      }
      if (video) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.media.fileurl.url,
          componentType: 'video',
          id: this.props.media.fileurl.id,
          name: this.props.media.fileurl.name
        }, { id: this.props.id,
          componentType: 'video',
          fileName: this.props.media.fileurl.name,
          type: this.props.media.fileurl.type,
          size: this.props.media.fileurl.size
        }, this.updateFileUrl, this.setLoading)
      }
      this.updateMediaDetails(this.props, image, video)
    }
  }

  updateMediaDetails (mediaProps, image, video) {
    console.log('mediaProps', mediaProps)
    if (mediaProps.media && mediaProps.media !== '') {
      if (image) {
        this.setState({
          componentType: 'media',
          imgSrc: mediaProps.media.fileurl.url,
          button: mediaProps.media.buttons,
          mediaType: mediaProps.media.mediaType
        })
      } else if (video) {
        this.setState({
          componentType: 'media',
          imgSrc: '',
          file: this.props.media,
          button: mediaProps.media.buttons,
          mediaType: mediaProps.media.mediaType
        })
      }
    }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>

        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='ui-block' style={{maxWidth: '250px', margin: 'auto', marginTop: '100px'}} >
          {
              this.state.imgSrc &&
              <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
                <img src={this.state.imgSrc} style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
              </div>
          }
          {
            (this.state.file && !this.state.imgSrc) &&
            <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
              <video controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                <source src={this.state.file.fileurl.url} type='audio/mpeg' />
              </video>
            </div>
          }
          {
              visibleButtons.map((button, index) => {
                return (
                  <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px', padding: '5px', paddingTop: '5%'}}>
                    <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                  </div>
                )
              })
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage: uploadImage,
    uploadFile: uploadFile,
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Media)
