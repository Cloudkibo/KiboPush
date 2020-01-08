import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchWorksheets, fetchColumns, emptyFields } from '../../redux/actions/googleSheets.actions'
import { RingLoader } from 'halogenium'
import AlertContainer from 'react-alert'

class UpdateRow extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      spreadSheetValue: props.spreadsheet !== '' ? props.spreadsheet : '',
      workSheetValue: props.worksheet !== '' ? props.worksheet : '',
      workSheetName: props.worksheetName !== '' ? props.worksheetName : '',
      loadingWorkSheet: false,
      loadingColumns: false,
      mappingData: props.mapping !== '' ? props.mapping : '',
      buttonDisabled: props.spreadsheet !== '' && props.worksheet !== '' && props.mapping !== '' ? false : true,
      mappingDataValues: '',
      lookUpValue: props.lookUpValue !== '' ? props.lookUpValue : '',
      lookUpColumn: props.lookUpColumn !== '' ? props.lookUpColumn : '',
      showMapping: props.lookUpValue !== '' ? true : false,
      showLookUpValue: props.worksheet !== '' ? true : false,
    }
    this.onSpreadSheetChange = this.onSpreadSheetChange.bind(this)
    this.onWorkSheetChange = this.onWorkSheetChange.bind(this)
    this.showMappingData = this.showMappingData.bind(this)
    this.updateMappingData = this.updateMappingData.bind(this)
    this.onLookUpColumnChange = this.onLookUpColumnChange.bind(this)
    this.onLookUpValueChange = this.onLookUpValueChange.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount () {
    console.log('in componentDidMount of UpdateRow', this.props)
    if (this.props.mapping !== '') {
      let mappingDataValues = [].concat(this.props.mapping)
      for (let i = 0; i < this.props.mapping.length; i++) {
        if (this.props.mapping[i].kiboPushColumn) {
          mappingDataValues[i] = this.props.mapping[i].kiboPushColumn
        } else if (this.props.mapping[i].customFieldColumn) {
          mappingDataValues[i] = this.props.mapping[i].customFieldColumn
        } else {
          mappingDataValues[i] = ''
        }
      }
      console.log('temp mappingDataValues', mappingDataValues)
      this.setState({mappingDataValues: mappingDataValues})
    }
    if (this.props.spreadsheet) {
      this.setState({loadingWorkSheet: true})
      this.props.fetchWorksheets({spreadsheetId: this.props.spreadsheet})
    }
    if (this.props.worksheet) {
      this.setState({loadingColumns: true})
      this.props.fetchColumns({spreadsheetId: this.props.spreadsheet, sheetId: this.props.worksheet})
    }
  }

  save () {
    if (this.state.spreadSheetValue === '' || this.state.workSheetValue === '') {
      this.msg.error('Please fill all the required fields')
    } else {
      this.props.save(this.state.spreadSheetValue, this.state.workSheetValue, this.state.workSheetName, this.state.mappingData, this.state.lookUpColumn, this.state.lookUpValue)
    }
  }

  updateMappingData (e, index) {
    console.log('this.state.mappingData', this.state.mappingData)
    let data = this.state.mappingData
    let dataValues = this.state.mappingDataValues
    if (e.target.value !== '') {
      if (e.target.value.match(/^[0-9a-fA-F]{24}$/)) {
        data[index].customFieldColumn = e.target.value
      } else {
        data[index].kiboPushColumn = e.target.value
      }
      dataValues[index] = e.target.value
      this.setState({mappingData: data, mappingDataValues: dataValues})
    }
    console.log('data in updateMappingData', data)
  }

  onSpreadSheetChange (event) {
    this.setState({
      spreadSheetValue: event.target.value, 
      loadingWorkSheet: true, 
      loadingColumns: false,
      workSheetValue: '', 
      mappingData: '', 
      mappingDataValues: '',
      lookUpColumn: '',
      lookUpValue: '',
      showLookUpValue: false,
      showMapping: false
    })
    this.props.emptyFields()
    this.props.fetchWorksheets({spreadsheetId: event.target.value})
    if (event.target.value !== '' && this.state.workSheetValue !== '' && this.state.lookUpColumn !== '' && this.state.lookUpValue !== '') {
      this.setState({buttonDisabled: false})
    }
  }

  onWorkSheetChange (event) {
    let worksheetName = this.props.worksheets.filter(worksheet => worksheet.sheetId.toString() === event.target.value)
    this.setState({
      workSheetValue: event.target.value, 
      workSheetName: worksheetName[0].title, 
      loadingColumns: true,
      mappingData: '', 
      mappingDataValues: '',
      lookUpColumn: '',
      lookUpValue: '',
      showLookUpValue: false,
      showMapping: false
    })
    this.props.fetchColumns({spreadsheetId: this.state.spreadSheetValue, sheetId: event.target.value})
    if (event.target.value !== '' && this.state.spreadSheetValue !== '' && this.state.lookUpColumn !== '' && this.state.lookUpValue !== '') {
      this.setState({buttonDisabled: false})
    }
  }

  onLookUpColumnChange (event) {
    this.setState({lookUpColumn: event.target.value, showLookUpValue: true})
    if (event.target.value !== '' && this.state.spreadSheetValue !== '' && this.state.workSheetValue !== '' && this.state.lookUpValue !== '') {
      this.setState({buttonDisabled: false})
    }
  }

  onLookUpValueChange (event) {
    this.setState({lookUpValue: event.target.value, showMapping: true})
    if (event.target.value === '') {
      this.setState({buttonDisabled: true})
    } else {
      if (event.target.value !== '' && this.state.spreadSheetValue !== '' && this.state.workSheetValue !== '' && this.state.lookUpColumn !== '') {
        this.setState({buttonDisabled: false})
      }
    }
  }

  componentWillMount () {
    console.log('componentWillMount of insert_row', this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps of insert_row', this.props)
    if (nextProps.worksheets && nextProps.worksheets.length > 0) {
      this.setState({loadingWorkSheet: false})
    }
    if (nextProps.columns && nextProps.columns.googleSheetColumns && nextProps.columns.googleSheetColumns.length > 0) {
      this.setState({loadingColumns: false})
      let mappingData = []
      let mappingDataValues = []
      for (let i = 0; i < nextProps.columns.googleSheetColumns.length; i++) {
        mappingData.push({googleSheetColumn: nextProps.columns.googleSheetColumns[i]})
        mappingDataValues.push('')
      }
      console.log('mappingData in UNSAFE_componentWillReceiveProps', mappingData)
      if (this.state.mappingData === '') {
        this.setState({mappingDataValues: mappingDataValues, mappingData: mappingData})
      }
    }
  }

  showMappingData (googleSheetColumns, kiboPushColumns, customFieldColumns) {
    console.log('mappingDataValues', this.state.mappingDataValues)
    let content = []
    content.push(
      <div className='row'>
        <div className='col-6'>
          <label style={{fontWeight: 'normal'}}>KiboPush Data:</label>
        </div>
        <div className='col-1'>
        </div>
        <div className='col-5'>
          <label style={{fontWeight: 'normal'}}>Google Column Titles:</label>
        </div>
      </div>
    )
    for (let i = 0; i < googleSheetColumns.length; i++) {
      content.push(
        <div>
        <div className='row'>
          <div className='col-6'>
            <select value={this.state.mappingDataValues[i]} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.updateMappingData(e, i)}>
              <option key='' value='' disabled>Select a Field...</option>
              <optgroup label='System Fields'>
                {kiboPushColumns.map((kibopush, i) => (
                    <option key={i} value={kibopush.fieldName}>{kibopush.title}</option>
                  ))
                }
              </optgroup>
              {customFieldColumns.length > 0 &&
                <optgroup label='Custom Fields'>
                {customFieldColumns.map((custom, i) => (
                    <option key={i} value={custom.customFieldId}>{custom.title}</option>
                  ))
                }
              </optgroup>
              }
              </select>
          </div>
          <div className='col-1'>
            <center>
            <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large'}} />
            </center>
          </div>
          <div className='col-5'>
            <input style={{height: '40px'}} type='text' className='form-control' value={googleSheetColumns[i]} disabled />
          </div>
        </div>
        <br />
        </div>
      )
    }
    return content
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('this.props in insert_row', this.props)
    console.log('this.state.mappingData in render', this.state.mappingData)
    return (
      <div className="modal-content" style={{ width: '687px', top: '100' }}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Edit Google Sheets Actions
            </h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" onClick={this.props.closeGSModal} className="close" aria-label="Close">
            <span aria-hidden="true">
              &times;
                </span>
          </button>
        </div>
        <div style={{ textAlign: 'left' }} className="modal-body">
          <h6>Google Sheets: Update Row</h6><br />
          <span style={{color: '#575962'}}>The first row of the table is used for your column titles. In case two or more matches with lookup value, the first row will be updated. Please note, if the match won't be found we'll insert a new row to your spreadsheet.</span>
          <br /><br />
        <label style={{fontWeight: 'normal'}}>Spreadsheet:</label>
          {this.props.spreadsheets && this.props.spreadsheets.length > 0 &&
            <select className='form-control m-input m-input--square' value={this.state.spreadSheetValue} onChange={this.onSpreadSheetChange}>
              <option key='' value='' disabled>Select a Spreadsheet...</option>
              {
                this.props.spreadsheets.map((spreadSheet, i) => (
                  <option key={i} value={spreadSheet.id}>{spreadSheet.name}</option>
                ))
              }
            </select>
          }
          <br />
          {this.state.loadingWorkSheet
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : (this.props.worksheets && this.props.worksheets.length > 0 &&
            <div><label style={{fontWeight: 'normal'}}>Worksheet:</label>
            <select className='form-control m-input m-input--square' value={this.state.workSheetValue} onChange={this.onWorkSheetChange}>
              <option key='' value='' disabled>Select a Worksheet...</option>
              {
                this.props.worksheets.map((worksheet, i) => (
                  <option key={i} value={worksheet.sheetId.toString()}>{worksheet.title}</option>
                ))
              }
            </select>
            </div>
          )
          }
          <br />
            {this.state.loadingColumns
            ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
            : (this.props.columns && this.props.columns.googleSheetColumns.length > 0 &&
              <div><label style={{fontWeight: 'normal'}}>Lookup Column:</label>
              <select className='form-control m-input m-input--square' value={this.state.lookUpColumn} onChange={this.onLookUpColumnChange}>
                <option key='' value='' disabled>Select a Column...</option>
                {
                  this.props.columns.googleSheetColumns.map((column, i) => (
                    <option key={i} value={column}>{column}</option>
                  ))
                }
              </select>
              </div>
            )
            }
            <br />
            {this.state.showLookUpValue && this.props.columns &&
              <div><label style={{fontWeight: 'normal'}}>Lookup Value:</label>
                <select value={this.state.lookUpValue} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={this.onLookUpValueChange}>
                  <option key='' value='' disabled>Select a Value...</option>
                  <optgroup label='System Fields'>
                    {this.props.columns.kiboPushColumns.map((kibopush, i) => (
                        <option key={i} value={kibopush.fieldName}>{kibopush.title}</option>
                      ))
                    }
                  </optgroup>
                  {this.props.columns && this.props.columns.customFieldColumns.length > 0 &&
                    <optgroup label='Custom Fields'>
                    {this.props.columns.customFieldColumns.map((custom, i) => (
                        <option key={i} value={custom.customFieldId}>{custom.title}</option>
                      ))
                    }
                  </optgroup>
                  }
                  </select>
              </div>
            }
            <br />
          {this.state.showMapping &&
          (this.props.columns && this.props.columns.googleSheetColumns.length > 0 &&
            this.showMappingData(this.props.columns.googleSheetColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
          )
          }
      </div>
      <div className="m-portlet__foot m-portlet__foot--fit">
        <button className="btn btn-primary" disabled={this.state.buttonDisabled} style={{float: 'right', margin: '10px'}} onClick={this.save}>Save</button>
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    worksheets: (state.googleSheetsInfo.worksheets),
    columns: (state.googleSheetsInfo.columns),
    spreadsheets: (state.googleSheetsInfo.spreadsheets)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchWorksheets,
    fetchColumns,
    emptyFields
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateRow)
