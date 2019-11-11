/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import PushMessage from './pushMessage'
import TargetCustomers from './targetCustomers'
import FileSelect from './fileSelect'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { updateCurrentCustomersInfo, setDefaultCustomersInfo, sendPushMessage } from '../../redux/actions/businessGateway.actions'
import { validateFields } from '../convo/utility'
import YouTube from 'react-youtube'

class Home extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isSaveEnabled: false,
      page: this.props.pages ? this.props.pages[0] : null,
      defaultMessage: [{
        id: new Date().getTime(),
        text: `Please subscribe to my page '${this.props.pages[0].pageName}' by typing 'Yes'`,
        componentType: 'text'
      }],
      fileColumns: [],
      updateSegmentation: false,
      segmentationErrors: [],
      showVideo: false
    }
    this.onSave = this.onSave.bind(this)
    this.onTabClick = this.onTabClick.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.setSaveEnable = this.setSaveEnable.bind(this)
    this.updateMessageComponents = this.updateMessageComponents.bind(this)
    this.updateSegmentationConditions = this.updateSegmentationConditions.bind(this)
    this.validateSegmentation = this.validateSegmentation.bind(this)
    this.getCustomersInfoPayload = this.getCustomersInfoPayload.bind(this)
    this.validateInput = this.validateInput.bind(this)
    let defaultPushMessage = this.defaultPushMessage()
    this.props.setDefaultCustomersInfo(defaultPushMessage.pushMesage)
  }
  updateMessageComponents (page) {
    var pushMessage = [{
      id: new Date().getTime(),
      text: `Please subscribe to my page '${page.pageName}' by typing 'Yes'`,
      componentType: 'text'
    }]
    this.setState({
      page: page,
      defaultMessage: pushMessage
    })
  }
  setSaveEnable (customersInfo) {
    var paramsValid = true
    if ((customersInfo.phoneColumn === '') && (customersInfo.subscriberIdColumn === '')) {
      paramsValid = false
    } else if (!customersInfo.page) {
      paramsValid = false
    } else if (!customersInfo.file) {
      paramsValid = false
    } else if (!customersInfo.pushMessage || (customersInfo.pushMessage && customersInfo.pushMessage.length < 1)) {
      paramsValid = false
    }

    this.setState({
      isSaveEnabled: paramsValid
    })
  }
  validateSegmentation () {
    let errors = false
    let errorMessages = []
    let conditionErrors = []
    let conditionError = {}
    let isErrorInCondition = false
    if (this.props.customersInfo.filter.length === 1 && this.props.customersInfo.filter[0].condition === '' && this.props.customersInfo.filter[0].criteria === '' && this.props.customersInfo.filter[0].text === '') {
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', [])
      return !errors
    }
    for (let i = 0; i < this.props.customersInfo.filter.length; i++) {
      if (this.props.customersInfo.filter[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'condition', index: i, message: 'Please choose a valid condition'}
        conditionErrors.push(conditionError)
      }
      if (this.props.customersInfo.filter[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'criteria', index: i, message: 'Please choose a valid criteria'}
        conditionErrors.push(conditionError)
      }
      if (this.props.customersInfo.filter[i].text === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'text', index: i, message: 'Please choose a valid value'}
        conditionErrors.push(conditionError)
      }
    }
    if (isErrorInCondition) {
      errorMessages.push({error: 'conditions', message: conditionErrors})
      this.setState({segmentationErrors: errorMessages})
    }
    return !errors
  }
  updateSegmentationConditions (columns) {
    this.setState({
      fileColumns: columns
    })
  }
  getCustomersInfoPayload () {
    var file = this.props.customersInfo.file
    if (file && file !== '') {
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('page_id', this.props.customersInfo.page._id)
      fileData.append('phoneColumn', this.props.customersInfo.phoneColumn.value)
      fileData.append('subscriberIdColumn', this.props.customersInfo.subscriberIdColumn.value)
      fileData.append('columns', this.props.customersInfo.columns.join(','))
      fileData.append('filter', JSON.stringify(this.props.customersInfo.filter))
      return fileData
    }
  }
  validateInput () {
    var isValidMessage = validateFields(this.props.customersInfo.pushMessage, this.msg)
    if (isValidMessage) {
      var isValidSegmentation = this.validateSegmentation()
      if (isValidSegmentation) {
        this.setState({segmentationErrors: []})
        return true
      } else {
        this.onTabClick('targetCustomers')
        return false
      }
    } else {
      this.onTabClick('pushMessage')
      return false
    }
  }
  onSave () {
    var isValid = this.validateInput()
    if (isValid) {
      this.props.sendPushMessage(this.getCustomersInfoPayload(), this.props.customersInfo.pushMessage, this.msg)
    }
  }
  defaultPushMessage () {
    const defaultMessage = { pushMesage: {
      file: null,
      isSaveEnabled: false,
      columns: [],
      columnsArray: [],
      filter: [],
      page: null,
      phoneColumn: '',
      subscriberIdColumn: '',
      pushMessage: [{
        id: new Date().getTime(),
        text: `Please subscribe to my page '${this.props.pages[0].pageName}' by typing 'Yes'`,
        componentType: 'text'
      }]
    }}
    return defaultMessage
  }

  handleNext (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#selectFile').removeClass('active')
    $('#pushMessage').removeClass('active')
    $('#targetCustomers').removeClass('active')
    if (tab === 'selectFile') {
      $('#tab_2').addClass('active')
      $('#pushMessage').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'targetCustomers')
    } else if (tab === 'pushMessage') {
      $('#tab_3').addClass('active')
      $('#targetCustomers').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'targetCustomers')
    }
  }
  handleBack (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#selectFile').removeClass('active')
    $('#pushMessage').removeClass('active')
    $('#targetCustomers').removeClass('active')
    if (tab === 'pushMessage') {
      $('#tab_1').addClass('active')
      $('#selectFile').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'selectFile')
    } else if (tab === 'targetCustomers') {
      $('#tab_2').addClass('active')
      $('#pushMessage').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'pushMessage')
    }
  }
  onTabClick (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#selectFile').removeClass('active')
    $('#pushMessage').removeClass('active')
    $('#targetCustomers').removeClass('active')
    if (tab === 'selectFile') {
      $('#tab_1').addClass('active')
      $('#selectFile').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'selectFile')
    } else if (tab === 'pushMessage') {
      $('#tab_2').addClass('active')
      $('#pushMessage').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'pushMessage')
    } else if (tab === 'targetCustomers') {
      $('#tab_3').addClass('active')
      $('#targetCustomers').addClass('active')
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'activeTab', 'targetCustomers')
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Dashboard Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <YouTube
                  videoId='lJ67AmaYsTM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                  />
                </div>
              </div>
            </div>
          </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding broadcasts through KiboLite? Here is the <a href='https://kibopush.com/kibolite/' target='_blank' rel='noopener noreferrer'>documentation</a> Or check out this <a href='#' data-toggle="modal" data-target="#video" onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>.
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Broadcast
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled={!this.state.isSaveEnabled} onClick={this.onSave}>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-xl-12'>
                      <ul className='nav nav-tabs'>
                        <li>
                          <a href='#/' id='selectFile' className='broadcastTabs active' onClick={() => { this.onTabClick('selectFile') }}>Select File</a>
                        </li>
                        <li>
                          <a href='#/' id='pushMessage' className='broadcastTabs' onClick={() => { this.onTabClick('pushMessage') }}>Create Push Message</a>
                        </li>
                        <li>
                          <a href='#/' id='targetCustomers' className='broadcastTabs' onClick={() => { this.onTabClick('targetCustomers') }}>Target Customers</a>
                        </li>
                      </ul>
                      <div className='tab-content'>
                        <div className='tab-pane fade active in' id='tab_1'>
                          <FileSelect setSaveEnable={this.setSaveEnable} updateMessageComponents={this.updateMessageComponents} updateSegmentationConditions={this.updateSegmentationConditions} handleNext={this.handleNext} handleBack={this.handleBack} />
                        </div>
                        <div className='tab-pane' id='tab_2'>
                          <PushMessage setSaveEnable={this.setSaveEnable} page={this.state.page} defaultMessage={this.state.defaultMessage} handleNext={this.handleNext} handleBack={this.handleBack} />
                        </div>
                        <div className='tab-pane' id='tab_3'>
                          <TargetCustomers fileColumns={this.state.fileColumns} segmentationErrors={this.state.segmentationErrors} resetErrors={() => { this.setState({segmentationErrors: []}) }} handleNext={this.handleNext} handleBack={this.handleBack} />
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
  console.log('state in tabs', state)
  return {
    pages: state.pagesInfo.pages,
    customersInfo: (state.businessGatewayInfo.customersInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentCustomersInfo: updateCurrentCustomersInfo,
    setDefaultCustomersInfo: setDefaultCustomersInfo,
    sendPushMessage: sendPushMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
