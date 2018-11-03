/**
 * Created by imran on 17/10/2018.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Papa from 'papaparse'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { uploadCustomerInfoFile } from '../../redux/actions/settings.actions'

class ResetPassword extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      columns: [],
      mappedColumns: [],
      selectedColumns: [],
      showDialog: false,
      customerId: '',
      customerFirstName: '',
      customerLastName: '',
      fileData: []
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.parseCSV = this.parseCSV.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onSelectCustomerId = this.onSelectCustomerId.bind(this)
    this.onSelectCustomerFirstName = this.onSelectCustomerFirstName.bind(this)
    this.onSelectCustomerLastName = this.onSelectCustomerLastName.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Upload Customer Information'
  }

  onFileChange (e) {
    this.setState({file: e.target.files[e.target.files.length - 1]}, () => {
      this.parseCSV(this.state.file)
    })
  }

  parseCSV (file) {
    let self = this
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function (results) {
        self.setState({columns: results.data[0], fileData: results.data})
      }
    })
  }

  showDialog (e) {
    e.preventDefault()
    this.setState({showDialog: true})
  }

  closeDialog () {
    this.setState({showDialog: false})
  }

  onSelectCustomerId (e) {
    if (this.state.customerId === '') {
      this.setState({
        customerId: e.target.value,
        selectedColumns: [...this.state.selectedColumns, e.target.value],
        mappedColumns: [...this.state.mappedColumns, {key: 'customerId', value: e.target.value}]
      })
    } else {
      let selectedColumnsTemp = this.state.selectedColumns
      let mappedColumnsTemp = this.state.mappedColumns
      let index = selectedColumnsTemp.indexOf(this.state.customerId)
      selectedColumnsTemp.splice(index, 1, e.target.value)
      index = mappedColumnsTemp.map(c => c.key).indexOf('customerId')
      mappedColumnsTemp.splice(index, 1, {key: 'customerId', value: e.target.value})
      this.setState({
        customerId: e.target.value,
        selectedColumns: selectedColumnsTemp,
        mappedColumns: mappedColumnsTemp
      })
    }
  }

  onSelectCustomerFirstName (e) {
    if (this.state.customerFirstName === '') {
      this.setState({
        customerFirstName: e.target.value,
        selectedColumns: [...this.state.selectedColumns, e.target.value],
        mappedColumns: [...this.state.mappedColumns, {key: 'customerFirstName', value: e.target.value}]
      })
    } else {
      let selectedColumnsTemp = this.state.selectedColumns
      let mappedColumnsTemp = this.state.mappedColumns
      let index = selectedColumnsTemp.indexOf(this.state.customerFirstName)
      selectedColumnsTemp.splice(index, 1, e.target.value)
      index = mappedColumnsTemp.map(c => c.key).indexOf('customerFirstName')
      mappedColumnsTemp.splice(index, 1, {key: 'customerFirstName', value: e.target.value})
      this.setState({
        customerFirstName: e.target.value,
        selectedColumns: selectedColumnsTemp,
        mappedColumns: mappedColumnsTemp
      })
    }
  }

  onSelectCustomerLastName (e) {
    if (this.state.customerLastName === '') {
      this.setState({
        customerLastName: e.target.value,
        selectedColumns: [...this.state.selectedColumns, e.target.value],
        mappedColumns: [...this.state.mappedColumns, {key: 'customerLastName', value: e.target.value}]
      })
    } else {
      let selectedColumnsTemp = this.state.selectedColumns
      let mappedColumnsTemp = this.state.mappedColumns
      let index = selectedColumnsTemp.indexOf(this.state.customerLastName)
      selectedColumnsTemp.splice(index, 1, e.target.value)
      index = mappedColumnsTemp.map(c => c.key).indexOf('customerLastName')
      mappedColumnsTemp.splice(index, 1, {key: 'customerLastName', value: e.target.value})
      this.setState({
        customerLastName: e.target.value,
        selectedColumns: selectedColumnsTemp,
        mappedColumns: mappedColumnsTemp
      })
    }
  }

  uploadFile (e) {
    e.preventDefault()
    this.closeDialog()
    this.setState({file: ''})
    let temp = this.state.fileData
    for (let i = 0; i < this.state.mappedColumns.length; i++) {
      let index = temp[0].indexOf(this.state.mappedColumns[i].value)
      temp[0][index] = this.state.mappedColumns[i].key
    }
    this.props.uploadCustomerInfoFile(this.state.fileData, this.msg)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.showDialog &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <div className='form-group m-form__group'>
                <div className='alert m-alert m-alert--default' role='alert'>
                  Please select columns for Customer ID, Customer First Name, and Customer Last Name.
                </div>
              </div>
              <div className='form-group m-form__group'>
                <select className='custom-select' style={{width: '100%'}} value={this.state.customerId} onChange={this.onSelectCustomerId} >
                  <option value='' disabled>Select cloum for Customer ID...</option>
                  {
                    this.state.columns.map(column => (
                      <option value={column} disabled={this.state.selectedColumns.indexOf(column) !== -1}>{column}</option>
                    ))
                  }
                </select>
              </div>
              <div className='form-group m-form__group'>
                <select className='custom-select' style={{width: '100%'}} value={this.state.customerFirstName} onChange={this.onSelectCustomerFirstName} >
                  <option value='' disabled>Select cloum for Customer First Name...</option>
                  {
                    this.state.columns.map(column => (
                      <option value={column} disabled={this.state.selectedColumns.indexOf(column) !== -1}>{column}</option>
                    ))
                  }
                </select>
              </div>
              <div className='form-group m-form__group'>
                <select className='custom-select' style={{width: '100%'}} value={this.state.customerLastName} onChange={this.onSelectCustomerLastName} >
                  <option value='' disabled>Select cloum for Customer Last Name...</option>
                  {
                    this.state.columns.map(column => (
                      <option value={column} disabled={this.state.selectedColumns.indexOf(column) !== -1}>{column}</option>
                    ))
                  }
                </select>
              </div>
              <div className='form-group m-form__group'>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' onClick={this.uploadFile}>
                  Upload
                </button>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Upload Customer Information
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group'>
                    <div className='alert m-alert m-alert--default' role='alert'>
                      Drop your csv file here. Please make sure it contains columns for Customer ID, Customer First Name,
                      and Customer Last Name.
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <div className='col-lg-4 col-md-9 col-sm-12' />
                    <div className='col-lg-4 col-md-9 col-sm-12'>
                      <div onClick={() => this.refs.selectFile.click()} className='m-dropzone dropzone dz-clickable' id='m-dropzone-one'>
                        {
                          this.state.file === ''
                          ? <div className='m-dropzone__msg dz-message needsclick'>
                            <i style={{fontSize: '50px'}} className='la la-cloud-upload' />
                            <h3 className='m-dropzone__msg-title'>
                              Drop files here or click to upload.
                            </h3>
                          </div>
                          : <div className='m-dropzone__msg dz-message needsclick'>
                            <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
                            <h3 className='m-dropzone__msg-title'>
                              {this.state.file.name}
                            </h3>
                          </div>
                        }
                        <input type='file' accept='.csv' onChange={this.onFileChange} style={{display: 'none'}} ref='selectFile' />
                      </div>
                    </div>
                  </div>
                  <div className='form-group m-form__group'>
                    <button
                      style={{float: 'right'}}
                      className='btn btn-primary btn-sm'
                      onClick={this.showDialog}
                      disabled={this.state.file === ''}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadCustomerInfoFile: uploadCustomerInfoFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
