import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Papa from 'papaparse'
import Select from 'react-select'
import {
  addContactManually,
  updateContact,
  uploadFile,
  saveContacts,
  deleteContact,
  deleteAllInvalidContacts,
  deleteAllContacts
} from '../../redux/actions/contacts.actions'
import PREVIEW from './preview'
import MODAL from '../../components/extras/modal'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'
import FULLSCREENLOADER from '../../components/extras/fullScreenLoader'

class UploadContacts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      nameError: false,
      numberError: false,
      name: '',
      number: '',
      fullScreenLoading: false,
      manualLoading: false,
      loading: false,
      records: props.uploadedContacts,
      columns: [],
      allColumns: [],
      phoneColumn: '',
      nameColumn: '',
      fileData: []
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.onNumberChange = this.onNumberChange.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.handleOnAdd = this.handleOnAdd.bind(this)
    this.disableAddButton = this.disableAddButton.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.parseCSV = this.parseCSV.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
    this.getModalContent = this.getModalContent.bind(this)
    this.handleNameColumn = this.handleNameColumn.bind(this)
    this.handlePhoneColumn = this.handlePhoneColumn.bind(this)
    this.saveColumns = this.saveColumns.bind(this)
    this.processRow = this.processRow.bind(this)
  }

  onNameChange (e) {
    if (e.target.value.length > 30) {
      this.setState({name: e.target.value, nameError: true})
    } else {
      this.setState({name: e.target.value, nameError: false})
    }
  }

  onNumberChange (e) {
    if (e.target.value.length > 15) {
      this.setState({number: e.target.value, numberError: true})
    } else {
      this.setState({number: e.target.value, numberError: false})
    }
  }

  handleFileUpload (res) {
    this.setState({loading: false})
    if (res.status === 'success') {
      this.msg.success('Contacts uploaded successfully!')
      this.props.deleteAllContacts()
    } else {
      this.msg.error(res.description)
    }
  }

  onFileChange (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } else {
        this.setState({phoneColumn: '', nameColumn: '', fullScreenLoading: true})
        this.parseCSV(this, file)
      }
    }
  }

  handleOnAdd (res) {
    if (res.status === 'success') {
      this.setState({name: '', number: '', manualLoading: false})
      this.msg.success('Record added successfully!')
    } else {
      this.setState({manualLoading: false})
      this.msg.error(res.description)
    }
  }

  onAdd () {
    // eslint-disable-next-line
    const regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
    if (regexp.test(this.state.number)) {
      this.setState({manualLoading: true})
      this.props.addContactManually(this.state.name, this.state.number, this.handleOnAdd)
    } else {
      this.setState({numberError: true})
    }
  }

  disableAddButton () {
    if (this.state.name && this.state.number && !this.state.nameError && !this.state.numberError) {
      return false
    } else {
      return true
    }
  }

  onSubmit () {
    const invalidRecords = this.props.uploadedContacts.filter((item) => item.status === 'Invalid')
    if (invalidRecords.length === 0) {
      this.setState({loading: true, name: '', number: ''})
      let rows = [['name', 'number']]
      for (let i = 0; i < this.props.uploadedContacts.length; i++) {
        let contact = this.props.uploadedContacts[i]
        rows.push([contact.name, contact.number])
      }

      let csvFile = ''
      for (let a = 0; a < rows.length; a++) {
        csvFile += this.processRow(rows[a]);
      }

      const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
      const file = new File([blob], 'contacts.csv')

      const fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('phoneColumn', 'number')
      fileData.append('nameColumn', 'name')
      this.props.uploadFile(fileData, this.handleFileUpload)
    } else {
      this.msg.error('Please handle the invalid records first and then submit.')
    }
  }

  onReset () {
    this.setState({name: '', number: ''})
    this.props.deleteAllContacts()
  }

  parseCSV (self, file) {
    Papa.parse(file, {
      complete: function (results) {
        console.log('parseCSV finished:', results.data)
        let faulty = false
        if (results.data && results.data.length > 0) {
          let columnsArray = []
          let columns = results.data[0]
          for (let i = 0; i < columns.length; i++) {
            if (columns[i] !== '') {
              columnsArray.push({'value': columns[i].trim(), 'label': columns[i].trim()})
            } else {
              faulty = true
              break
            }
          }
          if (faulty) {
            this.msg.error('Column name cannot be empty')
            return
          } else {
            self.setState({
              columns: columnsArray,
              allColumns: columnsArray,
              fileData: results.data,
              fullScreenLoading: false
            }, () => {
              self.refs.fileInfo.click()
            })
          }
        }
      }
    })
  }

  getModalContent () {
    return (
      <div>
        <div className='form-group m-form__group row'>
          <span className='col-lg-12 col-form-label'>
            Select column for name
          </span>
          <div className='col-lg-8'>
            <Select
              options={this.state.columns}
              onChange={this.handleNameColumn}
              value={this.state.nameColumn}
              placeholder='Select Column'
            />
          </div>
        </div>
        <div className='form-group m-form__group row'>
          <span className='col-lg-12 col-form-label'>
            Select column for phone number
          </span>
          <div className='col-lg-8'>
            <Select
              options={this.state.columns}
              onChange={this.handlePhoneColumn}
              value={this.state.phoneColumn}
              placeholder='Select Column'
            />
          </div>
        </div>
        <br />
        <center>
          <button
            style={{float: 'right', marginLeft: '10px'}}
            className='btn btn-primary btn-sm'
            onClick={this.saveColumns}
            disabled={!this.state.phoneColumn.value || !this.state.nameColumn.value}
            data-dismiss='modal'
          >
            Save
          </button>
        </center>
      </div>
    )
  }

  handleNameColumn (value) {
    console.log('handleNameColumn', value)
    const columns = this.state.allColumns.filter((c) => c.value !== value.value && c.value !== this.state.phoneColumn.value)
    this.setState({nameColumn: value, columns})
  }

  handlePhoneColumn (value) {
    const columns = this.state.allColumns.filter((c) => c.value !== value.value && c.value !== this.state.nameColumn.value)
    this.setState({phoneColumn: value, columns})
  }

  saveColumns () {
    let contacts = []
    let data = this.state.fileData
    let nameIndex = this.state.allColumns.findIndex((item) => item.value === this.state.nameColumn.value)
    let numberIndex = this.state.allColumns.findIndex((item) => item.value === this.state.phoneColumn.value)
    for (let i = 1; i < data.length; i++) {
      // eslint-disable-next-line
      const regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      if (regexp.test(data[i][numberIndex])) {
        contacts.push({
          name: data[i][nameIndex],
          number: data[i][numberIndex],
          status: 'Valid'
        })
      } else {
        contacts.push({
          name: data[i][nameIndex],
          number: data[i][numberIndex],
          status: 'Invalid'
        })
      }
    }
    this.props.saveContacts(contacts)
  }

  processRow (row) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString()
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString()
      }
      let result = innerValue.replace(/"/g, '""')
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"'
      if (j > 0)
        finalVal += ','
      finalVal += result
    }
    return finalVal + '\n'
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps called')
    if (nextProps.uploadedContacts) {
      this.setState({records: nextProps.uploadedContacts})
    }
    if (nextProps.fileUploaded) {
      this.setState({fileUploaded: true})
    }
  }

  render () {
    console.log('re rendering uploadedContacts')
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

        <button href='#/' style={{ display: 'none' }} ref='fileInfo' data-toggle="modal" data-target="#_columns_mapping" />
        <MODAL
          id='_columns_mapping'
          title='File Information'
          content={this.getModalContent()}
        />

        <button href='#/' style={{ display: 'none' }} ref='resetModal' data-toggle="modal" data-target="#_reset_modal" />
        <CONFIRMATIONMODAL
          id='_reset_modal'
          title='Reset Data'
          description='Are you sure you want to reset data?'
          onConfirm={this.onReset}
        />

        {
          this.state.fullScreenLoading &&
          <FULLSCREENLOADER />
        }
        <div className='m-content'>
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
                  <div className='m-portlet__head-tools'>
                    <button onClick={() => {this.refs.resetModal.click()}} className='btn btn-secondary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                      Reset
                    </button>
                    <button onClick={this.onSubmit} style={{marginLeft: '10px'}} className={`btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill ${this.state.loading && 'm-loader m-loader--light m-loader--left'}`} disabled={this.state.records.length === 0}>
                      Submit
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-md-3'>
                      <div className="form-group m-form__group">
                        <input value={this.state.name} onChange={this.onNameChange} type="text" className="form-control m-input" placeholder="Enter name..." />
                        {
                          this.state.nameError &&
                          <span class="m-form__help m--font-danger">
                            Name can not be greater than 30 characters
                          </span>
                        }
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className="form-group m-form__group">
                        <input value={this.state.number} onChange={this.onNumberChange} type="text" className="form-control m-input" placeholder="Enter number..." />
                        {
                          this.state.numberError &&
                          <span class="m-form__help m--font-danger">
                            Enter a valid number of format E.164
                          </span>
                        }
                      </div>
                    </div>
                    <div className='col-md-2'>
                      <button onClick={this.onAdd} className={`btn btn-primary ${this.state.manualLoading && 'm-loader m-loader--light m-loader--left'}`} disabled={this.disableAddButton()}>
                        Add Manually
                      </button>
                    </div>
                    <div className='col-md-4'>
                      <button onClick={() => {this.refs._select_csv_file.click()}} className='btn btn-success m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill pull-right'>
                        <span><i className='la la-cloud-upload' /> &nbsp; Upload CSV File</span>
                      </button>
                      <input
                        onChange={this.onFileChange}
                        onClick={(e) => {e.target.value = ''}}
                        type='file'
                        ref='_select_csv_file'
                        style={{display: 'none'}}
                        accept='text/csv'
                      />
                    </div>
                  </div>
                  {
                    this.state.records.length > 0
                    ? <PREVIEW
                      validRecords={this.state.records.filter((r) => r.status === 'Valid')}
                      invalidRecords={this.state.records.filter((r) => r.status === 'Invalid')}
                      validCount={this.props.validContactsCount}
                      invalidCount={this.props.invalidContactsCount}
                      updateContact={this.props.updateContact}
                      deleteContact={this.props.deleteContact}
                      deleteAllInvalidContacts={this.props.deleteAllInvalidContacts}
                      alertMsg={this.msg}
                    />
                    : <div style={{justifyContent: 'center', marginTop: '35px'}} className='row'>
                      No data to display
                    </div>
                  }
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
    uploadedContacts: (state.contactsInfo.uploadedContacts),
    validContactsCount: (state.contactsInfo.validContactsCount),
    invalidContactsCount: (state.contactsInfo.invalidContactsCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    addContactManually,
    updateContact,
    uploadFile,
    saveContacts,
    deleteContact,
    deleteAllInvalidContacts,
    deleteAllContacts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadContacts)
