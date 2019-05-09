/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'
import MediaModal from '../MediaModal'

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
  }

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openMediaModal () {
    console.log('opening MediaModal for edit', this.state)
    return (<MediaModal edit file={this.state.media} imgSrc={this.state.imgSrc} buttons={this.state.buttons} id={this.props.id} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
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
          this.state.editing && this.openMediaModal()
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
                <source src={this.state.file.fileurl.url} type='audio/mpeg' />
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
