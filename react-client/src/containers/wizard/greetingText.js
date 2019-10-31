/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { Link, browserHistory } from 'react-router'
import { Picker } from 'emoji-mart'
import Popover from 'react-simple-popover'
import { saveGreetingMessage } from '../../redux/actions/settings.actions'
import ViewScreen from '../settings/viewScreen'
import Header from './header'
import Sidebar from './sidebar'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import {getCurrentProduct} from '../../utility/utils'

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
class GreetingMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    this.state = {
      greetingMessage: '',
      showEmojiPicker: false,
      showUserOptions: false,
      selectPage: {},
      textCount: 160,
      showPreview: false,
      previewMessage: ''
    }
    this.saveGreetingMessage = this.saveGreetingMessage.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.onGreetingMessageChange = this.onGreetingMessageChange.bind(this)
    this.viewGreetingMessage = this.viewGreetingMessage.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.closeEmojiPicker = this.closeEmojiPicker.bind(this)
    this.showUserOptions = this.showUserOptions.bind(this)
    this.closeUserOptions = this.closeUserOptions.bind(this)
    this.getName = this.getName.bind(this)
    this.showPreviewDialog = this.showPreviewDialog.bind(this)
    this.closePreviewDialog = this.closePreviewDialog.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.redirectToInviteSub = this.redirectToInviteSub.bind(this)
    props.loadMyPagesList()
  }
  redirectToInviteSub () {
    browserHistory.push({
      pathname: '/inviteUsingLinkWizard',
      state: 'history'
    })
  }
  showPreviewDialog () {
    var message = this.state.greetingMessage
    var name = this.props.user.facebookInfo.name.split(' ')
    var fullname = this.props.user.facebookInfo.name
    var firstName = name[0] ? name[0] : name
    var lastName = name[1] ? name[1] : name
    message = message.replace(/{{user_first_name}}/g, firstName)
    message = message.replace(/{{user_last_name}}/g, lastName)
    message = message.replace(/{{user_full_name}}/g, fullname)
    this.setState({showPreview: true})
    this.setState({previewMessage: message})
  }

  closePreviewDialog () {
    this.setState({showPreview: false})
  }

  onChangeValue (event) {
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectPage: page,
          greetingMessage: page.greetingText,
          textCount: this.props.pages[0].greetingText !== '' ? (160 - this.props.pages[0].greetingText.length) : 160
        })
      }
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }

  getName (e, name) {
    var message = this.state.greetingMessage + `{{${name}}}`
    var textCount = 160 - message.length
    if (textCount > 0) {
      this.setState({
        textCount: textCount,
        greetingMessage: this.state.greetingMessage + `{{${name}}}`,
        showUserOptions: false
      })
    } else {
      this.setState({showUserOptions: false})
    }
  }
  saveGreetingMessage (e) {
    e.preventDefault()
    if (this.state.greetingMessage.length > 0) {
      var payload = {pageId: this.state.selectPage.pageId, greetingText: this.state.greetingMessage}
      this.props.saveGreetingMessage(payload, this.msg)
      this.props.loadMyPagesList()
    } else {
      this.msg.error('Invitation message cannot be empty')
    }
  }
  onGreetingMessageChange (e) {
    if ((e.target.value).length > 160) {
      return
    }
    var messageLength = (e.target.value).length
    var textCount = 160 - messageLength
    this.setState({textCount: textCount})
    this.setState({greetingMessage: e.target.value})
  }
  viewGreetingMessage (e) {
    this.showPreviewDialog()
  }
  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  closeEmojiPicker () {
    this.setState({showEmojiPicker: false})
  }
  showUserOptions () {
    this.setState({showUserOptions: true})
  }

  closeUserOptions () {
    this.setState({showUserOptions: false})
  }

  setEmoji (emoji) {
    var message = this.state.greetingMessage + emoji.native
    var textCount = 160 - message.length
    if (textCount > 0) {
      this.setState({
        textCount: textCount,
        greetingMessage: this.state.greetingMessage + emoji.native,
        showEmojiPicker: false
      })
    } else {
      this.setState({showEmojiPicker: false})
    }
  }
  componentWillMount () {
  }
  componentDidMount () {
    this.selectPage()
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Greeting Text`
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        selectPage: this.props.pages[0],
        greetingMessage: this.props.pages[0].greetingText,
        textCount: this.props.pages[0].greetingText !== '' ? (160 - this.props.pages[0].greetingText.length) : 160
      })
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.greetingMessage) {
      this.setState({greetingMessage: nextProps.greetingMessage.greetingText})
      for (var i = 0; i < nextProps.pages.length; i++) {
        if (nextProps.pages[i].pageId === nextProps.greetingMessage.pageId) {
          this.setState({ selectPage: nextProps.pages[i] })
        }
      }
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <Header />
        <div id='target'>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <Popover
            style={{paddingBottom: '100px', left: '12px', width: '280px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, position: 'relative', height: '100px'}}
            placement='left'
            height='390px'
            target={this.target}
            show={this.state.showEmojiPicker}
            onHide={this.closeEmojiPicker}
          >
            <div>
              <Picker
                style={{paddingBottom: '100px', marginRight: '12px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                emojiSize={24}
                perLine={7}
                skin={1}
                set='facebook'
                custom={[]}
                autoFocus={false}
                showPreview={false}
                onClick={(emoji, event) => this.setEmoji(emoji)}
              />
            </div>
          </Popover>
          <Popover
            style={{paddingBottom: '100px', left: '18px', paddingRight: '20px', height: '100px', width: 'auto', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, position: 'relative', lineHeight: '25px'}}
            placement='left'
            height='100px'
            target={this.userOptions}
            show={this.state.showUserOptions}
            onHide={this.closeUserOptions}
          >
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_first_name')}>First Name</div>
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_last_name')}>Last Name</div>
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_full_name')}>Full Name</div>
          </Popover>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Greeting Text Preview
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <ViewScreen user={this.props.user} page={this.state.selectPage} previewMessage={this.state.previewMessage} />
                </div>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <div className='m-portlet m-portlet--full-height'>
              <div className='m-portlet__body m-portlet__body--no-padding'>
                <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                  <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                    <Sidebar step='2' user={this.props.user} stepNumber={getCurrentProduct() === 'KiboEngage' ? 5 : 4} />
                    <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                      <div className='m-portlet__head'>
                        <div className='m-portlet__head-caption'>
                          <div className='m-portlet__head-title'>
                            <h3 className='m-portlet__head-text'>
                              Step 2: Greeting Text
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className='m-portlet__body' style={{ height: 'auto' }}>
                        <br />
                        <div className='form-group m-form__group row'>
                          <label style={{ fontWeight: 'normal' }}>This page will help you setup greeting text for your page. We have set the default text for you. Click on "See how it looks" to see how it would be shown on the welcome screen of your Facebook Page. Modify it and create your desired greeting text for your messenger audience.</label>
                        </div>
                        <br />
                        <div className='form-group m-form__group row'>
                          <label className='col-3 col-form-label' style={{ textAlign: 'left' }}>  Change Page</label>
                          <div className='col-8 input-group'>
                            <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                              {
                                this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                  <option key={page.pageId} value={page.pageId} selected={page.pageId === this.state.selectPage.pageId}>{page.pageName}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        <div className='form-group m-form__group row'>
                          <div className='col-3' />
                          <div className='col-8 input-group'>
                            <div className='m-messenger__form'>
                              <div className='m-messenger__form-controls'>
                                <textarea
                                  className='form-control m-input m-input--solid'
                                  id='exampleTextarea' rows='3'
                                  placeholder='Enter Invitation Message'
                                  style={{ minHeight: '200px', resize: 'none', maxLength: '160' }}
                                  value={this.state.greetingMessage}
                                  onChange={this.onGreetingMessageChange} />
                              </div>
                              <div className='m-messenger__form-tools pull-right messengerTools'>
                                <div ref={(c) => { this.target = c }} style={{ display: 'inline-block' }} data-tip='emoticons'>
                                  <i onClick={this.showEmojiPicker} style={styles.iconclass}>
                                    <i style={{
                                      fontSize: '20px',
                                      position: 'absolute',
                                      left: '0',
                                      width: '100%',
                                      height: '2em',
                                      margin: '5px',
                                      textAlign: 'center',
                                      color: '#787878'
                                    }} className='greetingMessage fa fa-smile-o' />
                                  </i>
                                </div>
                                <div ref={(c) => { this.userOptions = c }} style={{ display: 'inline-block' }} data-tip='options'>
                                  <i onClick={this.showUserOptions} style={styles.iconclass}>
                                    <i style={{
                                      fontSize: '20px',
                                      position: 'absolute',
                                      left: '0',
                                      width: '100%',
                                      height: '2em',
                                      margin: '5px',
                                      textAlign: 'center',
                                      color: '#787878'
                                    }} className='greetingMessage fa fa-user' />
                                  </i>
                                </div>
                                <div style={{ display: 'inline-block', margin: '5px' }} data-tip='Text Count'>
                                  <span style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.textCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className='col-9' />
                          <div className='col-3 form-group m-form__group row' style={{ marginLeft: '-45px' }}>
                            <div>
                              <Link className='linkMessageTypes' style={{ color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block' }} data-toggle="modal" data-target="#preview" onClick={this.viewGreetingMessage}>See how it looks </Link>
                              {
                                this.state.greetingMessage.length > 0
                                  ? <button style={{ display: 'inline-block' }} className='btn btn-primary' onClick={(e) => this.saveGreetingMessage(e)}>Save</button>
                                  : <button style={{ display: 'inline-block' }} className='btn btn-primary' disabled>Save</button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div className='col-9' />
                      {/* <div className='col-3 form-group m-form__group row' style={{marginLeft: '-45px'}}>
                             <div>
                              <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block'}} onClick={this.viewGreetingMessage}>See how it looks </Link>
                              <button style={{display: 'inline-block'}} className='btn btn-primary' onClick={(e) => this.saveGreetingMessage(e)}>Save</button>
                            </div>
                          </div> */}
                      <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                        <div className='m-form__actions'>
                          <div className='row'>
                            <div className='col-lg-6 m--align-left' >
                              <Link onClick={() => this.redirectToInviteSub()} className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                <span>
                                  <i className='la la-arrow-left' />
                                  <span>Back</span>&nbsp;&nbsp;
                                </span>
                              </Link>
                            </div>
                            <div className='col-lg-6 m--align-right'>
                              <Link to='/welcomeMessageWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                <span>
                                  <span>Next</span>&nbsp;&nbsp;
                                  <i className='la la-arrow-right' />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
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
  return {
    pages: (state.pagesInfo.pages),
    greetingMessage: (state.settingsInfo.greetingMessage),
    user: (state.basicInfo.user)
    // changeFailure: (state.APIInfo.changeFailure)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    saveGreetingMessage: saveGreetingMessage,
    getuserdetails: getuserdetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GreetingMessage)
