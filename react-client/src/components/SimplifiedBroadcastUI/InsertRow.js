import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchWorksheets, fetchColumns } from '../../redux/actions/googleSheets.actions'
import { RingLoader } from 'halogenium'

class InsertRow extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      spreadSheetValue: '',
      workSheetValue: '',
      loadingWorkSheet: false,
      loadingColumns: false
    }

    this.onSpreadSheetChange = this.onSpreadSheetChange.bind(this)
    this.onWorkSheetChange = this.onWorkSheetChange.bind(this)
    this.showMappingData = this.showMappingData.bind(this)

  }

  onSpreadSheetChange (event) {
    this.setState({spreadSheetValue: event.target.value, loadingWorkSheet: true})
    this.props.fetchWorksheets()
  }

  onWorkSheetChange (event) {
    this.setState({workSheetValue: event.target.value, loadingColumns: true})
    this.props.fetchColumns()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.worksheets && nextProps.worksheets.length > 0) {
      this.setState({loadingWorkSheet: false})
    }
    if (nextProps.columns && nextProps.columns.googleSheetColumns && nextProps.columns.googleSheetColumns.length > 0) {
      this.setState({loadingColumns: false})
    }
  }

  showMappingData (googleSheetColumns, kiboPushColumns, customFieldColumns) {
    console.log('this.props.columns', this.props.columns)
    console.log('kiboPushColumns', kiboPushColumns)
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
            <select className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}}>
              <optgroup label='System Fields'>
                {kiboPushColumns.map((kibopush, i) => (
                    <option key={i} value={kibopush}>{kibopush}</option>
                  ))
                }
              </optgroup>
              <optgroup label='Custom Fields'>
                {customFieldColumns.map((custom, i) => (
                    <option key={i} value={custom}>{custom}</option>
                  ))
                }
              </optgroup>
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
    return (
      <div className="modal-content" style={{ width: '687px', top: '100' }}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Edit Google Sheets Actions
            </h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" aria-label="Close">
            <span aria-hidden="true">
              &times;
                </span>
          </button>
        </div>
        <div style={{ textAlign: 'left' }} className="modal-body">
          <h6>Google Sheets: Insert Row</h6><br />
          <span style={{color: '#575962'}}>The first row of the table is used for your column titles. You could easily match KiboPush subscriber data with your columns by titles names.</span>
          <br /><br />
        <label style={{fontWeight: 'normal'}}>Spreadsheet:</label>
          <select className='form-control m-input m-input--square' value={this.state.spreadSheetValue} onChange={this.onSpreadSheetChange}>
            <option key='' value='' disabled>Select a Spreadsheet...</option>
            {
              this.props.spreadSheets.map((spreadSheet, i) => (
                <option key={i} value={spreadSheet}>{spreadSheet}</option>
              ))
            }
          </select>
          <br />
          {this.state.loadingWorkSheet
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : (this.props.worksheets && this.props.worksheets.length > 0 &&
            <div><label style={{fontWeight: 'normal'}}>Worksheet:</label>
            <select className='form-control m-input m-input--square' value={this.state.workSheetValue} onChange={this.onWorkSheetChange}>
              <option key='' value='' disabled>Select a Worksheet...</option>
              {
                this.props.worksheets.map((worksheet, i) => (
                  <option key={i} value={worksheet}>{worksheet}</option>
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
            this.showMappingData(this.props.columns.googleSheetColumns, this.props.columns.kiboPushColumns, this.props.columns.customFieldColumns)
          )
          }
      </div>
      <div className="m-portlet__foot m-portlet__foot--fit">
        <button className="btn btn-primary" style={{float: 'right', margin: '10px'}}>Save</button>
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    worksheets: (state.googleSheetsInfo.worksheets),
    columns: (state.googleSheetsInfo.columns)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchWorksheets,
    fetchColumns
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InsertRow)
