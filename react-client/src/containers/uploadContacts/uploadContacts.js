/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadNumbers, uploadFile } from '../../redux/actions/uploadContacts.actions'
import Files from 'react-files'
import Papa from 'papaparse'
import Select from 'react-select'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class UploadContacts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      manualNumbers: [],
      name: '',
      number: '',
      fileErrors: [],
      manualError: '',
      showFileColumns: false,
      columns: [],
      nameColumn: '',
      phoneColumn: '',
      columnAlerts: false,
      fileContent: [],
      manually: false,
      dict: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.removeNumber = this.removeNumber.bind(this)
    this.changeNumber = this.changeNumber.bind(this)
    this.changeName = this.changeName.bind(this)
    this.closeDialogFileColumns = this.closeDialogFileColumns.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.validate = this.validate.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.handleNameColumn = this.handleNameColumn.bind(this)
    this.handlePhoneColumn = this.handlePhoneColumn.bind(this)
    this.saveColumns = this.saveColumns.bind(this)
    this.parseCSV = this.parseCSV.bind(this)
    this.addManually = this.addManually.bind(this)
    this.clearFields = this.clearFields.bind(this)
  }
  handleInputChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name.trim()
    let dictCopy = this.state.dict
    dictCopy[name] = value
    this.setState({
      dict: dictCopy
    })
  }
  addManually () {
    if (this.state.number === '' || this.state.name === '') {
      this.setState({manualError: 'Please fill all the fields'})
    } else if (!this.validate('number')) {
      this.setState({manualError: 'This number is invalid. Please enter a valid number'})
    } else {
      let duplicate = this.state.manualNumbers.filter((number) => number.number === this.state.number)
      if (duplicate && duplicate.length > 0) {
        this.setState({manualError: 'This number is already added'})
      } else {
        let temp = this.state.manualNumbers
        temp.push({name: this.state.name, number: this.state.number})
        this.setState({name: '', number: '', manualNumbers: temp, manualError: ''})
      }
    }
  }
  removeNumber (e, index) {
    let removed = this.state.manualNumbers
    removed.splice(index, 1)
    this.setState({manualNumbers: removed})
    if (removed.length === 0) {
      this.setState({manually: false})
    }
  }
  changeName (e) {
    this.setState({name: e.target.value})
  }
  changeNumber (e) {
    this.setState({number: e.target.value})
  }
  saveColumns () {
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
  closeDialogFileColumns () {
    this.setState({
      showFileColumns: false,
      columnAlerts: false
    })
  }
  handleNameColumn (value) {
    this.setState({
      columnAlerts: false
    })
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
  handlePhoneColumn (value) {
    this.setState({
      columnAlerts: false
    })
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
  onSubmit () {
    var file = this.state.file
    if (file && file.length > 0) {
      var hasErrors = this.validateFileContent()
      if (!hasErrors) {
        this.uploadFile(file[0])
      }
    } else if (this.state.manualNumbers && this.state.manualNumbers.length > 0) {
      this.props.uploadNumbers({numbers: this.state.manualNumbers}, this.msg, this.clearFields)
    } else {
      this.msg.error('Please upload a file or enter numbers manually')
    }
  }

  clearFields () {
    this.setState({manualNumbers: [], manually: false, file: '', dict: {}, nameColumn: '', phoneColumn: ''})
  }

  removeFile () {
    this.setState({file: '', nameColumn: '', phoneColumn: '', dict: {}})
  }

  onFilesChange (files) {
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
          fileErrors: [{errorMsg: 'Please select a file with .csv extension'}]
        })
        return
      }
      this.parseCSV(self, fileSelected)
    }
  }
  validateFileContent () {
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
        let error = {errorMsg: 'No records found'}
        errors.push(error)
        break
      }
      // eslint-disable-next-line
      let regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      if (recordName && recordName.length > 50) {
        faulty = true
        let error = {errorMsg: 'File consists of customer names that is too long'}
        this.msg.error('File consists of customer names that are too long')
        errors.push(error)
        break
      }
      if (recordPhone && ((recordPhone.length > 0 && recordPhone.length < 5) || !regexp.test(recordPhone))) {
        faulty = true
        let error = {errorMsg: 'File consists of invalid phone numbers'}
        this.msg.error('File consists of invalid phone numbers')
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
  parseCSV (self, file) {
    Papa.parse(file, {
      complete: function (results) {
        console.log('Finished:', results.data)
        var faulty = false
        if (results.data && results.data.length > 0) {
          var columnsArray = []
          var columns = results.data[0]
          for (var i = 0; i < columns.length; i++) {
            if (columns[i] !== '') {
              columnsArray.push({'value': columns[i].trim(), 'label': columns[i].trim()})
            } else {
              faulty = true
              break
            }
          }
          if (faulty) {
            self.setState({
              fileErrors: [{errorMsg: 'Incorrect data format'}]
            })
            return
          }
          self.setState({
            columns: columnsArray,
            showFileColumns: true,
            fileContent: results.data
          })
        }
      }
    })
  }

  uploadFile (file) {
    let otherColumns = []
    for (var key in this.state.dict) {
      if (key !== this.state.phoneColumn.value && key !== this.state.nameColumn.value && this.state.dict[key]) {
        otherColumns.push(key)
      }
    }
    console.log('otherColumns', otherColumns)
    if (file && file !== '') {
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('phoneColumn', this.state.phoneColumn.value)
      fileData.append('nameColumn', this.state.nameColumn.value)
      fileData.append('otherColumns', otherColumns)

      if (this.validate('file')) {
        this.setState({
          loading: true
        })
        this.props.uploadFile(fileData, this.msg, this.clearFields)
      }
    }
  }
  onFilesError (error) {
    // this.setState({
    //   fileErrors: [{errorMsg: error.message}]
    // })
    this.msg.error(error.message)
  }

  validate (type) {
    var errors = false
    if (type === 'file') {
      if (this.state.file === '') {
        this.setState({
          fileErrors: [{errorMsg: 'Upload a file'}]
        })
        errors = true
      }
    } else if (type === 'number') {
      const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      if (!this.state.number.match(regex)) {
        errors = true
      }
    }
    return !errors
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Upload Contacts`
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
        {/*
          this.state.showFileColumns &&
          <ModalContainer style={{width: '680px'}}>
            <ModalDialog style={{width: '680px'}}>
              <div className='form-group m-form__group row'>
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
                { this.state.columnAlerts && this.state.nameColumn === '' && <span className='m-form__help' >
                  <span style={{color: 'red', paddingLeft: '14px'}}>Select a field</span>
                  </span>
                }
              </div>
              <div className='form-group m-form__group row'>
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
                { this.state.columnAlerts && this.state.phoneColumn === '' && <span className='m-form__help' >
                  <span style={{color: 'red', paddingLeft: '14px'}}>Select a field</span>
                  </span>
                }
              </div>
              { this.state.columnAlerts && (this.state.nameColumn !== '' && this.state.nameColumn.value === this.state.phoneColumn.value) && <span className='m-form__help' >
                <span style={{color: 'red'}}> You cannot select same fields for both columns</span>
                </span>
              }
              {this.state.columns.length > 2 &&
              <div style={{background: 'whitesmoke', padding: '10px', borderRadius: '5px', width: '98%'}}>
                <div className='form-group m-form__group row'>
                  <label className='col-lg-5 col-form-label'>
                    Select Other columns (Optional)
                  </label>
                </div>
                {
                  this.state.columns.map((column) => {
                    return (<div className='form-group m-form__group row'>
                      <label className='col-lg-5 col-form-label'>
                        {column.value}
                      </label>
                      { this.state.phoneColumn === column || this.state.nameColumn === column
                        ? <div className='col-lg-5'>
                          <input name={column.value} type='checkbox' onChange={this.handleInputChange} checked='true' disabled='true' />
                        </div>
                        : this.state.dict[column.value]
                        ? <div className='col-lg-5'>
                          <input name={column.value} type='checkbox' onChange={this.handleInputChange} checked='true' />
                        </div>
                        : <div className='col-lg-5'>
                          <input name={column.value} type='checkbox' onChange={this.handleInputChange} checked={this.state.dict[column.value]} />
                        </div>
                      }
                    </div>)
                  })
              }
              </div>
            }
              <br />
              <center>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.saveColumns()
                  }} disabled={this.state.phoneColumn === '' || this.state.nameColumn === ''}>Save
                </button>
              </center>
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Customer Base</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding how to upload contacts? Here is the <a href='https://kibopush.com/twilio/' target='_blank'>documentation</a>.
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Upload Contacts
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
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
                            {this.state.fileErrors.length < 1 && <button style={{cursor: 'pointer', marginTop: '20px'}} onClick={() => this.setState({showFileColumns: true})} className='btn m-btn--pill btn-success'>Edit Columns</button>}
                          </div>
                          <span className='m-form__help'>
                            {
                              this.state.fileErrors.map(
                                m => <span style={{color: 'red'}}>{m.errorMsg}</span>
                              )
                            }
                          </span>
                        </div>
                      : this.state.manually
                      ? <div className='m-dropzone dropzone dz-clickable' id='m-dropzone-one'>
                        <center>
                          <div className='tab-pane active col-md-8 col-lg-8 col-sm-8' id='m_widget4_tab1_content'>
                            <div className='m-widget4' >
                              {this.state.manualNumbers && this.state.manualNumbers.length > 0 && this.state.manualNumbers.map((user, i) => (
                                <div className='m-widget4__item' style={{paddingBottom: 0}}>
                                  <div className='m-widget4__info' style={{display: 'inherit'}}>
                                    <span className='m-widget4__title'>
                                      <span>
                                        {user.name}
                                      </span>
                                    </span>
                                    <span className='m-widget4__info'>
                                      <span>
                                        {user.number}
                                      </span>
                                    </span>
                                    <br />
                                  </div>
                                  <div className='m-widget4__ext'>
                                    <i className='fa fa-times-circle' style={{cursor: 'pointer', paddingBottom: '1.5rem'}} onClick={(e) => { this.removeNumber(e, i) }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <input className='form-control m-input' onChange={this.changeName} value={this.state.name} placeholder='Enter name here...' />
                          <br />
                          <input className='form-control m-input' onChange={this.changeNumber} value={this.state.number} placeholder='Enter number here... (e.g. +921122335566)' />
                          {this.state.manualError !== '' &&
                          <div><span style={{color: 'red', paddingLeft: '14px'}}>
                            {this.state.manualError}</span>
                            <br />
                          </div>
                          }
                          <br />
                          <button className='btn btn-primary' onClick={() => { this.addManually() }}>
                            Add
                          </button>
                          <button className='btn btn-primary' onClick={this.clearFields} style={{marginLeft: '10px'}}>
                            Back
                          </button>
                        </center>
                      </div>
                      : <div className='m-dropzone dropzone dz-clickable'
                        id='m-dropzone-one'>
                        <button style={{cursor: 'pointer'}} onClick={() => {
                          this.setState({manually: true})
                        }} className='btn m-btn--pill btn-success'>Enter phone numbers manually</button>
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
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                      <button style={{float: 'right'}} className='btn btn-primary' onClick={this.onSubmit}>
                        Submit
                      </button>
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
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadNumbers,
    uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadContacts)
