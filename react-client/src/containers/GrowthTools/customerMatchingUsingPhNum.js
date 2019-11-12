import React from 'react'
import Files from 'react-files'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { saveFileForPhoneNumbers, downloadSampleFile, sendPhoneNumbers, clearAlertMessage, getPendingSubscriptions } from '../../redux/actions/growthTools.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import YouTube from 'react-youtube'
import {
  loadCustomerListsNew, saveCurrentList
} from '../../redux/actions/customerLists.actions'
import Select from 'react-select'
import AlertContainer from 'react-alert'
import Papa from 'papaparse'
import AlertMessage from '../../components/alertMessages/alertMessage'
class CustomerMatching extends React.Component {
  constructor(props, context) {
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
      customerLists: [],
      nonSubscribersList: '',
      columns: [],
      nameColumn: '',
      phoneColumn: '',
      columnAlerts: false,
      fileContent: []
    }

    this.onTextChange = this.onTextChange.bind(this)
    this.closeDialogFileColumns = this.closeDialogFileColumns.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
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
    this.handleNameColumn = this.handleNameColumn.bind(this)
    this.handlePhoneColumn = this.handlePhoneColumn.bind(this)
    this.saveColumns = this.saveColumns.bind(this)
    this.parseCSV = this.parseCSV.bind(this)
    this.props.clearAlertMessage()
    this.props.loadCustomerListsNew({ last_id: 'none', number_of_records: 10, first_page: 'first' })
    this.props.getPendingSubscriptions()
  }
  saveColumns() {
    if (this.state.phoneColumn === '' || this.state.nameColumn === '') {
      this.setState({
        columnAlerts: true
      })
      return
    }
    if (this.state.phoneColumn.value === this.state.nameColumn.value) {
      this.setState({
        columnAlerts: true
      })
      return
    }
    this.setState({
      disabled: false
    })
    this.closeDialogFileColumns()
  }
  closeDialogFileColumns() {
    this.setState({
      columnAlerts: false
    })
  }
  handleNameColumn(value) {
    if (!value) {
      this.setState({
        nameColumn: ''
      })
    } else {
      this.setState({
        nameColumn: value
      })
    }
  }
  handlePhoneColumn(value) {
    if (!value) {
      this.setState({
        phoneColumn: ''
      })
    } else {
      this.setState({
        phoneColumn: value
      })
    }
  }
  onSubmit() {
    var file = this.state.file
    if (file && file !== '') {
      var name = (file[0].name).split('.')
      var nameExists = false
      for (var i = 0; i < this.state.customerLists.length; i++) {
        var list = this.state.customerLists[i]
        if (list.initialList && (list.listName).toLowerCase() === name[0].toLowerCase()) {
          nameExists = true
          break
        }
      }
      if (nameExists) {
        this.refs.nameExists.click()
        return
      }
    }
    this.handleSubmit()
  }
  scrollToTop() {
    this.top.scrollIntoView({ behavior: 'instant' })
  }
  getSampleFile() {
    this.props.downloadSampleFile()
  }

  enterPhoneNoManually() {
    this.setState({ manually: true })
  }

  removeFile() {
    this.setState({ file: '' })
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

  clickAlert(e) {
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
      numbersError: [],
      nameColumn: '',
      phoneColumn: ''
    })
    this.props.clearAlertMessage()
    this.selectPage()
  }

  onFilesChange(files) {
    var self = this
    if (files.length > 0) {
      this.setState({
        file: files,
        fileErrors: [],
        nameColumn: '',
        phoneColumn: '',
        disabled: true
      })
      var fileSelected = files[0]
      if (fileSelected.extension !== 'csv') {
        this.setState({
          fileErrors: [{ errorMsg: 'Please select a file with .csv extension' }]
        })
        return
      }
      this.parseCSV(self, fileSelected)
    }
  }
  validateFileContent() {
    var content = this.state.fileContent
    var columnsArray = content[0]
    var indexName = ''
    var indexPhone = ''
    var faulty = false
    var errors = []
    for (let i = 0; i < columnsArray.length; i++) {
      if (this.state.phoneColumn.value === columnsArray[i]) {
        indexPhone = i
      }
      if (this.state.nameColumn.value === columnsArray[i]) {
        indexName = i
      }
    }
    for (let i = 1; i < content.length; i++) {
      var record = content[i]
      var recordName = record[indexName]
      var recordPhone = record[indexPhone]
      if (content.length === 2 && record && record.length === 1 && record[0] === '') {
        faulty = true
        let error = { errorMsg: 'No records found' }
        errors.push(error)
        break
      }
      // eslint-disable-next-line
      let regexp = /^[0-9+\(\)#\.\s\/ext-]+$/
      if (recordName && recordName.length > 50) {
        faulty = true
        let error = { errorMsg: 'File consists of customer names that is too long' }
        errors.push(error)
        break
      }
      if (recordPhone && ((recordPhone.length > 0 && recordPhone.length < 5) || !regexp.test(recordPhone))) {
        faulty = true
        let error = { errorMsg: 'File consists of invalid phone numbers' }
        errors.push(error)
        break
      }
    }
    if (faulty) {
      this.setState({
        fileErrors: errors,
        disabled: true
      })
    }
    return faulty
  }
  parseCSV(self, file) {
    Papa.parse(file, {
      complete: function (results) {
        console.log('Finished:', results.data)
        var faulty = false
        if (results.data && results.data.length > 0) {
          var columnsArray = []
          var columns = results.data[0]
          for (var i = 0; i < columns.length; i++) {
            if (columns[i] !== '') {
              columnsArray.push({ 'value': columns[i], 'label': columns[i] })
            } else {
              faulty = true
              break
            }
          }
          if (faulty) {
            self.setState({
              fileErrors: [{ errorMsg: 'Incorrect data format' }]
            })
            return
          }
          self.setState({
            columns: columnsArray,
            fileContent: results.data
          })
        }
      }
    })
    this.refs.fileInfo.click()

  }

  uploadFile(file) {
    if (file && file !== '') {
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('text', this.state.textAreaValue)
      fileData.append('pageId', this.state.selectPage.pageId)
      fileData.append('_id', this.state.selectPage._id)
      fileData.append('phoneColumn', this.state.phoneColumn.value)
      fileData.append('nameColumn', this.state.nameColumn.value)

      if (this.validate('file')) {
        this.setState({
          loading: true
        })
        this.props.saveFileForPhoneNumbers(fileData, this.handleResponse)
      }
    }
  }
  onFilesError(error, file) {
    this.setState({
      fileErrors: [{ errorMsg: error.message }]
    })
  }

  /* global FormData */
  handleSubmit() {
    var file = this.state.file
    if (file && file.length > 0) {
      var hasErrors = this.validateFileContent()
      if (!hasErrors) {
        this.uploadFile(file[0])
      }
    } else if (this.inputPhoneNumbers.value !== '') {
      if (this.validate('numbers')) {
        this.props.sendPhoneNumbers({ numbers: this.state.phoneNumbers, text: this.state.textAreaValue, pageId: this.state.selectPage.pageId, _id: this.state.selectPage._id })
      }
    }
  }
  handleResponse(res) {
    this.setState({
      loading: false
    })
  }

  onPhoneNumbersChange(e) {
    if (e.target.value === '') {
      this.setState({ disabled: true })
      return
    }
    this.setState({ phoneNumbers: this.inputPhoneNumbers.value.split(';') })
    this.setState({ disabled: false })
    if (this.state.textAreaValue !== '' && ((this.state.file && this.state.file !== '') || e.target.value !== '')) {
      this.setState({ disabled: false })
    }
  }

  onTextChange(e) {
    if (e.target.value === '') {
      this.setState({ disabled: true })
    }
    this.setState({ textAreaValue: e.target.value })
    if (e.target.value !== '' && ((this.state.file && this.state.file !== '') || this.inputPhoneNumbers.value !== '')) {
      this.setState({ disabled: false })
    }
    if (e.target.value) {
      this.setState({ messageErrors: [] })
    } else {
      this.setState({
        messageErrors: [{ errorMsg: 'Enter an invitation message' }]
      })
    }
  }

  validate(type) {
    var errors = false
    if (type === 'file') {
      if (this.state.file === '') {
        this.setState({
          fileErrors: [{ errorMsg: 'Upload a file' }]
        })
        errors = true
      }
      if (this.state.textAreaValue === '' &&
        this.state.textAreaValue.length < 1) {
        this.setState({
          messageErrors: [{ errorMsg: 'Enter an invitation message' }]
        })
        errors = true
      }
    } else if (type === 'numbers') {
      const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      let err = []
      for (var i = 0; i < this.state.phoneNumbers.length; i++) {
        if (!this.state.phoneNumbers[i].match(regex)) {
          err.push(this.state.phoneNumbers[i])
          errors = true
        }
      }
      this.setState({ numbersError: err })
    }
    return !errors
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    var res = nextProps.uploadResponse.fileUploadResponse
    if (res.status === 'failed') {
      this.setState({
        alertMessage: (`${res.status} : ${res.payload}`),
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
          alertMessage: (res.payload),
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
      var customerLists = []
      for (var i = 0; i < nextProps.customerLists.length; i++) {
        var list = nextProps.customerLists[i]
        customerLists.push(list)
      }
      this.setState({
        customerLists: customerLists
      })
    }
    if (nextProps.nonSubscribersNumbers && nextProps.nonSubscribersNumbers.length > 0) {
      this.setState({
        nonSubscribersList: nextProps.nonSubscribersNumbers
      })
    }
  }
  selectPage() {
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
  componentDidMount() {
    this.scrollToTop()
    this.selectPage()
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Invite Using Phone Number`;
  }

  render() {
    console.log('customerMatchingUsingPhNum state', this.state)
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
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Invite Using Phone Number Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <YouTube
                  videoId='gytuYccBcyQ'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='fileInfo' data-toggle="modal" data-target="#fileInfo">fileInfo</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="fileInfo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Provide File Information
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='form-group m-form__group col-12'>
                  <label className='col-lg-12 col-form-label'>
                    Select column for customer names
                </label>
                  <div className='col-lg-8'>
                    <Select
                      options={this.state.columns}
                      onChange={this.handleNameColumn}
                      value={this.state.nameColumn}
                      placeholder='Select Field'
                    />
                  </div>
                  {this.state.columnAlerts && this.state.nameColumn === '' && <span className='m-form__help' >
                    <span style={{ color: 'red', paddingLeft: '14px' }}>Select a field</span>
                  </span>
                  }
                </div>
                <div className='form-group m-form__group col-12'>
                  <label className='col-lg-12 col-form-label'>
                    Select column for customer phone numbers
                </label>
                  <div className='col-lg-8'>
                    <Select
                      options={this.state.columns}
                      onChange={this.handlePhoneColumn}
                      value={this.state.phoneColumn}
                      placeholder='Select Field'
                    />
                  </div>
                  {this.state.columnAlerts && this.state.phoneColumn === '' && <span className='m-form__help' >
                    <span style={{ color: 'red', paddingLeft: '14px' }}>Select a field</span>
                  </span>
                  }
                </div>
                {this.state.columnAlerts && (this.state.nameColumn !== '' && this.state.nameColumn.value === this.state.phoneColumn.value) && <span className='m-form__help' >
                  <span style={{ color: 'red', marginLeft: '28px' }}> You cannot select same fields for both columns</span>
                </span>
                }
                <button style={{ float: 'right', marginLeft: '10px' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.saveColumns()
                  }}
                  data-dismiss='modal'>Save
              </button>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.setState({
                      phoneColumn: '',
                      nameColumn: '',
                      disabled: true
                    })
                  }}
                  data-dismiss='modal'>Cancel
              </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='nameExists' data-toggle="modal" data-target="#nameExists">nameExists</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="nameExists" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Warning
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>A customer list file name with a similar name exists.
                Do you want to replace the list ?</p>
                <button style={{ float: 'right', marginLeft: '10px' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.handleSubmit()
                  }}
                  data-dismiss='modal'>Yes
              </button>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                  }} data-dismiss='modal'>Cancel
              </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Invite using
                Phone Number (Experimental Feature)</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages &&
            this.props.pages.length === 0 &&
            <AlertMessage type='page' />
          }
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
              Need help in understanding Invite Using Phone Numbers? Here is the <a href='http://kibopush.com/invite-using-phone-numbers/' target='_blank' rel='noopener noreferrer'>documentation</a>&nbsp;
            Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
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
              Then select columns from your file that contain customers&#39; names and phone numbers.
              An invitation message will be sent on
              Facebook messenger
              to all the customers listed using their phone
              numbers.
              <br /><br />
              <b>Note: </b>This is an experimental feature and it is
              specific
              for pages that belong to United States of America (One of the
              page admins should be from USA). There is a one time fee for each page that you have connected.
              For further Details on how to make the payment, please contact us <a href='https://www.messenger.com/t/kibopush' target='_blank' rel='noopener noreferrer'>here</a>
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
                        Invite customers using phone number
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {
                      this.state.customerLists.length === 0
                        ? <Link className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                          <span>
                            <i className='la la-list' />
                            <span>
                              View Customers Lists
                          </span>
                          </span>
                        </Link>
                        : <Link className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' to='/customerLists'>
                          <span>
                            <i className='la la-list' />
                            <span>
                              View Customers Lists
                          </span>
                          </span>
                        </Link>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
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
                            <div style={{ marginTop: '10%' }}>
                              <span onClick={this.removeFile} style={{ float: 'right' }} className='fa-stack'>
                                <i style={{ color: '#ccc', cursor: 'pointer' }} className='fa fa-times fa-stack-1x fa-inverse' />
                              </span>
                              <h4><i style={{ fontSize: '20px' }} className='fa fa-file-text-o' /> {this.state.file[0].name}</h4>
                              {this.state.fileErrors.length < 1 && <button style={{ cursor: 'pointer', marginTop: '20px' }} className='btn m-btn--pill btn-success'>Select Columns</button>}
                            </div>
                            <span className='m-form__help'>
                              {
                                this.state.fileErrors.map(
                                  m => <span style={{ color: 'red' }}>{m.errorMsg}</span>
                                )
                              }
                            </span>
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
                                      <span style={{ color: 'red' }}>One or more numbers are incorrect. Please make sure that all numbers must start with + sign.</span>
                                    </span>
                                  }
                                </div>
                                : <button style={{ cursor: 'pointer' }} onClick={() => this.enterPhoneNoManually()} className='btn m-btn--pill btn-success'>Enter phone numbers manually</button>
                            }
                            <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>OR</h4>
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
                              <button style={{ cursor: 'pointer' }} className='btn m-btn--pill btn-success'>Upload CSV File</button>
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
                            m => <span style={{ color: 'red' }}>{m.errorMsg}</span>
                          )
                        }
                      </span>
                    </div>
                  </div>
                  <div className='m-form'>
                    <div className='m-portlet__body'>
                      <div className='m-portlet__foot m-portlet__foot--fit'>
                        <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                          <button style={{ marginRight: '10px' }} className='btn btn-primary' onClick={this.clickAlert}>
                            Reset
                          </button>
                          {((this.props.pages && this.props.pages.length === 0) || this.state.disabled)
                            ? <button type='submit' className='btn btn-primary' disabled>
                              Submit
                            </button>
                            : <button onClick={this.onSubmit} type='submit' className='btn btn-primary'>
                              Submit
                            </button>
                          }

                          <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.getSampleFile}>
                            <span>
                              <i className='fa fa-download' />
                              <span>
                                Download Sample CSV file
                              </span>
                            </span>
                          </button>
                        </div>
                        {
                          this.state.loading
                            &&
                              <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
                                className='align-center'>
                                <center><RingLoader color='#716aca' /></center>
                              </div>
                        }
                        {
                          this.state.alertMessage !== '' &&
                          <div className='alert alert-success' role='alert'>
                            {this.state.alertMessage} <br />
                            {
                              this.state.file && this.state.file !== '' &&
                              <a href='#/' className='alert-link' onClick={this.clickAlert}>Click here to select another file</a>
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
    )
  }
}

function mapStateToProps(state) {
  console.log('in mapStateToProps', state)
  return {
    uploadResponse: state.growthToolsInfo,
    pages: state.pagesInfo.pages,
    customerLists: (state.listsInfo.customerLists),
    nonSubscribersNumbers: (state.growthToolsInfo.nonSubscribersData)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    saveFileForPhoneNumbers: saveFileForPhoneNumbers,
    loadMyPagesList: loadMyPagesList,
    downloadSampleFile: downloadSampleFile,
    sendPhoneNumbers: sendPhoneNumbers,
    clearAlertMessage: clearAlertMessage,
    loadCustomerListsNew: loadCustomerListsNew,
    saveCurrentList: saveCurrentList,
    getPendingSubscriptions: getPendingSubscriptions
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerMatching)
