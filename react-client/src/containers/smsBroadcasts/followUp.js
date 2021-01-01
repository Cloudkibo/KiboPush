/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { searchBroadcastList, sendFollowupBroadcast, fetchResponseDetails, setSearchBroadcastResult, loadBroadcastsList} from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { cloneDeep } from 'lodash'
import BACKBUTTON from '../../components/extras/backButton'

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
      enableSend: false,
      selectLoading: false,
      typingInterval: 1000,
      searchTitle: '',
      broadcastResponses: {},
      selectedPhone: '',
      twilioOptions: null
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
    this.mapResponsesforNotInOperator = this.mapResponsesforNotInOperator.bind(this)
    this.filterBroadcast = this.filterBroadcast.bind(this)
    this.initBroadcastSelect = this.initBroadcastSelect.bind(this)
    this.removeResponses = this.removeResponses.bind(this)
    this.setResponse = this.setResponse.bind(this)
    this.handleResponses = this.handleResponses.bind(this)
    this.handlePhoneNumber = this.handlePhoneNumber.bind(this)
    props.setSearchBroadcastResult(null)
    props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first'}, true)
  }
  handlePhoneNumber (value) {
    this.setState({selectedPhone: value})
    this.validateBroadcast(this.state.title, this.state.message, value.value)
  }
  handleResponses (id, responses) {
    let masterBroadcastList = cloneDeep(this.state.broadcastResponses)
    masterBroadcastList[id] = responses
    let responseOptions = []
    for (const [key ,value] of Object.entries(masterBroadcastList)) {
      if ((key === id) || (this.state.selectedBroadcast && this.state.selectedBroadcast.find(sb => sb.value === key))) {
        let mapResponses = value.map((v) => { return {label: v, value: v}})
        responseOptions = [...responseOptions, ...mapResponses] 
      }
    }
    const uniqueResponses = [...new Set(responseOptions.map(item => item.value))].map((v) => { return {label: v, value: v}})
    this.setState({responseOptions: uniqueResponses , broadcastResponses: masterBroadcastList})
  }

  setResponse (broadcastId) {
    let responseOptions = cloneDeep(this.state.responseOptions)
    for (const [key, value] of Object.entries(this.state.broadcastResponses)) {
      if (key === broadcastId) {
        let mapResponses = value.map((v) => { return {label: v, value: v}})
        responseOptions = [...responseOptions, ...mapResponses] 
      }
    }
    const uniqueResponses = [...new Set(responseOptions.map(item => item.value))].map((v) => { return {label: v, value: v}})
    this.setState({responseOptions: uniqueResponses})
  }

  filterBroadcast({ label, value, data }, string) {
    if (data && !data.searchable) {
      return true
    }
    return true
  }
  removeResponses (broadcastId) {
    let responseOptions = []
    let selectedBroadcast = this.state.selectedBroadcast.filter((br) => {return br.value !== broadcastId})
    let selectedResponseArray = this.state.selectedResponses.map((sr) => { return sr.label})
    let selectedBroadcastResponses = this.state.broadcastResponses[broadcastId]
    let newSelectedResponses =[]

    for (const [key, value] of Object.entries(this.state.broadcastResponses)) {
        if (selectedBroadcast.find(sb => sb.value === key)) {
          let mapResponses = value.map((v) => { return {label: v, value: v}})
          responseOptions = [...responseOptions, ...mapResponses]
        }
    }
    for (let i = 0; i < selectedResponseArray.length; i++) {
      if (!selectedBroadcastResponses.find(sb => sb === selectedResponseArray[i])) {
        newSelectedResponses.push({label: selectedResponseArray[i], value: selectedResponseArray[i]})
      }
    }
    const uniqueResponses = [...new Set(responseOptions.map(item => item.value))].map((v) => { return {label: v, value: v}})
    this.setState({responseOptions: uniqueResponses, selectedResponses: newSelectedResponses})
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
  initBroadcastSelect(selectedItem) {
    this.props.setSearchBroadcastResult(null)
    if(this.props.broadcasts && this.props.broadcasts.length > 0) {
      let broadcastOptions = this.props.broadcasts.map((broadcast) => { return {label: broadcast.title, value: broadcast._id}})
      if (selectedItem && selectedItem.value) {
        let isRecentBroadcast = this.props.broadcasts.filter((b) => { return b._id === selectedItem.value})
        if (isRecentBroadcast.length < 1) {
          broadcastOptions.push({label: selectedItem.label, value: selectedItem.value})
        }
      }
      if (this.props.count && this.props.count > this.props.broadcasts.length && this.props.count > 10) {
        broadcastOptions.push({label: 'See More..', value: 'load_more', searchable: false})
      }
      this.setState({broadcastOptions})
    }
  }

  validateBroadcast (title, message, phoneNumber) {
    if (!this.props.smsBroadcast) {
      if (title !== '' && message !== '' && phoneNumber) {
        this.setState({
          enableSend: true
        })
      } else {
        this.setState({
          enableSend: false
        })
      }
    } else {
      if (title !== '' && message !== '') {
        this.setState({
          enableSend: true
        })
      } else {
        this.setState({
          enableSend: false
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
    this.validateBroadcast(e.target.value, this.state.message, this.state.selectedPhone.value)
  }
  
  handleSelectBroadcast (selectedBroadcast) {
    if (selectedBroadcast && selectedBroadcast.length > 0) {
      if ( !this.state.selectedBroadcast || ( this.state.selectedBroadcast && this.state.selectedBroadcast.length < selectedBroadcast.length)) {
        let selectedItem
        if (this.state.selectedBroadcast) {
          selectedItem = selectedBroadcast.filter(broadcast => !this.state.selectedBroadcast.includes(broadcast))[0]
        } else {
          selectedItem = selectedBroadcast[0]
        }
        if (selectedItem.value === 'load_more') {
          if (this.props.searchBroadcastResult) {
            this.props.searchBroadcastList({
              title: this.state.searchTitle,
              last_id: this.props.searchBroadcastResult && this.props.searchBroadcastResult.length > 0 ?  this.props.searchBroadcastResult[this.props.searchBroadcastResult.length - 1]._id : 'none',
              number_of_records: 10,
              first_page: 'next'
            })
          } else {
            this.props.loadBroadcastsList({
              title: '',
              last_id: this.props.broadcasts && this.props.broadcasts.length > 0 ?  this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none',
              number_of_records: 10,
              first_page: 'next'
            }, true)
          }
        } else {
          if (this.state.selectedBroadcast && this.state.selectedBroadcast.length === 10) {
            this.msg.error('You cannot select more than 10 broadcasts')
            return
          }
          this.setState({selectedBroadcast})
          if (!this.state.broadcastResponses[selectedItem.value]) {
            this.props.fetchResponseDetails(selectedItem.value, null, {"purpose": "unique_responses"}, this.handleResponses)
          } else {
            this.setResponse(selectedItem.value)
          }
          this.initBroadcastSelect(selectedItem)
          this.validateBroadcast(this.state.title, this.state.message, this.state.selectedPhone.value)
        }
      } else {
        this.setState({selectedBroadcast, selectLoading: false})
        let removedItem = this.state.selectedBroadcast.filter((b) => {return !selectedBroadcast.includes(b)})[0]
        this.removeResponses(removedItem.value)
      }
    } else {
      this.setState({selectedBroadcast: [], selectLoading: false, responseOptions: [], selectedResponses: []})
      this.props.setSearchBroadcastResult(null)
    }
  }
  handleResponseChange (selectedResponses) {
    if (this.state.selectedResponses && this.state.selectedResponses.length === 10) {
      this.msg.error('You cannot select more than 10 responses')
      return
    }
    this.setState({selectedResponses})
    this.validateBroadcast(this.state.title, this.state.message, this.state.selectedPhone.value)
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
        if (keywordValue.map((item) => item.value).includes(keywordInputValue.toLowerCase())) {
          this.msg.error('Cannot add the same keyword twice.')
          this.setState({keywordInputValue: ''})
        } else if (this.state.keywordValue.length === 10) {
          this.msg.error('You cannot add more than 10 keywords')
          this.setState({keywordInputValue: ''})
        } else {
          this.setState({
            keywordInputValue: '',
            keywordValue: [...keywordValue, createOption(keywordInputValue)],
          })
        }
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
    this.validateBroadcast(this.state.title, this.state.message + emoji.native, this.state.selectedPhone.value)
  }

  onMessageChange (e) {
    this.setState({message: e.target.value})
    this.validateBroadcast(this.state.title, e.target.value, this.state.selectedPhone.value)
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  sendBroadcast () {
    let payload = {}
    if (this.props.smsBroadcast) {
      payload = {
        "keywords": this.state.keywordValue.map((k) => {return k.value}),
        "message": [{"componentType": "text", "text": this.state.message}],
        "broadcasts": this.props.smsBroadcast ? [this.props.smsBroadcast._id] : [],
        "phoneNumber": this.props.smsBroadcast ? this.props.smsBroadcast.phoneNumber : '',
        "title": this.state.title
      }
   } else {
    payload = {
      "keywords": this.state.keywordValue.map((k) => {return k.value}),
      "message": [{"componentType": "text", "text": this.state.message}],
      "broadcasts": this.state.selectedBroadcast && this.state.selectedBroadcast.length > 0 ? this.state.selectedBroadcast.map((b) => {return b.value}) : [],
      "phoneNumber": this.state.selectedPhone.value,
      "title": this.state.title
    }
   }
   if (this.state.selectedResponses && this.state.selectedResponses.length > 0) {
      var isOthers = this.state.selectedResponses.filter((r)=>{ return r.value.trim().toLowerCase() === 'others'})
      if (isOthers.length > 0) {
        payload["responses"] = this.mapResponsesforNotInOperator()
        payload["operator"] =  "nin"
      } else {
        payload["responses"] = this.state.selectedResponses.map((r)=>{ return r.value})
        payload["operator"] =  "in"
      }
    } else {
      payload["responses"] = []
      payload["operator"] =  "in"
    }
    this.props.sendFollowupBroadcast(payload, this.msg, this.setToDefault)
  }
  mapResponsesforNotInOperator () {
    var includeResponses = []
    for (var i = 0; i < this.state.responseOptions.length ; i++) {
      var includeResponse = true
      for (var j = 0; j < this.state.selectedResponses.length; j++) {
        if (this.state.responseOptions[i].value === this.state.selectedResponses[j].value) {
          includeResponse = false
          break
        }
      }
      if (includeResponse) {
        includeResponses.push(this.state.responseOptions[i].value)
      }
    }
    return includeResponses
   }

  componentDidMount () {
    this.initBroadcastSelect()
    if (this.props.smsAnalytics && this.props.smsAnalytics.responses && this.props.smsAnalytics.responses.length > 0) {
      let responseOptions = this.props.smsAnalytics.responses.map((response) => { return {label: response._id, value: response._id}})
      this.setState({responseOptions})
    }
    if (this.props.twilioNumbers && this.props.twilioNumbers.length > 0) {
      let twilioOptions = this.props.twilioNumbers.map((number) => { return {label: number, value: number}})
      this.setState({twilioOptions})
    }

    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`_select_broadcast`)
    if(input) {
      input.addEventListener('keyup', (e) => {
        clearTimeout(typingTimer)
        typingTimer = setTimeout(() => {
          if (e.target.value && e.target.value !== '') {
            this.setState({
              selectLoading: true,
              searchTitle: e.target.value
            })
            this.props.searchBroadcastList({last_id: 'none', number_of_records: 10, first_page: 'first', title: e.target.value})
          } else {
            this.props.setSearchBroadcastResult(null)
            this.initBroadcastSelect()
            this.setState({
              selectLoading: false
            })
          }
        }, doneTypingInterval)
      })
      input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.searchBroadcastResult) { 
      let broadcastOptions = []
      broadcastOptions = nextProps.searchBroadcastResult.map((broadcast) => { return {label: broadcast.title, value: broadcast._id}})
      if (nextProps.searchCount && nextProps.searchCount > nextProps.searchBroadcastResult.length && nextProps.searchCount > 10) {
        broadcastOptions.push({label: 'See More..', value: 'load_more', searchable: false})
      }
      this.setState({broadcastOptions: broadcastOptions, selectLoading: false})
    }
    if (nextProps.broadcasts && !nextProps.searchBroadcastResult) { 
      let broadcastOptions = []
      broadcastOptions = nextProps.broadcasts.map((broadcast) => { return {label: broadcast.title, value: broadcast._id}})
      if (nextProps.count && nextProps.count > nextProps.broadcasts.length && nextProps.count > 10) {
        broadcastOptions.push({label: 'See More..', value: 'load_more', searchable: false})
      }
      this.setState({broadcastOptions: broadcastOptions, selectLoading: false})
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
                            className='form-control m-input' onChange={this.onTitleChange} maxLength={50} />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                      { !this.props.smsBroadcast &&
                      <div className='row'  style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>PhoneNumber:</label>
                          <div style={{width:'100%'}}>
                            <Select
                                placeholder='Message will be sent from selected phone number'
                                defaultValue={this.state.selectedPhone}
                                name="twilioNumbers"
                                onChange={this.handlePhoneNumber}
                                options={this.state.twilioOptions}
                                className="basic-single-select"
                                classNamePrefix="select"
                                value={this.state.selectedPhone}
                              />
                          </div>
                        </div>
                        <div className='col-2'></div>
                      </div>
                      }
                      { !this.props.smsBroadcast &&
                      <div className='row' style={{marginTop: '20px'}}>
                        <div className='col-2'></div>
                        <div className='col-8' style={{ display:'flex'}}>
                          <label className='col-form-label' style={{width:'140px'}}>Broadcasts:</label>
                          <div style={{width:'100%'}}>
                              <Select
                                id='_select_broadcast'
                                defaultValue={this.state.selectedBroadcast}
                                closeMenuOnSelect={false}
                                isMulti
                                placeholder='All (default)'
                                filterOption={this.filterBroadcast}
                                name="broadcasts"
                                onChange={this.handleSelectBroadcast}
                                options={this.state.broadcastOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={this.state.selectedBroadcast}
                                isLoading={this.state.selectLoading}
                                onBlur={this.initBroadcastSelect}
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
                                placeholder='All (default)'
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
                              id='postTextArea' rows='5'
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
                          <BACKBUTTON
                            onBack={this.goBack}
                          />
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
    count: (state.smsBroadcastsInfo.count),
    searchBroadcastResult: (state.smsBroadcastsInfo.searchBroadcastResult),
    searchCount: (state.smsBroadcastsInfo.searchCount),
    smsBroadcast: (state.smsBroadcastsInfo.smsBroadcast),
    smsAnalytics: (state.smsBroadcastsInfo.smsAnalytics),
    twilioNumbers: (state.smsBroadcastsInfo.twilioNumbers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setSearchBroadcastResult,
    loadBroadcastsList,
    searchBroadcastList,
    sendFollowupBroadcast,
    fetchResponseDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FollowUpBroadcast)
