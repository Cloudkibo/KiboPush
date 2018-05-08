/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import {createFacebookPost} from '../../redux/actions/commentCapture.actions'
import AlertContainer from 'react-alert'
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
      facebookPost: '',
      selectedPage: {},
      showEmojiPicker: false,
      autoReply: '',
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true
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
  }

  componentDidMount () {
    document.title = 'KiboPush | New Facebook Post'
    if (this.props.pages) {
      this.setState({selectedPage: this.props.pages[0]})
    }
  }

  componentWillReceiveProps (nextProps) {
  }
  reset () {
    this.setState({
      facebookPost: '',
      showEmojiPicker: false,
      autoReply: '',
      includedKeywords: '',
      excludedKeywords: '',
      disabled: true
    })
  }
  onFileChange (e) {
    var files = e.target.files
    console.log('file', files)
  }
  onFilesError (e) {

  }
  onFacebookPostChange (e) {
    this.setState({
      facebookPost: e.target.value
    })
  }
  replyChange (e) {
    this.setState({
      autoReply: e.target.value
    })
  }
  setEmoji (emoji) {
    this.setState({
      facebookPost: this.state.facebookPost + emoji.native,
      showEmojiPicker: false
    })
  }
  includedKeywordsChange (e) {
    this.setState({
      includedKeywords: e.target.value
    })
  }
  excludedKeywordsChange (e) {
    this.setState({
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
    this.props.createFacebookPost({pageId: this.state.selectedPage._id, payload: this.state.facebookPost, reply: 'reply', includedKeywords: ['hello'], excludedKeywords: ['hi']}, this.msg)
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
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                        </div>
                        <div className='col-12'>
                          <div className='form-group m-form__group'>
                            <div className='col-3'>
                              <label className='col-form-label'>Facebook Post</label>
                            </div>
                            <div className='col-12'>
                              <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
                                <textarea
                                  className='form-control m-input m-input--solid'
                                  id='postTextArea' rows='3'
                                  placeholder='Enter text to post on facebook'
                                  style={{height: '150px', resize: 'none'}}
                                  value={this.state.facebookPost}
                                  onChange={this.onFacebookPostChange} />
                                <span id='emogiPicker' className='m-input-icon__icon m-input-icon__icon--right'>
                                  <span>
                                    <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.toggleEmojiPicker} />
                                  </span>
                                </span>
                                <span id='uploadImage' className='pull-right' style={{marginRight: '5px', marginTop: '5px'}}>
                                  <span>
                                    <i className='fa fa-image' style={{cursor: 'pointer'}} onClick={() => {
                                      this.refs.selectImage.click()
                                    }} />
                                  </span>
                                  <input type='file' accept='image/*' onChange={this.onFileChange} onError={this.onFilesError}
                                    ref='selectImage' style={styles.inputf} />
                                </span>
                                <span id='uploadVideo' className='pull-right' style={{marginRight: '10px', marginTop: '5px'}}>
                                  <span>
                                    <i className='fa fa-file-video-o' style={{cursor: 'pointer'}} onClick={() => {
                                      this.refs.selectVideo.click()
                                    }} />
                                  </span>
                                  <input type='file' accept='image/*' onChange={this.onFileChange} onError={this.onFilesError}
                                    ref='selectVideo' style={styles.inputf} />
                                </span>
                              </div>
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
                            <div className='col-12'>
                              <textarea
                                className='form-control m-input m-input--solid'
                                id='replyTextArea' rows='3'
                                placeholder='Enter Reply'
                                style={{height: '100px', resize: 'none'}}
                                value={this.state.autoReply}
                                onChange={this.replyChange} />
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
                                Reply if these keywords are used in the comment. Example 'When , Where, How'
                              </p>
                            </div>
                            <div className='col-12'>
                              <input type='text' className='form-control m-input m-input--square' value={this.state.includedKeywords} onChange={this.includedKeywordsChange} placeholder='Enter Keywords separated by {,}' />
                            </div>
                            <div className='col-12' style={{marginTop: '10px'}}>
                              <p>
                                Donot reply if these keywords are used in the comment. Example 'When , Where, How'
                              </p>
                            </div>
                            <div className='col-12'>
                              <input type='text' className='form-control m-input m-input--square' value={this.state.excludedKeywords} onChange={this.excludedKeywordsChange} placeholder='Enter Keywords separated by {,}' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit'>
                      <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                        <button style={{marginRight: '10px', marginLeft: '30px'}} className='btn btn-secondary' onClick={this.reset}>
                          Reset
                        </button>
                        <button type='submit' className='btn btn-primary' onClick={this.onPost}>
                          <i className='fa fa-facebook' /> Post on Facebook
                        </button>
                      </div>
                    </div>
                  </div>
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
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createFacebookPost: createFacebookPost
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookPosts)
