/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'
import MediaModal from '../MediaModal'
import YoutubeVideoModal from '../YoutubeVideoModal';

class Media extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.updateMediaDetails = this.updateMediaDetails.bind(this)
    this.state = {
      imgSrc: '',
      buttons: props.buttons ? props.buttons : [],
      media: props.media ? props.media : null
    }
    this.edit = this.edit.bind(this)
    this.closeEditButton = this.closeEditButton.bind(this)
    this.openMediaModal = this.openMediaModal.bind(this)
    this.openYouTubeModal = this.openYouTubeModal.bind(this)
  }

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openMediaModal () {
    console.log('opening MediaModal for edit', this.state)
    return (<MediaModal 
        edit 
        buttonActions={this.props.buttonActions} 
        file={this.state.media} 
        imgSrc={this.state.imgSrc} 
        buttons={this.state.buttons} 
        id={this.props.id} 
        pageId={this.props.pageId} 
        closeModal={this.closeEditButton} 
        addComponent={this.props.addComponent} 
        hideUserOptions={this.props.hideUserOptions} />)
  }

  openYouTubeModal () {
    console.log('opening YouTubeModal for edit', this.state)
    return (<YoutubeVideoModal 
        edit
        youtubeLink={this.props.youtubeLink} 
        videoLink={this.props.videoLink} 
        buttonActions={this.props.buttonActions} 
        file={this.state.media} 
        buttons={this.state.buttons} 
        id={this.props.id} 
        pageId={this.props.pageId} 
        closeModal={this.closeEditButton} 
        addComponent={this.props.addComponent} 
        hideUserOptions={this.props.hideUserOptions} />)
  }

  componentDidMount () {
    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      mediaType: this.props.media.mediaType,
      fileurl: this.props.media.fileurl,
      image_url: this.props.media.image_url,
      fileName: this.props.media.fileName,
      type: this.props.media.type,
      size: this.props.media.size,
      buttons: this.state.buttons})
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
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='ui-block' style={{maxWidth: '250px'}} >
          {
              this.state.imgSrc &&
              <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
                <img src={this.state.imgSrc} style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
              </div>
          }
          {
            (this.state.media && !this.state.imgSrc) &&
            <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
              <video controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                <source src={this.state.media.fileurl.url} type='audio/mpeg' />
              </video>
            </div>
          }
          {
              this.state.buttons.map((button, index) => {
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
