/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import { createFacebookPost, editFacebookPost, uploadAttachment } from '../../redux/actions/commentCapture.actions'
import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import Halogen from 'halogen'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ReactPlayer from 'react-player'
const styles = {
  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  inputf: {
    display: 'none'
  }
}
class FacebookPosts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      postText: '',
      attachments: [],
      selectedPage: {},
      showEmojiPicker: false,
      autoReply: '',
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true,
      keywordErrors: [],
      isEdit: this.props.currentPost ? 'true' : 'false',
      loading: false,
      facebookPost: [],
      isVideo: false,
      videoPost: false,
      showImages: false,
      showVideo: false
    }
    this.onFacebookPostChange = this.onFacebookPostChange.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.replyChange = this.replyChange.bind(this)
    this.includedKeywordsChange = this.includedKeywordsChange.bind(this)
    this.excludedKeywordsChange = this.excludedKeywordsChange.bind(this)
    this.reset = this.reset.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.onPost = this.onPost.bind(this)
    this.editPost = this.editPost.bind(this)
    this.validateKeywords = this.validateKeywords.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.validateFile = this.validateFile.bind(this)
    this.previewImages = this.previewImages.bind(this)
    this.previewVideo = this.previewVideo.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.validationCommentCapture = this.validationCommentCapture.bind(this)
  }

  validationCommentCapture () {
    if ((this.state.autoReply !== '') && (this.state.postText !== '' || this.state.attachments.length > 0)) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    if (this.props.currentPost) {
      document.title = `${title} | Edit Facebook Post`
    } else {
      document.title = `${title} | New Facebook Post`
    }
    if (this.props.pages) {
      var selectedPage = this.props.pages[0]

      if (this.props.currentPost) {
        console.log('Current Post', this.props.currentPost)
        for (let i = 0; i < this.props.pages.length; i++) {
          if (this.props.pages[i]._id === this.props.currentPost.pageId) {
            selectedPage = this.props.pages[i]
            break
          }
        }
        if (this.props.currentPost.payload) {
          var payload = this.props.currentPost.payload
          var images = []
          for (let i = 0; i < payload.length; i++) {
            if (payload[i].componentType === 'text') {
              this.setState({
                postText: payload[i].text
              })
            }
            if (payload[i].componentType === 'video') {
              var videoAttachment = []
              videoAttachment.push(payload[i])
              this.setState({
                attachments: videoAttachment,
                videoPost: true
              })
            }
            if (payload[i].componentType === 'image') {
              images.push(payload[i])
            }
          }
          if (images.length > 0) {
            this.setState({
              attachments: images
            })
          }
        }
        this.setState({
          // postText: this.props.currentPost.payload,
          autoReply: this.props.currentPost.reply,
          includedKeywords: this.props.currentPost.includedKeywords.join(),
          excludedKeywords: this.props.currentPost.excludedKeywords.join()
        })
      }
      this.setState({
        selectedPage: selectedPage
      })
    }
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(' componentWillReceiveProps called')
  }
  previewImages () {
    this.setState({
      showImages: true
    })
  }
  previewVideo () {
    this.setState({
      showVideo: true
    })
  }
  removeAttachment (attachment) {
    var id = attachment.id
    var facebookPost = this.state.facebookPost
    var attachments = []
    for (let i = 0; i < this.state.attachments.length; i++) {
      if (this.state.attachments[i].id !== id) {
        attachments.push(this.state.attachments[i])
      }
    }
    for (let i = 0; i < this.state.facebookPost.length; i++) {
      if (this.state.facebookPost[i].id === id) {
        facebookPost.splice(i, 1)
      }
    }
    this.setState({
      attachments: attachments,
      facebookPost: facebookPost
    }, () => {
      this.validationCommentCapture()
    })
  }
  handleUpload (res, fileData) {
    this.setState({
      loading: false
    })
    if (res.status === 'failed') {
      this.setState({
        attachments: []
      })
    }
    if (res.status === 'success') {
      var attachComponent = {componentType: fileData.get('componentType'), id: res.payload.id, url: res.payload.url}
      var attachment = []
      attachment.push(attachComponent)
      var post = []
      if (this.state.postText !== '') {
        post.push({componentType: 'text', text: this.state.postText})
      }
      post.push(attachComponent)
      this.setState({
        attachments: attachment,
        facebookPost: post
      })
      if (fileData.get('componentType') === 'video') {
        this.setState({
          isVideo: true
        })
      }
    }
    this.validationCommentCapture()
  }
  validateKeywords () {
    var errors = false
    if (this.state.includedKeywords !== '' && this.state.excludedKeywords !== '') {
      var errorMessages = this.state.keywordErrors
      var includedKeywords = this.state.includedKeywords.split(',')
      var excludedKeywords = this.state.excludedKeywords.split(',')
      for (let i = 0; i < includedKeywords.length; i++) {
        for (let j = 0; j < excludedKeywords.length; j++) {
          if ((includedKeywords[i].trim()) === (excludedKeywords[j].trim())) {
            errors = true
            var errorMessage = {error: 'keywords', message: 'Keywords cannot be same in both the fields'}
            errorMessages.push(errorMessage)
            this.setState({keywordErrors: errorMessages})
            break
          }
        }
        if (errors) {
          break
        }
      }
    }
    return errors
  }
  editPost () {
    if (this.state.keywordErrors.length > 0) {
      return
    }
    if (this.validateKeywords()) {
      return
    }
    var payload = {
      postId: this.props.currentPost._id,
      includedKeywords: this.state.includedKeywords !== '' ? this.state.includedKeywords.split(',') : [],
      excludedKeywords: this.state.excludedKeywords !== '' ? this.state.excludedKeywords.split(',') : []
    }
    this.props.editFacebookPost(payload, this.msg)
  }
  reset () {
    this.setState({
      postText: '',
      showEmojiPicker: false,
      autoReply: '',
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true,
      attachments: [],
      keywordErrors: []
    })
  }
  validateFile (files, componentType) {
    var errors = false
    var file = files[files.length - 1]
    if (componentType === 'image' && this.state.attachments.length === 5) {
      errors = true
      this.msg.error('Cannot add more than 5 images')
    }
    if (file) {
      if (componentType === 'image' && !(file.type).match('image')) {
        errors = true
        this.msg.error('Choose an image')
      } else if (componentType === 'video' && !(file.type).match('video')) {
        errors = true
        this.msg.error('Choose an image')
      }
    }
    return errors
  }

  onFileChange (e, componentType) {
    console.log('e.target.files', e.target.files, componentType)
    if (!this.validateFile(e.target.files, componentType)) {
      var files = e.target.files
      console.log('file', files)
      console.log('e.target.files', e.target.files)
      var file = e.target.files[files.length - 1]
      if (file) {
        if (file.type === 'text/javascript' || file.type === 'text/exe') {
          this.msg.error('Cannot add js or exe files. Please select another file')
        } else if (file.size > 25000000) {
          this.msg.error('Files greater than 25MB not allowed')
        } else {
          var fileData = new FormData()
          fileData.append('file', file)
          fileData.append('filename', file.name)
          fileData.append('filetype', file.type)
          fileData.append('filesize', file.size)
          fileData.append('pageId', this.props.pages[0]._id)
          fileData.append('componentType', componentType)
          console.log('file', file)
          this.setState({
            loading: true
          })
          this.props.uploadAttachment(fileData, this.handleUpload)
        }
      }
    }
  }
  onFilesError (e) {
    this.msg.error('Error', e.target.value)
  }
  onFacebookPostChange (e) {
    if (((e.target.value && e.target.value !== '') || this.state.attachments.length > 0) && this.state.autoReply !== '') {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }
    var facebookPost = []
    facebookPost.push({componentType: 'text', text: e.target.value})
    if (this.state.attachments.length > 0) {
      for (var i = 0; i < this.state.attachments.length; i++) {
        facebookPost.push(this.state.attachments[i])
      }
    }
    this.setState({
      postText: e.target.value,
      facebookPost: facebookPost
    })
  }
  replyChange (e) {
    if ((e.target.value && e.target.value !== '') && (this.state.postText !== '' || this.state.attachments.length > 0)) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }
    this.setState({
      autoReply: e.target.value
    })
  }
  setEmoji (emoji) {
    this.setState({
      postText: this.state.postText + emoji.native,
      showEmojiPicker: false
    })
  }
  includedKeywordsChange (e) {
    this.setState({
      keywordErrors: [],
      includedKeywords: e.target.value
    })
  }
  excludedKeywordsChange (e) {
    this.setState({
      keywordErrors: [],
      excludedKeywords: e.target.value
    })
  }
  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }
  onPageChange (event) {
    console.log('event', event.target.value)
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i]._id === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectedPage: page
        })
      }
    } else {
      this.setState({
        selectedPage: {}
      })
    }
  }
  onPost () {
    if (this.state.keywordErrors.length > 0) {
      return
    }
    if (this.validateKeywords()) {
      return
    }
    var payload = {
      pageId: this.state.selectedPage._id,
      payload: this.state.facebookPost,
      reply: this.state.autoReply,
      includedKeywords: this.state.includedKeywords !== '' ? this.state.includedKeywords.split(',') : [],
      excludedKeywords: this.state.excludedKeywords !== '' ? this.state.excludedKeywords.split(',') : []
    }
    console.log('facebook post', payload)
    this.props.createFacebookPost(payload, this.msg, this.reset)
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.loading
          ? <ModalContainer>
            <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
              className='align-center'>
              <center><Halogen.RingLoader color='#716aca' /></center>
            </div>
          </ModalContainer>
          : <span />
        }
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '500px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '500px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                { this.state.attachments.length > 0 && this.state.videoPost &&
                  <ReactPlayer
                    url={this.state.attachments[0].url}
                    controls
                    width='100%'
                    height='auto'
                    onPlay={this.onTestURLVideo(this.state.attachments[0].url)}
                  />
                }
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.showImages &&
          <ModalContainer style={{width: '500px', top: '100px'}}
            onClose={() => { this.setState({showImages: false}) }}>
            <ModalDialog style={{width: '500px', top: '100px'}}
              onClose={() => { this.setState({showImages: false}) }}>
              <div>
                {
              this.state.attachments.map((attachment, i) => (
                <div className='col-12'>
                  <div className='ui-block' style={{borderStyle: 'dotted', borderWidth: '2px'}}>
                    <img src={attachment.url} alt='Image' style={{maxWidth: '400px', maxHeight: '200px'}} />
                  </div>
                </div>
              ))
              }
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Comment Capture</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <p className='m-portlet__head-text'>
                        People who comment on your facebook post will receive a message from your bot on messenger
                      </p>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      { this.state.isEdit === 'true'
                    ? <div className='form-group m-form__group' style={{display: 'flex'}}>
                      <div className='col-3'>
                        <label className='col-form-label'>Page</label>
                      </div>
                      <div className='col-9'>
                        <span>{this.state.selectedPage.pageName}</span>
                      </div>
                    </div>
                    : <div className='form-group m-form__group' style={{display: 'flex'}}>
                      <div className='col-3'>
                        <label className='col-form-label'>Choose Page</label>
                      </div>
                      <div className='col-9'>
                        <select className='form-control' value={this.state.selectedPage._id} onChange={this.onPageChange}>
                          {
                            this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                              <option key={page._id} value={page._id} selected={page._id === this.state.selectedPage._id}>{page.pageName}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                      }
                    </div>
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-3'>
                          <label className='col-form-label'>Facebook Post</label>
                        </div>
                        <div className='col-12'>
                          { this.state.isEdit === 'false'
                        ? <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8'}}>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='postTextArea' rows='3'
                            placeholder={this.state.isVideo ? 'Describe your video here' : 'Enter text to post on facebook'}
                            style={{height: '150px', resize: 'none'}}
                            value={this.state.postText}
                            onChange={this.onFacebookPostChange} />
                          {
                              this.state.attachments.length > 0 &&
                              <div className='attachmentDiv' style={{display: 'flex'}}>
                                {
                                this.state.attachments.map((attachment, i) => (
                                  <div className='col-2'>
                                    <span className='fa-stack' style={{cursor: 'pointer', float: 'right', padding: '7px'}} onClick={() => this.removeAttachment(attachment)}><i className='fa fa-times fa-stack-2x' /></span>
                                    <div className='ui-block' style={{borderStyle: 'dotted', borderWidth: '2px'}}>
                                      { attachment.componentType === 'image' && <div className='align-center' style={{height: '60px'}}>
                                        <img src={attachment.url} alt='Image' style={{maxHeight: '40px', maxWidth: '120px'}} />
                                      </div>
                                      }
                                      { attachment.componentType === 'video' && <div className='align-center' style={{height: '60px'}}>
                                        <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: '50px', marginLeft: '15px'}} />
                                      </div>
                                      }
                                    </div>
                                  </div>
                                ))
                                }
                              </div>
                            }
                          <span id='emogiPicker' className='m-input-icon__icon m-input-icon__icon--right'>
                            <span>
                              <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.toggleEmojiPicker} />
                            </span>
                          </span>
                          <span id='uploadImage' className='pull-right' style={{marginRight: '5px', marginTop: '5px'}}>
                            <span>
                              <i className='fa fa-image postIcons' style={{cursor: 'pointer'}} onClick={() => {
                                this.refs.selectImage.click()
                              }} />
                            </span>
                            <input type='file' accept='image/*' onChange={(e) => this.onFileChange(e, 'image')} onClick={(event) => { event.target.value = null }} onError={this.onFilesError}
                              ref='selectImage' style={styles.inputf} />
                          </span>
                          {/* <span id='uploadVideo' className='pull-right' style={{marginRight: '10px', marginTop: '5px'}}>
                            <span>
                              <i className='fa fa-file-video-o postIcons' style={{cursor: 'pointer'}} onClick={() => {
                                this.refs.selectVideo.click()
                              }} />
                            </span>
                            <input type='file' accept='video/*' onChange={(e) => this.onFileChange(e, 'video')} onError={this.onFilesError}
                              ref='selectVideo' style={styles.inputf} />
                          </span>
                          */}
                          <Popover placement='left' isOpen={this.state.showEmojiPicker} className='facebooPostPopover' target='emogiPicker' toggle={this.toggleEmojiPicker}>
                            <PopoverBody>
                              <div>
                                <Picker
                                  emojiSize={24}
                                  perLine={6}
                                  skin={1}
                                  set='facebook'
                                  custom={[]}
                                  autoFocus={false}
                                  showPreview={false}
                                  onClick={(emoji, event) => this.setEmoji(emoji)}
                                />
                              </div>
                            </PopoverBody>
                          </Popover>
                        </div>
                        : <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='postTextArea' rows='3'
                            style={{height: '150px', resize: 'none'}}
                            value={this.state.postText}
                            disabled />
                          { this.state.attachments.length > 0 && this.state.videoPost &&
                            <span id='showVideo' className='pull-right' style={{marginRight: '10px', marginTop: '5px'}}>
                              <span>
                                <i className='fa fa-file-video-o postIcons' style={{cursor: 'pointer'}} onClick={this.previewVideo} />
                              </span>
                            </span>
                          }
                          { this.state.attachments.length > 0 && !this.state.videoPost &&
                            <span id='showImage' className='pull-right' style={{marginRight: '10px', marginTop: '5px'}}>
                              <span>
                                <i className='fa fa-image postIcons' style={{cursor: 'pointer'}} onClick={this.previewImages} />
                              </span>
                            </span>
                          }
                        </div>
                        }
                        </div>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-3'>
                          <label className='col-form-label'>Bot Reply</label>
                        </div>
                        <div className='col-12'>
                          <p>
                            Enter the reply that commentors will receive from your bot
                          </p>
                        </div>
                        { this.state.isEdit === 'false'
                        ? <div className='col-12'>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='replyTextArea' rows='3'
                            placeholder='Enter Reply'
                            style={{height: '100px', resize: 'none'}}
                            value={this.state.autoReply}
                            onChange={this.replyChange} />
                        </div>
                        : <div className='col-12'>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='replyTextArea' rows='3'
                            placeholder='Enter Reply'
                            style={{height: '100px', resize: 'none'}}
                            value={this.state.autoReply}
                            disabled />
                        </div>
                      }
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-3'>
                          <label className='col-form-label'>Target Comments</label>
                        </div>
                        <div className='col-12'>
                          <p>
                            Reply if these keywords are used in the comment. Example 'When, Where, How'
                          </p>
                        </div>
                        <div className='col-12'>
                          <input type='text' className='form-control m-input m-input--square' value={this.state.includedKeywords} onChange={this.includedKeywordsChange} placeholder='Enter Keywords separated by {,}' />
                        </div>
                        <div className='col-12' style={{marginTop: '10px'}}>
                          <p>
                            Donot reply if these keywords are used in the comment. Example 'When, Where, How'
                          </p>
                        </div>
                        <div className='col-12'>
                          <input type='text' className='form-control m-input m-input--square' value={this.state.excludedKeywords} onChange={this.excludedKeywordsChange} placeholder='Enter Keywords separated by {,}' />
                        </div>
                        <span className='m-form__help'>
                          {
                            this.state.keywordErrors.map((m, i) => (
                              m.error === 'keywords' &&
                                <span style={{color: 'red', marginLeft: '20px'}}>{m.message}</span>
                            ))
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  { this.state.isEdit === 'false'
                 ? <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                   <Link style={{marginRight: '10px', marginLeft: '30px'}} className='btn btn-primary' to='/commentCapture'>
                    Back
                   </Link>
                   <button className='btn btn-secondary' onClick={this.reset}>
                    Reset
                   </button>
                   { this.props.pages && this.props.pages.length > 0 && !this.state.disabled
                    ? <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' onClick={this.onPost}>
                      <i className='fa fa-facebook' /> Post on Facebook
                    </button>
                    : <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' disabled>
                      <i className='fa fa-facebook' /> Post on Facebook
                    </button>
                    }
                 </div>
                : <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                  <Link style={{marginRight: '10px', marginLeft: '30px'}} className='btn btn-primary' to='/commentCapture'>
                     Back
                  </Link>
                  <button className='btn btn-primary' onClick={this.editPost}>
                     Save
                  </button>
                </div>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    currentPost: (state.postsInfo.currentPost)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createFacebookPost: createFacebookPost,
    editFacebookPost: editFacebookPost,
    uploadAttachment: uploadAttachment
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookPosts)
