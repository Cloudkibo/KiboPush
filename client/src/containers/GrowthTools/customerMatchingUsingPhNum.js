import React from 'react'
import Files from 'react-files'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveFileForPhoneNumbers, downloadSampleFile } from '../../redux/actions/growthTools.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

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
      disabled: false,
      selectPage: {},
      fblink: '',
      manually: false
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
  }
  getSampleFile () {
    this.props.downloadSampleFile()
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
      if (page.pageUserName) {
        this.setState({
          textAreaValue: `Enter an invitation message for subscibers of your page: https://m.me/${page.pageUserName}`,
          selectPage: page
        })
      } else {
        this.setState({
          textAreaValue: `Enter an invitation message for subscibers of your page: https://m.me/${page.pageId}`,
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
      disabled: false
    })
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
        fileErrors: []
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
    }
    if (this.validate()) {
      this.props.saveFileForPhoneNumbers(fileData)
    }
  }

  onTextChange (e) {
    this.setState({textAreaValue: e.target.value})
    if (e.target.value) {
      this.setState({messageErrors: []})
    } else {
      this.setState({
        messageErrors: [{errorMsg: 'Enter an invitation message'}]
      })
    }
  }

  validate () {
    var errors = false
    console.log('validate', this.state)
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
      this.setState({
        alertMessage: ('Your file has been uploaded successfully.'),
        type: 'success',
        disabled: true
      })
    } else {
      this.setState({
        alertMessage: '',
        type: '',
        disabled: false
      })
    }
  }
  selectPage () {
    if (this.props.pages && this.props.pages[0].pageUserName && this.props.pages.length > 0) {
      this.setState({
        textAreaValue: `Enter an invitation message for subscibers of your page: https://m.me/${this.props.pages[0].pageUserName}`,
        selectPage: this.props.pages[0]
      })
    } else {
      this.setState({
        textAreaValue: `Enter an invitation message for subscibers of your page: https://m.me/${this.props.pages[0].pageId}`,
        selectPage: this.props.pages[0]
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
    return (
      <div>
        <Header />
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
                  page admins should be from USA). There is a one time fee for for each page that you have connected.
                  For further Details on how to make the payment, please contact us
                  <a href='https://www.messenger.com/t/kibopush' target='_blank'>
                    here
                  </a>
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
                                ? <input type='text' className='form-control m-input m-input--square' placeholder='Enter phone number separated by semi colon {;}' />
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
                                <h3 className='m-dropzone__msg-title' style={{lineHeight: '40px'}}>
                                  {this.state.file !== ''
                                          ? `Selected File : ${this.state.file[0].name}`
                                          : ''}
                                </h3>
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
                              { this.state.disabled
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
                              this.state.alertMessage !== '' &&
                              <div className='alert alert-success' role='alert'>
                                {this.state.alertMessage} <br />
                                <a href='#' className='alert-link' onClick={this.clickAlert}>Click here to select another file</a>
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
    pages: state.pagesInfo.pages
    // uploadResponse: {status :'success'}
    // uploadResponse: {status :'failed' , description: 'Some problem'}
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveFileForPhoneNumbers: saveFileForPhoneNumbers,
    loadMyPagesList: loadMyPagesList,
    downloadSampleFile: downloadSampleFile},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerMatching)
