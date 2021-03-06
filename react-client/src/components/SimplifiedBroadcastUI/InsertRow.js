import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchWorksheets, fetchColumns, emptyFields } from '../../redux/actions/googleSheets.actions'
import { RingLoader } from 'halogenium'
import Mapping from './Mapping'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'

class InsertRow extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      spreadSheetValue: props.spreadsheet ? props.spreadsheet : '',
      workSheetValue: props.worksheet ? props.worksheet : '',
      workSheetName: props.worksheetName ? props.worksheetName : '',
      loadingWorkSheet: false,
      loadingColumns: false,
      mappingData: props.mapping ? props.mapping : '',
      buttonDisabled: props.spreadsheet && props.worksheet && props.mapping ? false : true,
      mappingDataValues: ''
    }
    console.log('constructor called')
    this.onSpreadSheetChange = this.onSpreadSheetChange.bind(this)
    this.onWorkSheetChange = this.onWorkSheetChange.bind(this)
    this.showMappingData = this.showMappingData.bind(this)
    this.showMappingDataForUserInput = this.showMappingDataForUserInput.bind(this)
    this.updateMappingData = this.updateMappingData.bind(this)
    this.updateMappingDataUserInput = this.updateMappingDataUserInput.bind(this)
    this.save = this.save.bind(this)
    this.getMappingData = this.getMappingData.bind(this)
  }

  getMappingData () {
    if (this.state.mappingData) {
      if (this.props.questions) {
        return this.state.mappingData.map(data => {
          return {'leftColumn': data.question, 'rightColumn': data.googleSheetColumn}
        })
      } else {
        return this.state.mappingData.map(data => {
          return {'leftColumn': data.customFieldColumn ? data.customFieldColumn : data.kiboPushColumn, 'rightColumn': data.googleSheetColumn}
        })
      }
    }
  }

  componentDidMount () {
    console.log('in componentDidMount of InsertRow', this.props)
    if (this.props.mapping && !this.props.questions) {
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
      this.props.save(this.state.spreadSheetValue, this.state.workSheetValue, this.state.workSheetName, this.state.mappingData)
    }
  }

  updateMappingDataUserInput (e, index) {
    console.log('this.state.mappingData', this.state.mappingData)
    let data = this.state.mappingData
    if (e.target.value !== '') {
      data[index].googleSheetColumn = e.target.value
      this.setState({mappingData: data, buttonDisabled: false})
    }
    console.log('data in updateMappingData', data)
  }

  updateMappingData (e, index) {
    console.log('this.state.mappingData', this.state.mappingData)
    if (this.props.questions) {
      this.updateMappingDataUserInput(e, index)
    } else {
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
      if (this.state.spreadSheetValue !== '' && this.state.workSheetValue !== '' && dataValues !== '' && dataValues.filter(val => val !== '').length > 0) {
        this.setState({buttonDisabled: false})
      }
      console.log('data in updateMappingData', data)
    }
  }

  onSpreadSheetChange (event) {
    this.setState({
      spreadSheetValue: event.target.value,
      loadingWorkSheet: true,
      loadingColumns: false,
      workSheetValue: '',
      mappingData: this.props.questions ? this.state.mappingData : '',
      mappingDataValues: '',
      buttonDisabled: true
    })
    this.props.emptyFields()
    this.props.fetchWorksheets({spreadsheetId: event.target.value})
  }

  onWorkSheetChange (event) {
    let worksheetName = this.props.worksheets.filter(worksheet => worksheet.sheetId.toString() === event.target.value)
    this.setState({
      workSheetValue: event.target.value,
      workSheetName: worksheetName[0].title,
      loadingColumns: true,
      mappingData: this.props.questions ? this.state.mappingData : '',
      mappingDataValues: '',
      buttonDisabled: true
    })
    this.props.fetchColumns({spreadsheetId: this.state.spreadSheetValue, sheetId: event.target.value})
  }

  componentWillMount () {
    console.log('componentWillMount of insert_row', this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps of insert_row', nextProps)
    if (nextProps.worksheets && nextProps.worksheets.length > 0) {
      this.setState({loadingWorkSheet: false})
    }
    if (nextProps.columns && nextProps.columns.googleSheetColumns && nextProps.columns.googleSheetColumns.length > 0) {
      this.setState({loadingColumns: false})
      if (!this.props.questions) {
        let mappingData = []
        let mappingDataValues = []
        for (let i = 0; i < nextProps.columns.googleSheetColumns.length; i++) {
          if(nextProps.columns.googleSheetColumns[i]) {
            mappingData.push({googleSheetColumn: nextProps.columns.googleSheetColumns[i]})
            mappingDataValues.push('')
          }
        }
        console.log('mappingData in UNSAFE_componentWillReceiveProps', mappingData)
        if (this.state.mappingData === '') {
          this.setState({mappingDataValues: mappingDataValues, mappingData: mappingData})
        }
      }
    }
  }

  showMappingDataForUserInput (questions, googleSheetColumns) {
    console.log('showMappingDataForUserInput questions', questions)
    console.log('showMappingDataForUserInput googleSheetColumns', googleSheetColumns)
    console.log('showMappingDataForUserInput mappingData', this.state.mappingData)
    let content = []
    content.push(
      <div className='row'>
        <div className='col-6'>
          <label style={{fontWeight: 'normal'}}>Questions:</label>
        </div>
        <div className='col-1'>
        </div>
        <div className='col-5'>
          <label style={{fontWeight: 'normal'}}>Google Column Titles:</label>
        </div>
      </div>
    )
    for (let i = 0; i < this.props.questions.length; i++) {
      content.push(
        <div>
        <div className='row'>
          <div className='col-6'>
            <input style={{height: '40px'}} type='text' className='form-control' value={questions[i]} disabled />
          </div>
          <div className='col-1'>
            <center>
            <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large'}} />
            </center>
          </div>
          <div className='col-5'>
            <select value={this.state.mappingData[i].googleSheetColumn} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.updateMappingDataUserInput(e, i)}>
              <option key='' value='' disabled>Select a Google Sheet Column...</option>
              {
                googleSheetColumns.map((column, index) =>
                  <option key={index} value={column}>{column}</option>
                )
              }
              </select>
          </div>
        </div>
        <br />
        </div>
      )
    }
    return content
  }

  showMappingData (googleSheetColumns, kiboPushColumns, customFieldColumns) {
    console.log('mappingDataValues', this.state.mappingDataValues)
    if (!this.state.mappingData) {
      return
    }
    if (this.props.questions) {
      return this.showMappingDataForUserInput(this.props.questions, googleSheetColumns)
    } else {
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
        {this.props.reconnectWarning && this.props.reconnectWarning !== ''
        ? <div>
        <div style={{margin: '20px',height: 'auto'}} className="alert alert-danger alert-dismissible fade show   m-alert m-alert--air" role="alert">
        { this.props.reconnectWarning }
          <br />
          Go to Integraions in <Link to='/settings' style={{color:'white', textDecoration: 'underline'}}>Settings</Link> to view google sheet integration status.
        </div>
        </div>
       : <div>
         <div style={{ textAlign: 'left',maxHeight: '500px', overflow: 'scroll'}} className="modal-body">
          <h6>Google Sheets: Insert Row</h6><br />
          <span style={{color: '#575962'}}>The first row of the table is used for your column titles. You could easily match KiboPush subscriber data with your columns by titles names.</span>
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
          {this.state.spreadSheetValue &&
            (this.state.loadingWorkSheet
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
          ))
          }
          <br />
          {
            this.props.columns  &&
            this.props.columns.googleSheetColumns &&
            (this.props.columns.googleSheetColumns.length < 1 || (this.props.columns.googleSheetColumns.length > 0
              && this.props.columns.googleSheetColumns.filter(col => col !== null).length < 1)) &&
            <div>Selected worksheet has no columns</div>
          }
          {this.state.workSheetValue && 
            (this.state.loadingColumns
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : (this.props.columns && this.props.columns.googleSheetColumns.length > 0 && this.props.columns.googleSheetColumns.filter(col => col !== null).length > 1 &&
            <Mapping
              leftColumns = {
                this.props.questions ?
                {
                  groups: false,
                  data: this.props.questions.map(question => { return {value: question, title: question} })
                }
                :
                {
                  groups: true,
                  data: {
                    'System fields': this.props.columns.kiboPushColumns.map(column => { return {value: column.fieldName, title: column.title} }),
                    'Custom fields': this.props.columns.customFieldColumns.map(column => { return {value: column.customFieldId, title: column.title} })
                  }
                }
              }
              rightColumns = {{
                groups: false,
                data: this.props.columns.googleSheetColumns.filter(column => { return column }).map(column => {return {value: column, title: column}})
              }}
              defaultLeftOption = {'Select a Field...'}
              defaultRightOption = {'Select a Google Sheet Column...'}
              leftLabel = {this.props.questions ? 'Questions' : 'KiboPush Data'}
              rightLabel = {'Google Column Titles'}
              mappingData = {this.getMappingData()}
              updateRightColumn = {this.props.questions ? this.updateMappingData : null}
              updateLeftColumn = {this.props.questions ? null : this.updateMappingData}
            />
            //this.showMappingData(this.props.columns.googleSheetColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
          ))
          }
      </div>
        <div className="m-portlet__foot m-portlet__foot--fit">
          <button className="btn btn-primary" disabled={this.state.buttonDisabled} style={{float: 'right', margin: '10px'}} onClick={this.save}>Save</button>
        </div>
       </div>
        }

    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    worksheets: (state.googleSheetsInfo.worksheets),
    columns: (state.googleSheetsInfo.columns),
    spreadsheets: (state.googleSheetsInfo.spreadsheets),
    reconnectWarning: (state.googleSheetsInfo.reconnectWarning)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchWorksheets,
    fetchColumns,
    emptyFields
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InsertRow)
