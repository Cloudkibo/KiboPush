/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { Link } from 'react-router'
import { Picker } from 'emoji-mart'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Popover from '../../components/Popover/popover'
import { saveGreetingMessage } from '../../redux/actions/settings.actions'
import ViewScreen from './viewScreen'

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
    props.loadMyPagesList()
  }
  showPreviewDialog () {
    console.log('in showDialog')
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
    console.log('selected name', name)
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
    console.log('Save Message')
    if (this.state.greetingMessage.length > 0) {
      var payload = {pageId: this.state.selectPage.pageId, greetingText: this.state.greetingMessage}
      this.props.saveGreetingMessage(payload, this.msg)
      this.props.loadMyPagesList()
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
    console.log('selected emoji', emoji)
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
    document.title = 'KiboPush | api_settings'
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        selectPage: this.props.pages[0],
        greetingMessage: this.props.pages[0].greetingText,
        textCount: this.props.pages[0].greetingText !== ''? (160 - this.props.pages[0].greetingText.length) : 160
      })
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps.greetingMessage)
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Popover
          style={{paddingBottom: '100px', width: '280px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, position: 'relative'}}
          placement='left'
          height='390px'
          target={this.target}
          show={this.state.showEmojiPicker}
          onHide={this.closeEmojiPicker}
        >
          <div>
            <Picker
              style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
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
          style={{paddingBottom: '100px', width: 'auto', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, position: 'relative', lineHeight: '25px'}}
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
        {
          this.state.showPreview &&
          <ModalContainer style={{top: '100px'}}
            onClose={this.closePreviewDialog}>
            <ModalDialog style={{top: '100px'}}
              onClose={this.closePreviewDialog}>
              <h3>Greeting Message Preview</h3>
              <ViewScreen user={this.props.user} page={this.state.selectPage} previewMessage={this.state.previewMessage} />
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-exclamation m--hide' />
                    Greeting Message
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  {
                    this.props.pages &&
                    this.props.pages.length === 0 &&
                    <div className='alert alert-success'>
                      <h4 className='block'>0 Pages Connected</h4>
                      You have no pages connected. Please connect your facebook pages to invite customers using phone numbers. <Link to='/addPages' >Add Pages</Link>
                    </div>
                  }
                  <div className='form-group m-form__group row'>
                    <label className='col-3 col-form-label' style={{textAlign: 'left'}}>  Change Page</label>
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
                            style={{minHeight: '200px', resize: 'none', maxLength: '160'}}
                            value={this.state.greetingMessage}
                            onChange={this.onGreetingMessageChange} />
                        </div>
                        <div className='m-messenger__form-tools pull-right messengerTools'>
                          <div ref={(c) => { this.target = c }} style={{display: 'inline-block'}} data-tip='emoticons'>
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
                          <div ref={(c) => { this.userOptions = c }} style={{display: 'inline-block'}} data-tip='options'>
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
                          <div style={{display: 'inline-block', margin: '5px'}} data-tip='Text Count'>
                            <span style={{fontWeight: 'bold', color: 'blue'}}>{this.state.textCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group m-form__group row pull-right'>
                    <div className='col-12' style={{marginRight: '35px'}}>
                      <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer', margin: '10px'}} onClick={this.viewGreetingMessage}>See how it looks </Link>
                      <button className='btn btn-primary' onClick={(e) => this.saveGreetingMessage(e)}>Save</button>
                    </div>
                  </div>
                </div>
              </form>
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
    greetingMessage: (state.APIInfo.greetingMessage)
    // changeFailure: (state.APIInfo.changeFailure)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    saveGreetingMessage: saveGreetingMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GreetingMessage)
