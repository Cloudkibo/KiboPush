/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import { createCommentCapture, editCommentCapture, uploadAttachment, saveCurrentPost } from '../../redux/actions/commentCapture.actions'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { isFacebookPageUrl } from '../../utility/utils'
import LinkCarousel from '../../components/SimplifiedBroadcastUI/LinkCarousel'
import Preview from './preview'
import ViewMessage from '../../components/ViewMessage/viewMessage'

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
    this.linkLimit = 10
    this.state = {
      postText: '',
      isCorrectUrl: true,
      postOriginalText:'',
      attachments: [],
      selectedPage: {},
      showEmojiPicker: false,
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true,
      keywordErrors: [],
      isEdit: this.props.currentPost && this.props.currentPost._id ? 'true' : 'false',
      loading: false,
      facebookPost: [],
      isVideo: false,
      postType: '',
      showSuccessMessage: false,
      postId: '',
      selectedRadio: 'existing',
      postUrl: '',
      title: '',
      titleLengthValid: true,
      secondReplyOption: 'reply',
      sequenceValue: '',
      links:[],
      cards: [],
      isShowingLinkCarousel: false,
      defaultReply: [{
        'id': new Date().getTime(),
        'componentType': 'text',
        'text': 'Hey! Can we help you with something? Respond us here and we will get in touch soon.'
      }]
    }
    props.fetchAllSequence()
    this.onFacebookPostChange = this.onFacebookPostChange.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
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
    this.validationCommentCapture = this.validationCommentCapture.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.handlePostUrlChange = this.handlePostUrlChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.isValidFacebookUrl = this.isValidFacebookUrl.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSecondReplyOption = this.handleSecondReplyOption.bind(this)
    this.openMessageBuilder = this.openMessageBuilder.bind(this)
    this.onSequenceChange = this.onSequenceChange.bind(this)
    this.createPayload = this.createPayload.bind(this)
    this.setCommentCapture = this.setCommentCapture.bind(this)
    this.saveLinks = this.saveLinks.bind(this)
    this.removeLinkCarousel = this.removeLinkCarousel.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  closeModal () {
    this.refs.linkCarousel.click()
    this.setState({
      isShowingLinkCarousel: false
    })
  }

  saveLinks (links, cards) {
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: this.state.title,
      postUrl: this.state.postUrl,
      postText: this.state.postText,
      attachments: this.state.attachments,
      cards: cards
    })
    var cardArray = []
    for (var i = 0; i < cards.length; i++) {
      cardArray.push(cards[i].component)
    }
    this.setState({
      postType: 'links',
      cards: cardArray,
      links: links,
      attachments:[],
      isShowingLinkCarousel: false
    })
    this.refs.linkCarousel.click()
  }
  removeLinkCarousel () {
    this.setState({
      postType: '',
      cards: [],
      links: [],
      attachments:[]
    })
  }
  onSequenceChange (e) {
    this.setState({sequenceValue: e.target.value})
  }
  createPayload () {
    var secondReply = {}
    var payload = {}
    if (this.state.secondReplyOption === 'reply') {
      secondReply['action'] = 'reply'
      secondReply['payload'] = this.props.currentPost && this.props.currentPost.secondReply ? this.props.currentPost.secondReply.payload : []
    }
    if (this.state.secondReplyOption === 'sequence') {
      secondReply['action'] = 'subscribe'
      secondReply['sequenceId'] = this.state.sequenceValue
    }
    var facebookPost = []
    if (this.state.postText !== '') {
      facebookPost.push({componentType: 'text', text: this.state.postText})
    }
    if (this.state.postType === 'links') {
      for (let i = 0; i < this.state.links.length; i++) {
        facebookPost.push({componentType: 'link', url: this.state.links[i].url, card: this.state.cards[i]})
      }
    }
    if (this.state.attachments.length > 0) {
      for (let i = 0; i < this.state.attachments.length; i++) {
        facebookPost.push(this.state.attachments[i])
      }
    }

    payload = {
      pageId: this.state.selectedPage._id,
      postId: this.props.currentPost ? this.props.currentPost._id : null,
      _id:  this.props.currentPost ? this.props.currentPost._id : null,
      payload: this.state.selectedRadio === 'new' ? facebookPost: [],
      post_id: this.props.currentPost ? this.props.currentPost.post_id : '',
      existingPostUrl: this.state.selectedRadio === 'existing' ? this.state.postUrl: '',
      reply: this.props.currentPost && this.props.currentPost.reply ? this.props.currentPost.reply : this.state.defaultReply,
      captureOption: this.state.selectedRadio,
      title : this.state.title,
      includedKeywords: this.state.includedKeywords !== '' ? this.state.includedKeywords.split(',') : [],
      excludedKeywords: this.state.excludedKeywords !== '' ? this.state.excludedKeywords.split(',') : [],
      secondReply: secondReply
    }

    return payload
  }
  openMessageBuilder (openMode) {
    var payload = this.createPayload()
    console.log('Current post', payload)
    this.props.saveCurrentPost(payload)
    this.props.history.push({
      pathname: '/commentCaptureReply',
      state: {mode: openMode}
    })
  }

  isValidFacebookUrl (e) {
    if (e.currentTarget.value !== '' && !isFacebookPageUrl(e.currentTarget.value)) {
      this.setState({
        isCorrectUrl: false
      })
    } else {
      this.setState({
        isCorrectUrl: true
      })
    }
  }
  closeDialogDelete () {
    this.setState({showSuccessMessage: false})
  }
  handleEdit () {
    if (this.props.currentPost.post_id && this.props.currentPost.post_id !== '') {
      this.setState({postId: this.props.currentPost.post_id})
    }
  }
  handleSecondReplyOption (e) {
    this.setState({
      secondReplyOption: e.currentTarget.value,
    })
  }

  handleRadioButton (e) {
    this.validationCommentCapture({
      selectedRadio: e.currentTarget.value,
      title: e.currentTarget.value,
      postUrl: this.state.postUrl,
      postText: this.state.postText,
      attachments: this.state.attachments,
      cards: this.state.cards
    })
    this.setState({
      selectedRadio: e.currentTarget.value,
    })
  }
  handleTitleChange (e) {
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: e.currentTarget.value,
      postUrl: this.state.postUrl,
      postText: this.state.postText,
      attachments: this.state.attachments,
      cards: this.state.cards
    })
    if (e.currentTarget.value.length < 1 || e.currentTarget.value.length > 2) {
      this.setState({titleLengthValid: true})
    }
    this.setState({
      title: e.currentTarget.value
    })
  }
  handlePostUrlChange (e) {
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: this.state.title,
      postUrl:  e.currentTarget.value,
      postText: this.state.postText,
      attachments: this.state.attachments,
      cards: this.state.cards
    })
    if (e.currentTarget.value.length < 1 || (e.currentTarget.value.length > 1 && isFacebookPageUrl(e.currentTarget.value))) {
      this.setState({isCorrectUrl: true})
    }
    this.setState({
      postUrl: e.currentTarget.value
    })
  }
  validationCommentCapture (data) {
    if (data.selectedRadio === 'new') {
      if (data.title !== '' && data.title.length > 2 && (data.postText !== '' || data.attachments.length > 0 || data.cards.length > 0)) {
        this.setState({
          disabled: false
        })
      } else {
        this.setState({
          disabled: true
        })
      }
    } else if(data.selectedRadio === 'existing') {
      if (data.title !== ''&& data.title.length > 2 && data.postUrl !== '' &&  isFacebookPageUrl(data.postUrl)) {
        this.setState({
          disabled: false
        })
      } else {
        this.setState({
          disabled: true
        })
      }
    } else {
      if (data.title !== '' && data.title.length > 2) {
        this.setState({
          disabled: false
        })
      } else {
        this.setState({
          disabled: true
        })
      }
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
      this.setCommentCapture()
    }

  }
  setCommentCapture () {
    var selectedPage = this.props.pages[0]
    if (this.props.currentPost) {
      var disable = false
      console.log('Current Post', this.props.currentPost)
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i]._id === this.props.currentPost.pageId) {
          selectedPage = this.props.pages[i]
          break
        }
      }
      if (this.props.currentPost.payload && this.props.currentPost.payload.length > 0) {
        var payload = this.props.currentPost.payload
        var images = []
        var links = []
        var cards = []
        for (let i = 0; i < payload.length; i++) {
          if (payload[i].componentType === 'text') {
            this.setState({
              postText: payload[i].text,
              postOriginalText: payload[i].text
            })
          }
          if (payload[i].componentType === 'video') {
            var videoAttachment = []
            videoAttachment.push(payload[i])
            this.setState({
              attachments: videoAttachment,
              postType: 'video'
            })
          }
          if (payload[i].componentType === 'image') {
            images.push(payload[i])
          }
          if (payload[i].componentType === 'link') {
            links.push({valid: true, url: payload[i].url, loading: false})
            cards.push(payload[i].card)
          }
        }
        if (images.length > 0) {
          this.setState({
            attachments: images,
            postType: 'images'
          })
        }
        if (links.length > 0 && cards.length > 0) {
          this.setState({
            links: links,
            cards: cards,
            postType: 'links'
          })
        }
        this.setState({ selectedRadio: 'new'})
      } else if ((this.props.currentPost.post_id && this.props.currentPost.post_id !== '') || (this.props.currentPost.existingPostUrl && this.props.currentPost.existingPostUrl !== '')) {
        this.setState({ selectedRadio: 'existing'})
      } else {
        this.setState({ selectedRadio: 'global'})
      }
      if (this.props.currentPost.secondReply && this.props.currentPost.secondReply.action === 'reply') {
        this.setState({ secondReplyOption: 'reply'})
      } else if (this.props.currentPost.secondReply && this.props.currentPost.secondReply.action === 'subscribe') {
        this.setState({ secondReplyOption: 'sequence', sequenceValue: this.props.currentPost.secondReply.sequenceId })
      }
      this.setState({
        // postText: this.props.currentPost.payload,
        autoReply: this.props.currentPost.reply ? this.props.currentPost.reply : [],
        includedKeywords: this.props.currentPost.includedKeywords.join(),
        excludedKeywords: this.props.currentPost.excludedKeywords.join(),
        postUrl: this.props.currentPost.post_id ? `https://facebook.com/${this.props.currentPost.post_id}`: '',
        title: this.props.currentPost.title ? this.props.currentPost.title : ''
      })
      if (this.props.currentPost.post_id && this.props.currentPost.post_id !== '') {
        this.setState({
          postUrl: `https://facebook.com/${this.props.currentPost.post_id}`
        })
      } else if (this.props.currentPost.existingPostUrl && this.props.currentPost.existingPostUrl !== '') {
        this.setState({
          postUrl: this.props.currentPost.existingPostUrl
        })
      } else {
        this.setState({
          postUrl: ''
        })
      }
      if (!this.props.currentPost.reply || this.props.currentPost.reply.length < 1 || !this.props.currentPost.title || this.props.currentPost.title === '' ) {
        disable = true
      }
      this.setState({
        disabled: disable
      })
    }
    this.setState({
      selectedPage: selectedPage
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log(' componentWillReceiveProps called')
  }

  removeAttachment (attachment) {
    var id = attachment.id
   // var facebookPost = this.state.facebookPost
    var attachments = []
    for (let i = 0; i < this.state.attachments.length; i++) {
      if (this.state.attachments[i].id !== id) {
        attachments.push(this.state.attachments[i])
      }
    }
    /*for (let i = 0; i < this.state.facebookPost.length; i++) {
      if (this.state.facebookPost[i].id === id) {
        facebookPost.splice(i, 1)
      }
    }*/
    this.setState({
      attachments: attachments
      //facebookPost: facebookPost
    }, () => {
      this.validationCommentCapture({
        selectedRadio: this.state.selectedRadio,
        title: this.state.title,
        postUrl: this.state.postUrl,
        postText: this.state.postText,
        attachments: attachments,
        cards: this.state.cards
      })
    })
  }
  handleUpload (res, fileData) {
    this.setState({
      loading: false
    })
    if (res.status === 'failed') {
      this.setState({
        attachments: [],
      })
    }
    if (res.status === 'success') {
      var attachComponent = {componentType: fileData.get('componentType'), id: res.payload.id, url: res.payload.url}
      var attachments = this.state.attachments
      if (fileData.get('componentType') === 'video') {
        this.setState({
          postType: 'video',
          cards: [],
          links: []
        })
        attachments = []
      } else if (fileData.get('componentType') === 'image'){
        if (this.state.postType === 'video') {
          attachments = []
        }
        this.setState({
          postType: 'images',
          cards: [],
          links: []
        })
      }
      attachments.push(attachComponent)
      // var post = []
      /*if (this.state.postText !== '') {
        post.push({componentType: 'text', text: this.state.postText})
      }
      post.push(attachComponent)*/
      this.setState({
        attachments: attachments
      })
    }
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: this.state.title,
      postUrl: this.state.postUrl,
      postText: this.state.postText,
      attachments: attachments,
      cards: this.state.cards
    })
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
    var payload = this.createPayload()
    if(this.state.selectedRadio === 'new' && this.state.postText !== this.state.postOriginalText){
      payload.postText = this.state.postText
      payload.pageAccessToken = this.props.currentPost.pageId.accessToken
    }
    this.props.editCommentCapture(payload, this.msg, this.handleEdit)
  }

  reset (postId, showSuccessMessage) {
    this.setState({
      postText: '',
      showEmojiPicker: false,
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true,
      attachments: [],
      keywordErrors: [],
      postId: postId || '',
      showSuccessMessage: showSuccessMessage || false,
      postUrl: '',
      selectedRadio: 'existing',
      title: '',
      isCorrectUrl: true,
      titleLengthValid: true,
      cards: [],
      links: [],
      postType: ''
    })
    this.props.saveCurrentPost(null)
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
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: this.state.title,
      postUrl: this.state.postUrl,
      postText:  e.target.value,
      attachments: this.state.attachments,
      cards: this.state.cards
    })
    this.setState({
      postText: e.target.value
     // facebookPost: facebookPost
    })
  }

  setEmoji (emoji) {
    this.validationCommentCapture({
      selectedRadio: this.state.selectedRadio,
      title: this.state.title,
      autoReply: this.props.currentPost && this.props.currentPost.reply ? this.props.currentPost.reply : [],
      postUrl: this.state.postUrl,
      postText: this.state.postText + emoji.native,
      attachments: this.state.attachments,
      cards: this.state.cards
    })
    /*var facebookPost = []
    facebookPost.push({componentType: 'text', text: this.state.postText + emoji.native})
    if (this.state.attachments.length > 0) {
      for (var i = 0; i < this.state.attachments.length; i++) {
        facebookPost.push(this.state.attachments[i])
      }
    } */
    this.setState({
      postText: this.state.postText + emoji.native,
      //facebookPost: facebookPost,
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
    var payload = this.createPayload()
    console.log('facebook post', payload)
    this.props.createCommentCapture(payload, this.msg, this.reset)
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
                      <div className='form-group m-form__group' style={{display: 'flex'}}>
                        <div className='col-3'>
                          <label className='col-form-label'>Title</label>
                        </div>
                        <div className='col-9 form-group m-form__group has-danger'>
                          <input
                              className='form-control form-control-danger m-input'
                              style={{borderColor: this.state.title === '' ? 'red' : '' }}
                              id='title'
                              value={this.state.title}
                              onChange={(e) => {this.handleTitleChange(e)}} onBlur={(e)=> {
                                if (e.currentTarget.value.length > 0 && e.currentTarget.value.length < 3) {
                                  this.setState({
                                    titleLengthValid: false
                                  })
                                } else {
                                  this.setState({
                                    titleLengthValid: true
                                  })
                                }
                              }} maxLength='25'/>
                            { !this.state.titleLengthValid &&
                            <label htmlFor='title' className='form-control-label'>Title should be atleast 3 characters long</label>
                            }
                            {
                              this.state.title === '' &&
                              <label htmlFor='title' className='form-control-label'>*Required</label>
                            }
                          </div>
                      </div>
                    </div>
                  </div>
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
                        <label className='col-form-label'>Choose your Facebook Page</label>
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
                        <div className='col-12'>
                          <label className='col-form-label'>Track Comments Under</label>
                        </div>
                        { this.state.isEdit === 'false'
                        ? <div className='row' style={{marginLeft: '10px'}}>
                          <div className='col-3'>
                            <input id='global'
                              type='radio'
                              value='global'
                              name='global'
                              onChange={this.handleRadioButton}
                              checked={this.state.selectedRadio === 'global'} />
                            <span style={{marginLeft: '10px'}}>Any Post</span>
                          </div>
                          <div className='col-3'>
                            <input id='existing'
                              type='radio'
                              value='existing'
                              name='existing'
                              onChange={this.handleRadioButton}
                              checked={this.state.selectedRadio === 'existing'} />
                            <span style={{marginLeft: '10px'}}>Link Existing Post</span>
                          </div>
                          <div className='col-3'>
                            <input id='new'
                              type='radio'
                              value='new'
                              name='new'
                              onChange={this.handleRadioButton}
                              checked={this.state.selectedRadio === 'new'} />
                            <span style={{marginLeft: '10px'}}>Create New Post</span>
                          </div>
                        </div>
                        : <div className='row' style={{marginLeft: '10px'}}>
                        <div className='col-3'>
                          <input id='global'
                            type='radio'
                            value='global'
                            name='global'
                            disabled
                            checked={this.state.selectedRadio === 'global'} />
                          <span style={{marginLeft: '10px'}}>Any Post</span>
                        </div>
                        <div className='col-3'>
                          <input id='existing'
                            type='radio'
                            value='existing'
                            name='existing'
                            disabled
                            checked={this.state.selectedRadio === 'existing'} />
                          <span style={{marginLeft: '10px'}}>Link Existing Post</span>
                        </div>
                        <div className='col-3'>
                          <input id='new'
                            type='radio'
                            value='new'
                            name='new'
                            disabled
                            checked={this.state.selectedRadio === 'new'} />
                          <span style={{marginLeft: '10px'}}>Create New Post</span>
                        </div>
                      </div>
                      }
                      </div>
                    </div>
                    <br />
                    { this.state.selectedRadio === 'new' &&
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-6'>
                          <label className='col-form-label'>Create a Facebook Post that will be published on your page</label>
                        </div>
                        <div className='col-12'>
                          { this.state.isEdit === 'false'
                        ? <div style={{ border: '2px solid lightgray', borderRadius: '15px', padding: '10px'}}>
                            <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8'}}>
                              <textarea
                                className='form-control m-input m-input--solid'
                                id='postTextArea' rows='3'
                                placeholder={this.state.isVideo ? 'Describe your video here' : 'Please write your Facebook Post here that will be posted on your Facebook page...'}
                                style={{height: '150px', resize: 'none', borderColor: (this.state.postText !== '' ||  this.state.attachments.length !==0 || this.state.cards.length !==0) ? '' : 'red' }} 
                                value={this.state.postText}
                                onChange={this.onFacebookPostChange} />
                              {
                                  this.state.attachments.length > 0 && this.state.postType !== 'links' &&
                                  <div className='attachmentDiv' style={{display: 'flex'}}>
                                    {
                                    this.state.attachments.map((attachment, i) => (
                                      <div className='col-2'>
                                        <span className='fa-stack' style={{cursor: 'pointer', marginLeft: '90px', height: '0.5em'}} onClick={() => this.removeAttachment(attachment)}><i className='fa fa-times fa-stack-2x' /></span>
                                        <div className='ui-block' style={{borderStyle: 'dotted', borderWidth: '2px', marginBottom: '10px', paddingTop: '0px'}}>
                                          { attachment.componentType === 'image' && <div className='align-center' style={{height: '60px'}}>
                                            <img src={attachment.url} alt='' style={{objectFit: 'cover', height: '100%', width: '100%'}} />
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
                              {
                                  this.state.cards.length > 0 &&  this.state.postType === 'links' &&
                                  <div className='attachmentDiv' style={{display: 'flex'}}>
                                    {
                                    this.state.cards.map((card, i) => (
                                      <div className='col-2' style={{border:'1px dashed', padding:'2px', textAlign: 'center'}}>
                                          { card.image_url &&
                                            <img src={card.image_url} alt='' style={{maxHeight: '40px', maxWidth: '120px'}} />
                                          }
                                          <hr style={{marginTop: card.image_url ? '' : '100px', marginBottom: '2px'}} />
                                          <span style={{fontSize: '8px'}}>{card.title}</span>
                                      </div>
                                    ))
                                    }
                                  </div>
                              }
                              { this.state.cards.length > 0 &&  this.state.postType === 'links' &&
                                <span className='pull-right' style={{marginTop: '-80px', marginRight: '10px'}}>
                                  <span onClick={() => this.removeLinkCarousel()} style={{marginTop: '10px', cursor: 'pointer'}}><span role='img' aria-label='times'>❌</span></span>
                                </span>
                              }
                              { (this.state.attachments.length > 0 ||  this.state.links.length > 0) &&
                              <span className='pull-right' style={{marginTop: '-30px', marginRight: '10px'}}>
                                <span style={{color:'blue', textDecoration: 'underline', cursor:'pointer'}} onClick={() => {this.refs.previewModal.click()}}>See How It Looks?</span>
                              </span>
                              }
                              <span id='emogiPicker' style={{height: '150px'}} className='m-input-icon__icon m-input-icon__icon--right'>
                                <span>
                                  <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.toggleEmojiPicker} />
                                </span>
                              </span>
                              <span id='uploadImage' className='pull-right' style={{marginRight: '5px', marginTop: '5px'}}>
                                <input type='file' accept='image/*' onChange={(e) => this.onFileChange(e, 'image')} onClick={(event) => { event.target.value = null }} onError={this.onFilesError}
                                  ref='selectImage' style={styles.inputf} />
                                <input type='file' accept='video/*' onChange={(e) => this.onFileChange(e, 'video')} onError={this.onFilesError}
                                  ref='selectVideo' style={styles.inputf} />
                              </span>
                            {/* <span id='uploadVideo' className='pull-right' style={{marginRight: '10px', marginTop: '5px'}}>
                              <span>
                                <i className='fa fa-file-video-o postIcons' style={{cursor: 'pointer'}} onClick={() => {
                                  this.refs.selectVideo.click()
                                }} />
                              </span>
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
                          <div className='col-12' style={{display: 'flex'}} id='postOptions'>
                            <div className='col-4'>
                              <button type='button' style={{width: '100%'}} onClick={() => {
                                this.refs.selectImage.click()}} className='btn m-btn--pill m-btn--air btn-outline-primary'>
                                <i className='fa fa-image' style={{cursor: 'pointer'}}/> Upload Photos
                              </button>
                            </div>
                            <div className='col-4'>
                              <button type='button' style={{width: '100%'}} onClick={() => {
                                this.refs.selectVideo.click()}} className='btn m-btn--pill m-btn--air btn-outline-primary'>
                                <i className='fa fa-file-video-o' style={{cursor: 'pointer'}}/> Upload Video
                              </button>
                            </div>
                            <div className='col-4'>
                              <button type='button' style={{width: '100%'}} onClick={() => {
                                this.setState({
                                  isShowingLinkCarousel: true
                                })
                                this.refs.linkCarousel.click()}}className='btn m-btn--pill m-btn--air btn-outline-primary'>
                                <i className='fa fa-link' style={{cursor: 'pointer'}}/>  { this.state.cards.length < 1 ? 'Create Link Carousel' : 'Edit Link Carousel' }
                              </button>
                            </div>
                          </div>
                        </div>
                        : <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='postTextArea' rows='3'
                            style={{height: '150px', resize: 'none'}}
                            value={this.state.postText}
                            disabled
                             />
                            {
                              this.state.attachments.length > 0 && this.state.postType !== 'links' &&
                              <div className='attachmentDiv' style={{display: 'flex'}}>
                                {
                                this.state.attachments.map((attachment, i) => (
                                  <div className='col-2'>
                                    <div className='ui-block' style={{borderStyle: 'dotted', borderWidth: '2px'}}>
                                      { attachment.componentType === 'image' && <div className='align-center' style={{height: '60px'}}>
                                        <img src={attachment.url} alt='' style={{maxHeight: '40px', maxWidth: '120px'}} />
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
                            {
                              this.state.cards.length > 0 &&  this.state.postType === 'links' &&
                              <div className='attachmentDiv' style={{display: 'flex'}}>
                                {
                                this.state.cards.map((card, i) => (
                                  <div className='col-2' style={{border:'1px dashed', padding:'2px', textAlign: 'center'}}>
                                      { card.image_url &&
                                        <img src={card.image_url} alt='' style={{maxHeight: '40px', maxWidth: '120px'}} />
                                      }
                                      <hr style={{marginTop: card.image_url ? '' : '100px', marginBottom: '2px'}} />
                                      <span style={{fontSize: '8px'}}>{card.title}</span>
                                  </div>
                                ))
                                }
                              </div>
                            }
                            <span className='pull-right' style={{marginTop: '-30px', marginRight: '10px'}}>
                              <span style={{color:'blue', textDecoration: 'underline', cursor:'pointer'}} onClick={() => {this.refs.previewModal.click()}}>See How It Looks?</span>
                            </span>

                        </div>
                        }
                        </div>
                      </div>
                    </div>
                    }
                    {this.state.selectedRadio === 'existing' &&
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-12'>
                          <label className='col-form-label'>Post Url</label>
                        </div>
                        <div className='col-12'>
                          <p>
                            Copy paste the Post Url here. View <a href='https://kibopush.com/comment-capture/' target='_blank' rel='noopener noreferrer'>user guide</a> to know how to copy correct post url
                          </p>
                        </div>
                        { this.state.isEdit === 'false'
                        ? <div className='col-12 form-group m-form__group has-danger'>
                          <input
                            className='form-control form-control-danger m-input'
                            style={{borderColor: this.state.postUrl === '' ? 'red' : ''}}
                            id='postUrl'
                            value={this.state.postUrl}
                            onChange={(e) => {this.handlePostUrlChange(e)}}
                            onBlur={(e) => {this.isValidFacebookUrl(e)}}/>
                          { !this.state.isCorrectUrl &&
                            <label className='form-control-label' htmlFor='postUrl'>Invalid Facebook Post Url</label>
                          }
                          { !this.state.isCorrectUrl &&
                            <label className='form-control-label' htmlFor='postUrl'>Invalid Facebook Post Url</label>
                          }
                          { !this.state.postUrl &&
                            <label className='form-control-label' htmlFor='postUrl'>*Required</label>
                          }

                        </div>
                        : <div className='col-12 form-group m-form__group '>
                           <input
                            className='form-control form-control-danger m-input'
                            id='postUrl'
                            value={this.state.postUrl}
                            disabled />
                        </div>
                        }
                      </div>
                    </div>
                    }
                    { this.state.loading && 
                    <div className='col-12'>
                      <span style={{color:'blue', marginLeft: '15px'}}>Uploading File...</span>
                    </div>
                    } 
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-3'>
                          <label className='col-form-label'>Bot Configuration</label>
                        </div>
                          <div className='col-12'>
                            <p>
                            Create a reply that will be sent to people who comment on your Facebook Page Post
                            </p>
                            {
                              this.props.currentPost && this.props.currentPost.reply && this.props.currentPost.reply.length > 0
                              ? <button style={{marginRight: '10px'}} className='btn btn-secondary' onClick={() => {this.openMessageBuilder('reply')}}>
                                Edit Reply
                              </button>
                              :<button style={{marginRight: '10px'}} className='btn btn-secondary' onClick={() => {this.openMessageBuilder('reply')}}>
                                Edit Default Reply
                              </button>
                            }
                        </div>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='form-group m-form__group'>
                        <div className='col-3'>
                          <label className='col-form-label'>Second Reply</label>
                        </div>
                        <div className='col-12'>
                          <p>
                            Second reply will be sent after response to first message
                          </p>
                        </div>
                        <div className='row' style={{marginLeft: '10px'}}>
                          <div className='col-3'>
                            <input id='reply'
                              type='radio'
                              value='reply'
                              name='reply'
                              onChange={this.handleSecondReplyOption}
                              checked={this.state.secondReplyOption === 'reply'} />
                            <span style={{marginLeft: '10px'}}>Create Reply</span>
                          </div>
                          <div className='col-3'>
                            <input id='sequence'
                              type='radio'
                              value='sequence'
                              name='sequence'
                              onChange={this.handleSecondReplyOption}
                              checked={this.state.secondReplyOption === 'sequence'} />
                            <span style={{marginLeft: '10px'}}>Assign a Sequence</span>
                          </div>
                        </div>
                        <div>
                        <div className='row' style={{marginLeft: '10px', marginTop: '10px'}}>
                          <div className='col-12'>
                            {
                              this.state.secondReplyOption === 'reply' &&
                            <button style={{marginRight: '10px'}} className='btn btn-secondary' onClick={() => {this.openMessageBuilder('secondReply')}}>
                              Show Message Builder
                            </button >
                            }
                            {
                               this.state.secondReplyOption === 'sequence' &&
                            <div className='row'>
                              <div className='col-2' style={{marginTop: '10px'}}>
                                <span>Select Sequence</span>
                              </div>
                              <div className='col-6'>
                                <select className='form-control m-input m-input--square' value={this.state.sequenceValue} onChange={this.onSequenceChange}>
                                  <option key='' value='' disabled>Select Sequence...</option>
                                  {
                                    this.props.sequences.map((seq, i) => (
                                      seq.sequence.trigger.event === 'subscribes_to_sequence'
                                      ? <option key={i} value={seq.sequence._id}>{seq.sequence.name}</option> : ''
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                            }
                          </div>
                        </div>
                        </div>
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
                            Do not reply if these keywords are used in the comment. Example 'When, Where, How'
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
                   { this.state.selectedRadio === 'new' &&
                   <span>
                   { this.props.pages && this.props.pages.length > 0 && !this.state.disabled
                    ? <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' onClick={this.onPost}>
                      <i className='fa fa-facebook' /> Post on Facebook
                    </button>
                    : <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' disabled>
                      <i className='fa fa-facebook' /> Post on Facebook
                    </button>
                    }
                    </span>
                    }
                    { this.state.selectedRadio !== 'new' &&
                   <span>
                   { this.props.pages && this.props.pages.length > 0 && !this.state.disabled
                    ? <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' onClick={this.onPost}>
                      Save
                    </button>
                    : <button type='submit' style={{marginRight: '10px'}} className='btn btn-primary pull-right' disabled>
                      Save
                    </button>
                    }
                    </span>
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
          <a href='#/' style={{ display: 'none' }} ref='viewMessageModal' data-toggle="modal" data-target="#viewMessageModal">viewMessageModal</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="viewMessageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content" style={{width: '450px'}}>
                <div style={{ display: 'block' }} className="modal-header">
                    <h5 className='modal-title' id='exampleModalLabel'>
                      Reply Message
                    </h5>
                    <button style={{opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                      <span aria-hidden='true'>
                        &times;
                      </span>
                    </button>
                </div>
                <div style={{ maxHeight: '600px', overflowX: 'hidden', overflowY: 'scroll' }} className='m-scrollable modal-body' data-scrollbar-shown='true' data-scrollable='true' data-max-height='200'>
                  <ViewMessage payload={this.props.currentPost && this.props.currentPost.reply ? this.props.currentPost.reply : []} />
                </div>
              </div>
            </div>
          </div>
          <a href='#/' style={{ display: 'none' }} ref='previewModal' data-toggle="modal" data-target="#previewModal">previewModal</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="previewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content" style={{width: '500px'}}>
                <div style={{ display: 'block' }} className="modal-header">
                    <h5 className='modal-title' id='exampleModalLabel'>
                      Preview Post
                    </h5>
                    <button style={{opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                      <span aria-hidden='true'>
                        &times;
                      </span>
                    </button>
                </div>
                <div style={{ maxHeight: '500px', overflowX: 'hidden', overflowY: 'scroll' }} className='m-scrollable modal-body' data-scrollbar-shown='true' data-scrollable='true' data-max-height='200'>
                  <Preview
                  selectedPage={this.state.selectedPage}
                  postType={this.state.postType}
                  attachments={this.state.attachments}
                  cards={this.state.cards}
                  postText={this.state.postText}
                  edited={false}
                  />
                  </div>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='linkCarousel' data-toggle="modal" data-target="#linkCarousel">Link Carousel Modal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="linkCarousel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className="modal-dialog modal-lg" role="document">
            {this.state.isShowingLinkCarousel && <LinkCarousel
              pages={[this.state.selectedPage._id]}
              module='commentcapture'
              edited={false}
              links={this.state.links}
              cards={this.state.cards}
              saveLinks={this.saveLinks} 
              closeModal= {this.closeModal} 
              hideWebUrl={true}
              showCloseModalAlertDialog={this.closeModal}/>}
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
    currentPost: (state.postsInfo.currentPost),
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createCommentCapture: createCommentCapture,
    editCommentCapture: editCommentCapture,
    uploadAttachment: uploadAttachment,
    saveCurrentPost: saveCurrentPost,
    fetchAllSequence: fetchAllSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookPosts)
