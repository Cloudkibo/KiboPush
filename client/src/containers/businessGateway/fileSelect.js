import React from 'react'
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
      dict: {},
      selectPage: {},
      selectedRadio: '',
      subscriberIdColumn: '',
      enableSaveColumns: false
    }
    this.parseCSV = this.parseCSV.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.handlePhoneColumn = this.handlePhoneColumn.bind(this)
    this.handleSubscriberId = this.handleSubscriberId.bind(this)
    this.saveColumns = this.saveColumns.bind(this)
    this.closeDialogFileColumns = this.closeDialogFileColumns.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.checkValidation = this.checkValidation.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.selectColumns = this.selectColumns.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
  }
  removeFile () {
    this.setState({ file: '', showFileColumns: false, columns: [], fileContent: [], fileErrors: [], phoneColumn: '', subscriberIdColumn: '', enableSaveColumns: false, dict: {}, selectedRadio: '' })
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'file', null, this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'columns', [], this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'columnsArray', [], this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'phoneColumn', '', this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'subscriberIdColumn', '', this.props.setSaveEnable)
    this.props.updateSegmentationConditions([])
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value,
      enableSaveColumns: false
    })
    if (e.currentTarget.value === 'phoneNumber') {
      if (this.state.subscriberIdColumn !== '') {
        var dict_copy = this.state.dict
        dict_copy[this.state.subscriberIdColumn.value] = false
        this.setState({
          subscriberIdColumn: '',
          dict: dict_copy
        })
      }
    } else if (e.currentTarget.value === 'subscriberId') {
      if (this.state.phoneColumn !== '') {
        var dict_copy = this.state.dict
        dict_copy[this.state.phoneColumn.value] = false
        this.setState({
          phoneColumn: '',
          dict: dict_copy
        })
      }
    }
  }
  handleSubscriberId (value) {
    let dict_copy = this.state.dict
    console.log('this.state.subscriberIdColumn', this.state.subscriberIdColumn)
    if (this.state.subscriberIdColumn !== '') {
      dict_copy[this.state.subscriberIdColumn.value] = false
      this.setState({
        dict: dict_copy
      })
    }
    if (!value) {
      this.setState({
        subscriberIdColumn: '',
        enableSaveColumns: false
      })
    } else {
      this.setState({
        subscriberIdColumn: value,
        phoneColumn: '',
        enableSaveColumns: true
      })
      dict_copy[value.value] = true
      this.setState({
        dict: dict_copy
      })
      console.log('dict_copy', dict_copy)
    }
  }
  selectColumns () {
    var checkList = {}
    for (var i = 0; i < this.props.customersInfo.columns.length; i++) {
      checkList[this.props.customersInfo.columns[i]] = true
    }
    this.setState({
      showFileColumns: true,
      dict: checkList
    })
    if (this.props.customersInfo) {
      if (this.props.customersInfo.phoneColumn !== '') {
        this.setState({
          selectedRadio: 'phoneNumber',
          enableSaveColumns: true,
          phoneColumn: this.props.customersInfo.phoneColumn
        })
      } else if (this.props.customersInfo.subscriberIdColumn !== '') {
        this.setState({
          selectedRadio: 'subscriberId',
          subscriberIdColumn: this.props.customersInfo.subscriberIdColumn,
          enableSaveColumns: true
        })
      }
    } else {
      this.setState({
        enableSaveColumns: false
      })
    }
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
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', page, this.props.setSaveEnable)
    } else {
      this.setState({
        selectPage: {}
      })
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', null, this.props.setSaveEnable)
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
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', this.props.pages[0], this.props.setSaveEnable)
    } else {
      this.setState({
        selectPage: {}
      })
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'page', null, this.props.setSaveEnable)
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
    } else if (this.props.customersInfo.phoneColumn === '' && this.props.customersInfo.subscriberIdColumn === '') {
      this.msg.error('Please select Phone Number or Subscriber Id Column to send a broadcast')
      isValid = false
    }
    return isValid
   // this.redirectToPushMessage()
  }

  saveColumns () {
    console.log('this.state.phoneColumn', this.state.phoneColumn)
    console.log('this.state.subscriberId', this.state.subscriberId)
    console.log('this.state.dict', this.state.dict)

    var columns = []
    for (var property in this.state.dict) {
      if (this.state.dict.hasOwnProperty(property)) {
        if (this.state.dict[property]) {
          if (property !== this.state.phoneColumn.value && property !== this.state.subscriberIdColumn.value) {
            columns.push(property)
          }
        }
      }
    }
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'phoneColumn', this.state.phoneColumn, this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'subscriberIdColumn', this.state.subscriberIdColumn, this.props.setSaveEnable)
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'columns', columns, this.props.setSaveEnable)
    this.props.updateSegmentationConditions(this.state.columns)
    this.setState({
      showFileColumns: false
    })
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
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'file', files[0], this.props.setSaveEnable)
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
        self.props.updateCurrentCustomersInfo(self.props.customersInfo, 'columnsArray', columnsArray, self.props.setSaveEnable)
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
        phoneColumn: '',
        enableSaveColumns: false
      })
    } else {
      this.setState({
        phoneColumn: value,
        subscriberId: '',
        enableSaveColumns: true
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
      columnAlerts: false,
      dict: {},
      enableSaveColumns: false
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
          <ModalContainer style={{width: '750px', top: '100px', overflow: 'hidden'}}
            onClose={this.closeDialogFileColumns}>
            <ModalDialog style={{width: '750px', top: '100px', overflow: 'hidden'}}
              onClose={this.closeDialogFileColumns}>
              <div style={{overflowX: 'hidden', overflowY: 'scroll', width: '720px', height: '400px'}}>
                <div className='form-group m-form__group row' >
                  <div className='radio-buttons' style={{marginLeft: '37px'}}>
                    <div className='radio'>
                      <input id='phoneNumberRadio'
                        type='radio'
                        value='phoneNumber'
                        name='phoneNumber'
                        onChange={this.handleRadioButton}
                        checked={this.state.selectedRadio === 'phoneNumber'} />
                      <label>Use Phone Numbers to send a broadcast</label>
                      <p style={{fontSize: 'small', color: '#97979d'}}>Message will be sent to the customers having their phone numbers linked with Facebook account. Non Subscribers of the selected page will recieve the message in 'Message Requests'</p>
                    </div>
                    { this.state.selectedRadio === 'phoneNumber' && <div>
                      <label>Select 'Phone Number' Column</label>
                      <div style={{width: '36%'}}>
                        <Select
                          options={this.state.columns}
                          onChange={this.handlePhoneColumn}
                          value={this.state.phoneColumn}
                          placeholder='Select Field'
                        />
                        { this.state.columnAlerts && this.state.phoneColumn === '' && <span className='m-form__help' >
                          <span style={{color: 'red'}}>Select a field</span>
                          </span>
                        }
                      </div>
                    </div>
                    }
                    <div className='radio'>
                      <input id='subscriberId'
                        type='radio'
                        value='subscriberId'
                        name='subscriberId'
                        onChange={this.handleRadioButton}
                        checked={this.state.selectedRadio === 'subscriberId'} />
                      <label>Use Subscriber Ids to send a broadcast</label>
                      <p style={{fontSize: 'small', color: '#97979d'}}>Message will be received by subscribers of the selected page</p>
                    </div>

                    { this.state.selectedRadio === 'subscriberId' && <div>
                      <label>Select 'Subscriber Id' Column</label>
                      <div style={{width: '36%'}}>
                        <Select
                          options={this.state.columns}
                          onChange={this.handleSubscriberId}
                          value={this.state.subscriberIdColumn}
                          placeholder='Select Field'
                        />
                      </div>
                    </div>
                    }
                  </div>
                </div>
                <div style={{background: 'whitesmoke', padding: '10px', borderRadius: '5px', width: '98%'}}>
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
                      { this.state.phoneColumn === column || this.state.subscriberIdColumn === column
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
                </div>
                <div className='row' style={{margin: '20px', float: 'right'}}>
                  <button style={{marginRight: '10px'}}
                    className='btn btn-secondary'
                    onClick={() => {
                      this.setState({
                        phoneColumn: '',
                        selectedRadio: '',
                        subscriberIdColumn: '',
                        dict: {}
                      })
                      this.closeDialogFileColumns()
                    }}>Cancel
                  </button>
                  <button
                    className='btn btn-primary'
                    disabled={!this.state.enableSaveColumns}
                    onClick={() => {
                      this.saveColumns()
                    }}>Save
                  </button>
                </div>
              </div>
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
                  {this.state.fileErrors.length < 1 && <button style={{cursor: 'pointer', marginTop: '20px'}} onClick={this.selectColumns} className='btn m-btn--pill btn-success'>Select Columns</button>}
                </div>
              </div>
             : <div className='m-dropzone dropzone dz-clickable' id='m-dropzone-one'>
               <div style={{marginTop: '30px'}}>
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
