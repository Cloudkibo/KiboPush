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
      imgSrc: props.media.image_url ? props.media.image_url : '',
      buttons: props.buttons ? props.buttons : [],
      media: props.media ? props.media : null
    }
    this.edit = this.edit.bind(this)
  }

  edit () {
    if (this.props.youtubeLink) {
      this.props.editComponent('video', {
        edit: true,
        youtubeLink:this.props.youtubeLink,
        videoLink:this.props.videoLink,
        buttonActions:this.props.buttonActions,
        file:this.state.media,
        buttons:this.state.buttons,
        id:this.props.id
      })
    } else {
      this.props.editComponent('media', {
        edit: true,
        buttonActions: this.props.buttonActions,
        file:this.state.media,
        imgSrc:this.state.imgSrc,
        buttons:this.state.buttons,
        id:this.props.id
      })
    }
  }

  componentDidMount () {
    // this.props.handleMedia({id: this.props.id,
    //   componentType: 'media',
    //   mediaType: this.props.media.mediaType,
    //   fileurl: this.props.media.fileurl,
    //   image_url: this.props.media.image_url,
    //   fileName: this.props.media.fileName,
    //   type: this.props.media.type,
    //   size: this.props.media.size,
    //   buttons: this.state.buttons})
  }

  updateMediaDetails (mediaProps, image, video) {
    console.log('mediaProps', mediaProps)
    if (mediaProps.media && mediaProps.media !== '') {
      if (image) {
        this.setState({
          componentType: 'media',
          imgSrc: mediaProps.media.fileurl.url,
          buttons: mediaProps.media.buttons,
          mediaType: mediaProps.media.mediaType
        })
      } else if (video) {
        this.setState({
          componentType: 'media',
          imgSrc: '',
          file: this.props.media,
          buttons: mediaProps.media.buttons,
          mediaType: mediaProps.media.mediaType
        })
      }
    }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          (this.state.editing) && (this.props.youtubeLink ? this.openYouTubeModal() : this.openMediaModal())
        }
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-15px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: '20px', margin: '-15px', marginRight: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='ui-block' style={{maxWidth: '250px'}} >
          {
              this.state.imgSrc &&
              <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}} className='broadcastContent'>
                <img src={this.state.imgSrc} alt='' style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
              </div>
          }
          {
            (this.state.media && !this.state.imgSrc) &&
            <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}} className='broadcastContent'>
              <video controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                <source src={this.state.media.fileurl.url} type='audio/mpeg' />
              </video>
            </div>
          }
          {
              this.state.buttons.map((button, index) => {
                return (
                  <div id={`button-${button.id}`} style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px', padding: '5px', paddingTop: '5%'}}>
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
