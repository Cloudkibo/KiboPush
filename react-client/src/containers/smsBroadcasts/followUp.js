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
import Creatable from 'react-select/creatable'
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
      selectedResponses: null
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
  }

  onKeywordInputChange (inputValue) {
    this.setState({ keywordInputValue: inputValue });
  }
  
  handleSelectBroadcast (selectedBroadcast) {
    this.setState({selectedBroadcast, selectedResponse: null})
    this.props.fetchSmsAnalytics(selectedBroadcast.value)
  }
  handleResponseChange (selectedResponses) {
    this.setState({selectedResponses})
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
        event.preventDefault();
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
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  sendBroadcast () {
    var payload = {
      "responses": this.state.selectedResponses.map((r)=>{ return r.value}),
      "operator": "in",
      "keywords": this.state.keywordValue,
      "message": [{"componentType": "text", "text": this.state.message}],
      "broadcasts": [this.state.selectedBroadcast.value],
      "phoneNumber": this.props.broadcasts.filter((br) => {return br._id === this.state.selectedBroadcast.value})[0].phoneNumber,
      "title": "broadcast"
    }
    this.props.sendFollowupBroadcast(payload, this.msg)
  }
  componentDidMount () {
    if(this.props.broadcasts && this.props.broadcasts.length > 0) {
      let broadcastOptions = this.props.broadcasts.map((broadcast) => { return {label: broadcast.title, value: broadcast._id}})
      this.setState({broadcastOptions})
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
                          Follow-up Broadcast
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                    <button id='send' onClick={this.sendBroadcast} className='btn btn-primary'>
                       Send
                      </button>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='form-group m-form__group'>
                      <div className='col-3'>
                        <label className='col-form-label'>Broadcasts</label>
                      </div>
                      <div className='col-12'>
                        <Creatable
                          styles={
                              {
                                  valueContainer: (base) => ({
                                      ...base,
                                      maxHeight: '15vh',
                                      overflowY: 'scroll'
                                  })
                              }
                          }
                          isClearable={false}
                          options={this.state.broadcastOptions}
                          onChange={this.handleSelectBroadcast}
                          value={this.state.selectedBroadcast}
                          placeholder={'Select Broadcast(s)'}
                        />
                      </div>
                      <div className='col-3'>
                        <label className='col-form-label'>Responses</label>
                      </div>
                      <div className='col-12'>
                        <Creatable
                            styles={
                                {
                                    valueContainer: (base) => ({
                                        ...base,
                                        maxHeight: '15vh',
                                        overflowY: 'scroll'
                                    })
                                }
                            }
                            isMulti
                            isClearable={false}
                            options={this.state.responseOptions}
                            onChange={this.handleResponseChange}
                            value={this.state.selectedResponses}
                            placeholder={'Select Response(s)'}
                          />
                      </div>
                      <div className='col-3'>
                        <label className='col-form-label'>Keywords:</label>
                      </div>
                      <div className='col-12'>
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
                      <div className='col-3'>
                        <label className='col-form-label'>Message</label>
                      </div>
                      <div className='col-12'>
                        <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8'}}>
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
