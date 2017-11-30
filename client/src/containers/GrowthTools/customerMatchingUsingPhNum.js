import React from 'react'
import Files from 'react-files'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveFileForPhoneNumbers } from '../../redux/actions/growthTools.actions'

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
      disabled: false
    }

    this.onTextChange = this.onTextChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validate = this.validate.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.clickAlert = this.clickAlert.bind(this)
  }

  clickAlert (e) {
    e.preventDefault()
    this.setState({
      file: '',
      textAreaValue: '',
      fileErrors: [],
      messageErrors: [],
      alertMessage: '',
      type: '',
      disabled: false
    })
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
                  numbers.<br /><br />
                  <b>Note: </b>This is an experimental feature and it is
                  specific
                  for pages that belong to United States of America (One of the
                  page admins should be from USA). There is a one time fee for for each page that you have connected.
                  For further Details on how to make the payment, please contact us <a href='https://www.messenger.com/t/kibopush' target='_blank'>
                    here
                  </a>
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
                            Upload CSV
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <label className='col-form-label col-lg-3 col-sm-12'>
                          Upload your file
                        </label>
                        <div className='col-lg-4 col-md-9 col-sm-12'>
                          <div className='m-dropzone dropzone dz-clickable'
                            id='m-dropzone-one'>
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
                              <div
                                className='m-dropzone__msg dz-message needsclick'>
                                <h3 className='m-dropzone__msg-title'>
                                  Drop file here or click to upload.
                                </h3>
                                <span className='m-dropzone__msg-desc'>
                                Please upload the CSV type file.
                              </span>
                              </div>
                            </Files>
                          </div>
                        </div>
                      </div>
                      <div className='m-form'>
                        <div className='m-portlet__body'>
                          <div
                            className='m-form__section m-form__section--first'>
                            <div className='m-form__heading'>
                              <h3 className='m-form__heading-title'>
                                File Info and Invite Message:
                              </h3>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-lg-2 col-form-label'>
                                File Selected:
                              </label>
                              <div className='col-lg-6'>
                                <input type='text' disabled='true'
                                  className='form-control m-input'
                                  value={this.state.file !== ''
                                         ? this.state.file[0].name
                                         : ''} />
                                <span className='m-form__help'>
                                  {
                                    this.state.fileErrors.map(
                                      f => <span>{f.errorMsg}</span>)
                                  }
                                </span>
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
                                      m => <span>{m.errorMsg}</span>)
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='m-portlet__foot m-portlet__foot--fit'>
                            <div className='m-form__actions m-form__actions'>
                              { this.state.disabled
                                ? <button type='submit' className='btn btn-primary' disabled='disabled'>
                                  Submit
                                </button>
                                : <button onClick={this.handleSubmit} type='submit' className='btn btn-primary'>
                                  Submit
                                </button>
                              }
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
    uploadResponse: state.getFileUploadResponse
    // uploadResponse: {status :'success'}
    // uploadResponse: {status :'failed' , description: 'Some problem'}
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({saveFileForPhoneNumbers: saveFileForPhoneNumbers},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerMatching)
