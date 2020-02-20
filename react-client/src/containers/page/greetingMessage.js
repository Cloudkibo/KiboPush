import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { Picker } from 'emoji-mart'
// import Popover from 'react-simple-popover'
import { Popover, PopoverBody } from 'reactstrap'
import { saveGreetingMessage } from '../../redux/actions/settings.actions'
import ViewScreen from '../settings/viewScreen'
import YouTube from 'react-youtube'
import AlertMessage from '../../components/alertMessages/alertMessage'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'

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
  constructor(props, context) {
    super(props, context)
    this.state = {
      greetingMessage: '',
      showEmojiPicker: false,
      showUserOptions: false,
      selectPage: {},
      textCount: 160,
      previewMessage: '',
      isShowingZeroPageModal: this.props.pages && this.props.pages.length === 0,
      openVideo: false
    }
    this.saveGreetingMessage = this.saveGreetingMessage.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.onGreetingMessageChange = this.onGreetingMessageChange.bind(this)
    this.viewGreetingMessage = this.viewGreetingMessage.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.showUserOptions = this.showUserOptions.bind(this)
    this.getName = this.getName.bind(this)
    this.showPreviewDialog = this.showPreviewDialog.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.toggleUserOptions = this.toggleUserOptions.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
    props.loadMyPagesList()
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoGreetMessage.click()
  }
  showPreviewDialog() {
    var message = this.state.greetingMessage
    var name = this.props.user.facebookInfo.name.split(' ')
    var fullname = this.props.user.facebookInfo.name
    var firstName = name[0] ? name[0] : name
    var lastName = name[1] ? name[1] : name
    message = message.replace(/{{user_first_name}}/g, firstName)
    message = message.replace(/{{user_last_name}}/g, lastName)
    message = message.replace(/{{user_full_name}}/g, fullname)
    this.setState({ previewMessage: message })
    console.log('previewMessage', message)
  }

  onChangeValue(event) {
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

  getName(e, name) {
    var message = this.state.greetingMessage + `{{${name}}}`
    var textCount = 160 - message.length
    if (textCount > 0) {
      this.setState({
        textCount: textCount,
        greetingMessage: this.state.greetingMessage + `{{${name}}}`,
        showUserOptions: false
      })
    } else {
      this.setState({ showUserOptions: false })
    }
  }
  saveGreetingMessage(e) {
    e.preventDefault()
    if (this.state.greetingMessage.length > 0) {
      var payload = { pageId: this.state.selectPage.pageId, greetingText: this.state.greetingMessage }
      this.props.saveGreetingMessage(payload, this.msg)
      this.props.loadMyPagesList()
    }
  }
  onGreetingMessageChange(e) {
    if ((e.target.value).length > 160) {
      return
    }
    var messageLength = (e.target.value).length
    var textCount = 160 - messageLength
    this.setState({ textCount: textCount })
    this.setState({ greetingMessage: e.target.value })
  }
  viewGreetingMessage(e) {
    this.showPreviewDialog()
  }
  showEmojiPicker() {
    this.setState({ showEmojiPicker: true })
  }
  toggleEmojiPicker() {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }
  toggleUserOptions() {
    this.setState({ showUserOptions: !this.state.showUserOptions })
  }
  showUserOptions() {
    this.setState({ showUserOptions: true })
  }

  setEmoji(emoji) {
    var message = this.state.greetingMessage + emoji.native
    var textCount = 160 - message.length
    if (textCount > 0) {
      this.setState({
        textCount: textCount,
        greetingMessage: this.state.greetingMessage + emoji.native,
        showEmojiPicker: false
      })
    } else {
      this.setState({ showEmojiPicker: false })
    }
  }
  UNSAFE_componentWillMount() {
  }
  componentDidMount() {
    this.selectPage()
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Greeting Message`;
  }
  selectPage() {
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
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.greetingMessage) {
      this.setState({ greetingMessage: nextProps.greetingMessage.greetingText })
      for (var i = 0; i < nextProps.pages.length; i++) {
        if (nextProps.pages[i].pageId === nextProps.greetingMessage.pageId) {
          this.setState({ selectPage: nextProps.pages[i] })
        }
      }
    }
    if (nextProps.pages && nextProps.pages.length === 0) {
      this.setState({ isShowingZeroPageModal: true })
      this.refs.zeroModal.click()
    }
  }
  render() {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoGreetMessage' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoGreetMessage">videoGreetMessage</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoGreetMessage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Greeting Text Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" 
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='LEN-grb6Rdc'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              }
              </div>
            </div>
          </div>
        </div>

        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                {this.state.isShowingZeroPageModal &&
                  <AlertMessageModal type='page' />
                }
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Popover placement='left' isOpen={this.state.showEmojiPicker} className='greetingPopover' target='emogiPicker' toggle={this.toggleEmojiPicker}>
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
        <Popover placement='left' isOpen={this.state.showUserOptions} className='greetingPopover' target='userOptions' toggle={this.toggleUserOptions}>
          <PopoverBody>
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_first_name')}>First Name</div>
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_last_name')}>Last Name</div>
            <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_full_name')}>Full Name</div>
          </PopoverBody>
        </Popover>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Greeting Message Preview
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <ViewScreen user={this.props.user} page={this.state.selectPage} previewMessage={this.state.previewMessage} />
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Greeting Text</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0 &&
            <AlertMessage type='page' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding greeting text? Here is the <a href='https://kibopush.com/greeting-text/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__body'>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        {
                          this.props.pages &&
                          this.props.pages.length === 0 &&
                          <AlertMessage type='page' />
                        }
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
                                <div id='emogiPicker' ref={(c) => { this.target = c }} style={{ display: 'inline-block' }} data-tip='emoticons'>
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
                                <div id='userOptions' ref={(c) => { this.userOptions = c }} style={{ display: 'inline-block' }} data-tip='options'>
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
                          <div className='col-7' />
                          <div className='col-5 form-group m-form__group row'>
                            <div style={{ paddingLeft: '140px' }}>
                              <a href='#/' className='linkMessageTypes' style={{ color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block' }} data-toggle="modal" data-target="#preview" onClick={this.viewGreetingMessage}>See how it looks </a>
                              {
                                this.state.greetingMessage.length > 0
                                  ? <button style={{ display: 'inline-block' }} className='btn btn-primary' onClick={(e) => this.saveGreetingMessage(e)}>Save</button>
                                  : <button style={{ display: 'inline-block' }} className='btn btn-primary' disabled>Save</button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
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

function mapStateToProps(state) {
  return {
    pages: (state.pagesInfo.pages),
    greetingMessage: (state.settingsInfo.greetingMessage),
    user: (state.basicInfo.user)
    // changeFailure: (state.settingsInfo.changeFailure)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    saveGreetingMessage: saveGreetingMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GreetingMessage)
