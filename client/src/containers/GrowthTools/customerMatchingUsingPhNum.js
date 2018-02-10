import React from 'react'
import Files from 'react-files'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { bindActionCreators } from 'redux'
import Halogen from 'halogen'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { saveFileForPhoneNumbers, downloadSampleFile, sendPhoneNumbers, clearAlertMessage, getPendingSubscriptions} from '../../redux/actions/growthTools.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import {
  loadCustomerLists, saveCurrentList
} from '../../redux/actions/customerLists.actions'

class CustomerMatching extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      textAreaValue: '',
      fileErrors: [],
      messageErrors: [],
      alertMessage: '',
      type: '',
      disabled: true,
      selectPage: {},
      fblink: '',
      manually: false,
      phoneNumbers: [],
      numbersError: [],
      loading: false,
      initialList: '',
      nonSubscribersList: ''
    }

    this.onTextChange = this.onTextChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validate = this.validate.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.clickAlert = this.clickAlert.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.getSampleFile = this.getSampleFile.bind(this)
    this.enterPhoneNoManually = this.enterPhoneNoManually.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.onPhoneNumbersChange = this.onPhoneNumbersChange.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.saveList = this.saveList.bind(this)
    this.props.clearAlertMessage()
    this.props.loadCustomerLists()
    this.props.getPendingSubscriptions()
  }
  getSampleFile () {
    this.props.downloadSampleFile()
  }
  saveList (list) {
    browserHistory.push({
      pathname: `/listDetails`,
      state: {module: 'customerMatching'}
    })
    this.props.saveCurrentList(list)
  }
  enterPhoneNoManually () {
    this.setState({manually: true})
  }

  removeFile () {
    this.setState({file: ''})
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
          textAreaValue: `Please subscribe to my page *${page.pageName}* by typing Yes`,
          selectPage: page
        })
      }
    } else {
      this.setState({
        textAreaValue: '',
        selectPage: {}
      })
    }
  }

  clickAlert (e) {
    e.preventDefault()
    this.setState({
      file: '',
      fileErrors: [],
      messageErrors: [],
      alertMessage: '',
      type: '',
      disabled: true,
      loading: false,
      manually: false,
      phoneNumbers: [],
      numbersError: []
    })
    this.props.clearAlertMessage()
    this.selectPage()
  }

  onFilesChange (files) {
    if (files.length > 0) {
      let fileSelected = files[0]
      if (fileSelected.extension !== 'csv') {
        this.setState({
          fileErrors: [{errorMsg: 'Please select a file with .csv extension'}]
        })
        return
      }
      this.setState({
        file: files,
        fileErrors: [],
        disabled: false
      })
      console.log(this.state.file[0])
    }
  }

  onFilesError (error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
    this.setState({
      fileErrors: [{errorMsg: error.message}]
    })
  }

  /* global FormData */
  handleSubmit () {
    var file = this.state.file
    if (file && file !== '') {
      var fileData = new FormData()
      fileData.append('file', file[0])
      fileData.append('filename', file[0].name)
      fileData.append('filetype', file[0].type)
      fileData.append('filesize', file[0].size)
      fileData.append('text', this.state.textAreaValue)
      fileData.append('pageId', this.state.selectPage.pageId)

      if (this.validate('file')) {
        this.setState({
          loading: true,
          disabled: true
        })
        this.props.saveFileForPhoneNumbers(fileData, this.handleResponse)
      }
    } else if (this.inputPhoneNumbers.value !== '') {
      if (this.validate('numbers')) {
        this.props.sendPhoneNumbers({numbers: this.state.phoneNumbers, text: this.state.textAreaValue, pageId: this.state.selectPage.pageId})
      }
    }
  }
  handleResponse () {
    this.setState({
      loading: false
    })
  }

  onPhoneNumbersChange (e) {
    console.log('onPhoneNumbersChange')
    this.setState({phoneNumbers: this.inputPhoneNumbers.value.split(';')})
    if (this.state.textAreaValue !== '' && ((this.state.file && this.state.file !== '') || e.target.value !== '')) {
      this.setState({disabled: false})
    }
  }

  onTextChange (e) {
    this.setState({textAreaValue: e.target.value})
    if (e.target.value !== '' && ((this.state.file && this.state.file !== '') || this.inputPhoneNumbers.value !== '')) {
      this.setState({disabled: false})
    }
    if (e.target.value) {
      this.setState({messageErrors: []})
    } else {
      this.setState({
        messageErrors: [{errorMsg: 'Enter an invitation message'}]
      })
    }
  }

  validate (type) {
    var errors = false
    console.log('validate', this.state)
    if (type === 'file') {
      if (this.state.file === '') {
        this.setState({
          fileErrors: [{errorMsg: 'Upload a file'}]
        })
        errors = true
      }
      if (this.state.textAreaValue === '' &&
        this.state.textAreaValue.length < 1) {
        this.setState({
          messageErrors: [{errorMsg: 'Enter an invitation message'}]
        })
        errors = true
      }
    } else if (type === 'numbers') {
      const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      console.log('phoneNumbers:', this.state.phoneNumbers)
      let err = []
      for (var i = 0; i < this.state.phoneNumbers.length; i++) {
        if (!this.state.phoneNumbers[i].match(regex)) {
          err.push(this.state.phoneNumbers[i])
          errors = true
        }
      }
      this.setState({numbersError: err})
    }
    return !errors
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called', nextProps)
    var res = nextProps.uploadResponse.fileUploadResponse
    if (res.status === 'failed') {
      this.setState({
        alertMessage: (`${res.status} : ${res.description}`),
        type: 'danger',
        disabled: true
      })
    } else if (res.status === 'success') {
      if (this.state.file && this.state.file !== '') {
        this.setState({
          alertMessage: ('Your file has been uploaded successfully.'),
          type: 'success',
          disabled: true
        })
      } else {
        this.setState({
          alertMessage: (res.description),
          type: 'success',
          disabled: true
        })
      }
    } else {
      this.setState({
        alertMessage: '',
        type: ''
      })
    }
    if (nextProps.customerLists && nextProps.customerLists.length > 0) {
      for (var i = 0; i < nextProps.customerLists.length; i++) {
        var list = nextProps.customerLists[i]
        if (list.initialList) {
          this.setState({
            initialList: nextProps.customerLists[i]
          })
        }
      }
    }
    if (nextProps.nonSubscribersNumbers && nextProps.nonSubscribersNumbers.length > 0) {
      this.setState({
        nonSubscribersList: nextProps.nonSubscribersNumbers
      })
    }
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        textAreaValue: `Please subscribe to my page *${this.props.pages[0].pageName}* by typing Yes`,
        selectPage: this.props.pages[0]
      })
    } else {
      this.setState({
        textAreaValue: '',
        selectPage: {}
      })
    }
  }
  componentDidMount () {
    this.selectPage()
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Invite using phone number'
  }

  render () {
    console.log(this.state)
    return (
      <div>
        <Header />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
              <YouTube
                videoId="r2z8GV_qWvY"
                opts={{
                  height: '390',
                  width: '640',
                  playerVars: { // https://developers.google.com/youtube/player_parameters
                    autoplay: 1
                  }
                }}
              />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Customer Matching using
                    Phone Number (Experimental Feature)</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                  this.props.pages &&
                  this.props.pages.length === 0 &&
                  <div className='alert alert-success'>
                    <h4 className='block'>0 Pages Connected</h4>
                    You have no pages connected. Please connect your facebook pages to invite customers using phone numbers. <Link to='/addPages' >Add Pages</Link>
                  </div>
            }

            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding broadcasts? Here is the  <a href='http://kibopush.com/broadcast/' target='_blank'>documentation</a>.
                Or check out this <a href='#' onClick={()=>{ this.setState({showVideo: true})}}>video tutorial</a>
              </div>
            </div>

              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  Upload a file with '.csv' extension containing phone numbers
                  of your customers to invite them for a chat on messenger.
                  The
                  file should contain columns 'names' and 'phone_numbers'.
                  The columns should contain the list all the customers&#39;
                  name and phone
                  numbers respectively. An invitation message will be sent on
                  Facebook messenger
                  to all the customers listed using their phone
                  numbers.
                  <br /><br />
                  <b>Note: </b>This is an experimental feature and it is
                  specific
                  for pages that belong to United States of America (One of the
                  page admins should be from USA). There is a one time fee for each page that you have connected.
                  For further Details on how to make the payment, please contact us <a href='https://www.messenger.com/t/kibopush' target='_blank'>here</a>
                </div>
              </div>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need further help in understanding Customer Matching using Phone Numbers ?
                  <a target='_blank' href='http://kibopush.com/invite-sms/'> Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div
                  className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Invite people using phone number
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className='m-portlet__body'>
                      { (this.state.initialList !== '' || this.state.nonSubscribersList !== '') &&
                        <div className='form-group m-form__group  row'>
                          <label className='col-4 col-form-label'>
                            View Customers Lists
                          </label>
                          <div className='col-8'>
                            <span style={{float: 'right'}}>
                            {this.state.initialList !== '' &&
                              <button className='btnListDetail btn btn-outline-focus  m-btn m-btn--pill m-btn--custom' onClick={() => this.saveList(this.state.initialList)}>
                                Customers Subscribed
                              </button>
                            }
                            { this.state.nonSubscribersList !== '' &&
                              <Link to='/nonSubscribersList' className='btnListDetail btn btn-outline-focus  m-btn m-btn--pill m-btn--custom'>
                                Customers With Pending Subscription
                              </Link>
                            }
                            </span>
                          </div>
                        </div>
                      }
                      <div className='form-group m-form__group row'>
                        <label className='col-2 col-form-label'>
                          Change Page
                        </label>
                        <div className='col-6'>
                          <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                            {
                              this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-2 col-form-label' />
                        <div className='col-lg-6 col-md-9 col-sm-12'>
                          {
                            this.state.file !== ''
                            ? <div className='m-dropzone dropzone dz-clickable'
                              id='m-dropzone-one'>
                              <div style={{marginTop: '10%'}}>
                                <span onClick={this.removeFile} style={{float: 'right'}} className='fa-stack'>
                                  <i style={{color: '#ccc', cursor: 'pointer'}} className='fa fa-times fa-stack-1x fa-inverse' />
                                </span>
                                <h4><i style={{fontSize: '20px'}} className='fa fa-file-text-o' /> {this.state.file[0].name}</h4>
                              </div>
                            </div>
                            : <div className='m-dropzone dropzone dz-clickable'
                              id='m-dropzone-one'>
                              {
                                this.state.manually
                                ? <div>
                                  <label>{'Enter phone number separated by semi colon {;}'}</label>
                                  <input autoFocus ref={(input) => { this.inputPhoneNumbers = input }} type='text' className='form-control m-input m-input--square' onChange={this.onPhoneNumbersChange} placeholder='Numbers must start with + sign' />
                                  {
                                    this.state.numbersError.length > 0 &&
                                    <span className='m-form__help'>
                                      <span style={{color: 'red'}}>One or more numbers are incorrect. Please make sure that all numbers must start with + sign.</span>
                                    </span>
                                  }
                                </div>
                                : <button style={{cursor: 'pointer'}} onClick={() => this.enterPhoneNoManually()} className='btn m-btn--pill btn-success'>Enter phone numbers manually</button>
                              }
                              <h4 style={{marginTop: '20px', marginBottom: '15px'}}>OR</h4>
                              <Files
                                className='file-upload-area'
                                onChange={this.onFilesChange}
                                onError={this.onFilesError}
                                accepts={[
                                  'text/comma-separated-values',
                                  'text/csv',
                                  'application/csv',
                                  '.csv',
                                  'application/vnd.ms-excel']}
                                multiple={false}
                                maxFileSize={25000000}
                                minFileSize={0}
                                clickable>
                                <button style={{cursor: 'pointer'}} className='btn m-btn--pill btn-success'>Upload CSV File</button>
                              </Files>
                            </div>
                          }
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Invitation Message
                        </label>
                        <div className='col-lg-6'>
                          <textarea
                            className='form-control m-input m-input--solid'
                            id='exampleTextarea' rows='3'
                            placeholder='Enter Invitation Message'
                            value={this.state.textAreaValue}
                            onChange={this.onTextChange} />
                          <span className='m-form__help'>
                            {
                              this.state.messageErrors.map(
                                m => <span style={{color: 'red'}}>{m.errorMsg}</span>
                              )
                            }
                          </span>
                        </div>
                      </div>
                      <div className='m-form'>
                        <div className='m-portlet__body'>
                          <div className='m-portlet__foot m-portlet__foot--fit'>
                            <div className='m-form__actions m-form__actions' style={{paddingleft: '0px !important'}}>
                              <button style={{marginRight: '10px'}} className='btn btn-primary'onClick={this.clickAlert}>
                                Reset
                              </button>
                              { (this.props.pages && this.props.pages.length === 0) || this.state.disabled
                                ? <button type='submit' className='btn btn-primary' disabled>
                                  Submit
                                </button>
                                : <button onClick={this.handleSubmit} type='submit' className='btn btn-primary'>
                                  Submit
                                </button>
                              }
                              <div className='pull-right' style={{display: 'inline-block'}} onClick={this.getSampleFile}>
                                <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                  <label>Download Sample CSV file: </label>
                                </div>
                                <div style={{display: 'inline-block', marginLeft: '10px'}}>
                                  <i style={{cursor: 'pointer'}} className='fa fa-download fa-2x' />
                                </div>
                              </div>
                            </div>
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
                              this.state.alertMessage !== '' &&
                              <div className='alert alert-success' role='alert'>
                                {this.state.alertMessage} <br />
                                {
                                  this.state.file && this.state.file !== '' &&
                                  <a href='#' className='alert-link' onClick={this.clickAlert}>Click here to select another file</a>
                                }
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
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    uploadResponse: state.getFileUploadResponse,
    pages: state.pagesInfo.pages,
    customerLists: (state.listsInfo.customerLists),
    nonSubscribersNumbers: (state.nonSubscribersInfo.nonSubscribersData)
    // uploadResponse: {status :'success'}
    // uploadResponse: {status :'failed' , description: 'Some problem'}
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveFileForPhoneNumbers: saveFileForPhoneNumbers,
    loadMyPagesList: loadMyPagesList,
    downloadSampleFile: downloadSampleFile,
    sendPhoneNumbers: sendPhoneNumbers,
    clearAlertMessage: clearAlertMessage,
    loadCustomerLists: loadCustomerLists,
    saveCurrentList: saveCurrentList,
    getPendingSubscriptions: getPendingSubscriptions
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerMatching)
