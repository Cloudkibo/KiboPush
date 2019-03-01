import React from 'react'
import { Link } from 'react-router'
import Files from 'react-files'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Select from 'react-select'
import AlertContainer from 'react-alert'
import Papa from 'papaparse'
import Footer from './footer'
import { updateCurrentCustomersInfo } from '../../redux/actions/businessGateway.actions'

class FileSelect extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      customerLists: [],
      showFileColumns: false,
      columns: [],
      fileContent: [],
      fileErrors: [],
      file: '',
      phoneColumn: '',
      columnAlerts: false,
      dict: {},
      selectPage: {}
    }
    this.parseCSV = this.parseCSV.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.handlePhoneColumn = this.handlePhoneColumn.bind(this)
    this.saveColumns = this.saveColumns.bind(this)
    this.closeDialogFileColumns = this.closeDialogFileColumns.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.checkValidation = this.checkValidation.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.handleNext = this.handleNext.bind(this)
  }
  removeFile () {
    this.setState({ file: '', showFileColumns: false, columns: [], fileContent: [], fileErrors: [], phoneColumn: '', columnAlerts: false, dict: {} })
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'file', null)
  }
  handleNext (tab) {
    if (this.checkValidation()) {
      this.props.handleNext(tab)
    }
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
          selectPage: page
        })
      }
      this.props.updateMessageComponents(page)
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', page)
    } else {
      this.setState({
        selectPage: {}
      })
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', null)
    }
  }
  componentDidMount () {
    this.selectPage()
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }
    document.title = `${title} | Business Gateway`;
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        selectPage: this.props.pages[0]
      })
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', this.props.pages[0])
    } else {
      this.setState({
        selectPage: {}
      })
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', null)
    }
  }
  checkValidation () {
    var isValid = true
    if (this.props.customersInfo.file && this.props.customersInfo.file.length === 0) {
      this.msg.error('Please select a file with .CSV extension')
      isValid = false
    } else if (this.state.fileContent.length < 2) {
      this.msg.error('Please select valid file')
      isValid = false
    } else if (this.props.customersInfo.phoneColumn === '') {
      this.msg.error('Please select phone number column')
      isValid = false
    }
    return isValid
   // this.redirectToPushMessage()
  }

  saveColumns () {
    console.log('this.state.phoneColumn', this.state.phoneColumn)
    console.log('this.state.dict', this.state.dict)
    if (this.state.phoneColumn === '') {
      this.setState({
        columnAlerts: true
      })
      return
    }
    var columns = []
    for (var property in this.state.dict) {
      if (this.state.dict.hasOwnProperty(property)) {
        if (this.state.dict[property]) {
          columns.push(property)
        }
      }
    }
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'phoneColumn', this.state.phoneColumn)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'columns', columns)
    this.props.updateSegmentationConditions(this.state.columns)
    this.closeDialogFileColumns()
  }

  onFilesChange (files) {
    var self = this
    if (files.length > 0) {
      this.setState({
        file: files,
        fileErrors: []
      })
      var fileSelected = files[0]
      if (fileSelected.extension !== 'csv') {
        this.setState({
          fileErrors: [{errorMsg: 'Please select a file with .csv extension'}]
        })
        return
      }
      this.parseCSV(self, fileSelected)
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'file', files[0])
    }
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
              columnsArray.push({'value': columns[i], 'label': columns[i]})
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
        console.log('columnsArray:', columnsArray)
        console.log('fileContent:', results.data)
        self.props.updateCurrentCustomersInfo(self.props.customersInfo, 'columnsArray', columnsArray)
      }
    })
  }
  onFilesError (error, file) {
    this.setState({
      fileErrors: [{errorMsg: error.message}]
    })
  }
  handlePhoneColumn (value) {
    let dict_copy = this.state.dict
    console.log('this.state.phoneColumn', this.state.phoneColumn)
    if (this.state.phoneColumn !== '') {
      dict_copy[this.state.phoneColumn.value] = false
      this.setState({
        dict: dict_copy
      })
    }
    if (!value) {
      this.setState({
        phoneColumn: ''
      })
    } else {
      this.setState({
        phoneColumn: value
      })
      dict_copy[value.value] = true
      this.setState({
        dict: dict_copy
      })
      console.log('dict_copy', dict_copy)
    }
  }
  closeDialogFileColumns () {
    this.setState({
      showFileColumns: false,
      columnAlerts: false
    })
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    console.log('value', value)
    console.log('name', name)
    let dict_copy = this.state.dict
    dict_copy[name] = value
    this.setState({
      dict: dict_copy
    })
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.showFileColumns &&
          <ModalContainer style={{width: '680px', top: '100px'}}
            onClose={this.closeDialogFileColumns}>
            <ModalDialog style={{width: '680px', top: '100px'}}
              onClose={this.closeDialogFileColumns}>
              <div className='form-group m-form__group row'>
                <label className='col-lg-5 col-form-label'>
                  Select phone number column
                </label>
                <div className='col-lg-5'>
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
              <div className='form-group m-form__group row'>
                <label className='col-lg-5 col-form-label'>
                  Select Other columns(Optional)
                </label>
              </div>
              {
              this.state.columns.map((column) => {
                return (<div className='form-group m-form__group row'>
                  <label className='col-lg-5 col-form-label'>
                    {column.value}
                  </label>
                  { this.state.phoneColumn === column
                    ? <div className='col-lg-5'>
                      <input name={column.value} type='checkbox' onChange={this.handleInputChange} checked='true' disabled='true' />
                    </div>
                    : <div className='col-lg-5'>
                      <input name={column.value} type='checkbox' onChange={this.handleInputChange} checked={this.state.dict[column.value]} />
                    </div>
                  }
                </div>)
              })
            }
              <button style={{float: 'right', marginLeft: '10px'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.saveColumns()
                }}>Save
              </button>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.setState({
                    phoneColumn: ''
                  })
                  this.closeDialogFileColumns()
                }}>Cancel
              </button>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='form-group m-form__group row'>
          <label className='col-2 col-form-label'>
            Change Page
          </label>
          <div className='col-6'>
            <select className='form-control m-input'value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
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
            { this.state.file !== ''
              ? <div className='m-dropzone dropzone dz-clickable'
                id='m-dropzone-one'>
                <div style={{marginTop: '10%'}}>
                  <span onClick={this.removeFile} style={{float: 'right'}} className='fa-stack'>
                    <i style={{color: '#ccc', cursor: 'pointer'}} className='fa fa-times fa-stack-1x fa-inverse' />
                  </span>
                  <h4><i style={{fontSize: '20px'}} className='fa fa-file-text-o' /> {this.state.file[0].name}</h4>
                  {this.state.fileErrors.length < 1 && <button style={{cursor: 'pointer', marginTop: '20px'}} onClick={() => this.setState({showFileColumns: true})} className='btn m-btn--pill btn-success'>Select Columns</button>}
                </div>
              </div>
             : <div className='m-dropzone dropzone dz-clickable' id='m-dropzone-one'>
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
        <Footer tab='selectFile' handleNext={this.handleNext} />
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    pages: state.pagesInfo.pages,
    customersInfo: state.businessGatewayInfo.customersInfo
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentCustomersInfo: updateCurrentCustomersInfo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FileSelect)
