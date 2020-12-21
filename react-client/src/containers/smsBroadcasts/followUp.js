/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList, sendFollowupBroadcast, fetchSmsAnalytics } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

const createOption = (label) => ({
  label,
  value: label.toLowerCase(),
})

const components = {
  DropdownIndicator: null,
};

class FollowUpBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showEmojiPicker: false,
      message: '',
      keywordInputValue: '',
      keywordValue: [],
      broadcastOptions: [],
      selectedBroadcast: null,
      responseOptions: [],
      selectedResponses: null,
      title: '',
      enableSend: false

    }
    this.onMessageChange = this.onMessageChange.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.onKeywordChange = this.onKeywordChange.bind(this)
    this.onKeywordInputChange = this.onKeywordInputChange.bind(this)
    this.onKeywordDown = this.onKeywordDown.bind(this)
    this.handleSelectBroadcast = this.handleSelectBroadcast.bind(this)
    this.handleResponseChange = this.handleResponseChange.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.goBack = this.goBack.bind(this)
    this.validateBroadcast = this.validateBroadcast.bind(this)
    this.setToDefault = this.setToDefault.bind(this)
  }

  setToDefault () {
    this.setState({
      showEmojiPicker: false,
      message: '',
      keywordInputValue: '',
      keywordValue: [],
      selectedBroadcast: null,
      selectedResponses: null,
      title: '',
      enableSend: false
    })
  }

  validateBroadcast (broadcasts, responses, title, message) {
    if (!this.props.smsBroadcast) {
      if (broadcasts && broadcasts.length > 0 && responses && responses.length > 0 && title !== '' && message !== '') {
        this.setState({
          enableSend: true
        })
      }
    } else {
      if (responses && responses.length > 0 && title !== '' && message !== '') {
        this.setState({
          enableSend: true
        })
      }
    }
  }

  onKeywordInputChange (inputValue) {
    this.setState({ keywordInputValue: inputValue });
  }

  goBack () {
    this.props.history.push({
      pathname: `/viewResponses`,
    })
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
    this.validateBroadcast(this.state.selectedBroadcast, this.state.selectedResponses, e.target.value, this.state.message)
  }
  
  handleSelectBroadcast (selectedBroadcast) {
    this.setState({selectedBroadcast, selectedResponse: null})
    this.props.fetchSmsAnalytics(selectedBroadcast.value)
    this.validateBroadcast(selectedBroadcast, this.state.selectedResponses, this.state.title, this.state.message)
  }
  handleResponseChange (selectedResponses) {
    this.setState({selectedResponses})
    this.validateBroadcast(this.state.selectedBroadcast, selectedResponses, this.state.title, this.state.message)
  }
  onKeywordChange(value, actionMeta) {
    if (!value) {
      value = []
    }
    this.setState({ keywordValue: value });
  }

  onKeywordDown (event) {
    const { keywordInputValue, keywordValue } = this.state;
    if (!keywordInputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          keywordInputValue: '',
          keywordValue: [...keywordValue, createOption(keywordInputValue)],
        });
        event.preventDefault()
        break
      default:
    }
  }

  setEmoji (emoji) {
    this.setState({
      message: this.state.message + emoji.native,
      showEmojiPicker: false
    })
  }

  onMessageChange (e) {
    this.setState({message: e.target.value})
    this.validateBroadcast(this.state.selectedBroadcast, this.state.selectedResponses, this.state.title, e.target.value)
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  sendBroadcast () {
    var payload = {
      "keywords": this.state.keywordValue,
      "message": [{"componentType": "text", "text": this.state.message}],
      "broadcasts": this.props.smsBroadcast ? [this.props.smsBroadcast._id] : [],
      "phoneNumber": this.props.smsBroadcast ? this.props.smsBroadcast.phoneNumber : '',
      "title": this.state.title
    }
    var isOthers = this.state.selectedResponses.filter((r)=>{ return r.value.trim().toLowerCase() === 'others'})
    if (isOthers.length > 0) {
      payload["responses"] = this.props.smsAnalytics.responses.filter((res) => {return res._id.trim().toLowerCase() !== 'others' }).map((response) => { return response._id})
      payload["operator"] =  "nin"
    } else {
      payload["responses"] = this.state.selectedResponses.map((r)=>{ return r.value})
      payload["operator"] =  "in"
    }
    this.props.sendFollowupBroadcast(payload, this.msg, this.setToDefault)
  }
  componentDidMount () {
    if(this.props.broadcasts && this.props.broadcasts.length > 0) {
      let broadcastOptions = this.props.broadcasts.map((broadcast) => { return {label: broadcast.title, value: broadcast._id}})
      this.setState({broadcastOptions})
    }
    if (this.props.smsAnalytics && this.props.smsAnalytics.responses && this.props.smsAnalytics.responses.length > 0) {
      let responseOptions = this.props.smsAnalytics.responses.map((response) => { return {label: response._id, value: response._id}})
      this.setState({responseOptions})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.smsAnalytics.responses && nextProps.smsAnalytics.responses.length > 0) {
      let responseOptions = nextProps.smsAnalytics.responses.map((response) => { return {label: response._id, value: response._id}})
      this.setState({responseOptions})
    }
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
      <div style={{minHeight: '85vh', maxHeight: '100vh', marginBottom: '0', overflow: 'inherit'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Follow-up Broadcast { this.props.smsBroadcast ? ` - `+ this.props.smsBroadcast.title : ''}
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                    <button id='send' onClick={this.sendBroadcast} disabled={!this.state.enableSend} className='btn btn-primary'>
                       Send
                      </button>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='form-group m-form__group'>
                      <div className='row'>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Title:</label>
                          <div style={{width:'100%'}}>
                            <input value={this.state.title} placeholder={'Enter the title of the broadcast here...'}
                            className='form-control m-input' onChange={this.onTitleChange} />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                      { !this.props.smsBroadcast &&
                      <div className='row' style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Broadcasts:</label>
                          <div style={{width:'100%'}}>
                              <Select
                                defaultValue={this.state.selectedBroadcast}
                                isMulti
                                name="broadcasts"
                                onChange={this.handleSelectBroadcast}
                                options={this.state.broadcastOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={this.state.selectedBroadcast}
                              />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                    }
                      <div className='row'  style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Responses:</label>
                          <div style={{width:'100%'}}>
                            <Select
                                defaultValue={this.state.selectedResponses}
                                isMulti
                                name="broadcasts"
                                onChange={this.handleResponseChange}
                                options={this.state.responseOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={this.state.selectedResponses}
                              />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                      <div className='row'  style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Keywords:</label>
                          <div style={{width:'100%'}}>
                            <CreatableSelect
                              components={components}
                              inputValue={this.state.keywordInputValue}
                              isClearable
                              isMulti
                              menuIsOpen={false}
                              onChange={this.onKeywordChange}
                              onInputChange={this.onKeywordInputChange}
                              onKeyDown={this.onKeywordDown}
                              placeholder="Type keywords and press enter..."
                              value={this.state.keywordValue} />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                      <div className='row'  style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Message:</label>
                          <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8', width: '100%'}}>
                            <textarea
                              className='form-control m-input'
                              id='postTextArea' rows='3'
                              placeholder='Enter your message here...'
                              value={this.state.message}
                              onChange={this.onMessageChange} />
                            <span id='emogiPicker' className='m-input-icon__icon m-input-icon__icon--right'>
                              <span>
                                <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.toggleEmojiPicker} />
                              </span>
                            </span>
                            <Popover placement='left' isOpen={this.state.showEmojiPicker} target='emogiPicker' toggle={this.toggleEmojiPicker}>
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
                        <div className='col-2'></div>
                      </div>
                      { this.props.smsBroadcast &&
                      <div className='row'>
                          <div className='col-12'>
                              <div className='pull-right'>
                                  <button className='btn btn-primary' style={{marginTop: '10px'}} onClick={this.goBack}>
                                      Back
                                  </button>
                              </div>
                          </div>
                      </div>
                      }
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
    broadcasts: (state.smsBroadcastsInfo.broadcasts),
    smsBroadcast: (state.smsBroadcastsInfo.smsBroadcast),
    count: (state.smsBroadcastsInfo.count),
    smsAnalytics: (state.smsBroadcastsInfo.smsAnalytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    sendFollowupBroadcast,
    fetchSmsAnalytics
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FollowUpBroadcast)
