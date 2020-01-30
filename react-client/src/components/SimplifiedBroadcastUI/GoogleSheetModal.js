import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InsertRow from './InsertRow'
import UpdateRow from './UpdateRow'
import GetRowByValue from './GetRowByValue'
import { fetchSpreadSheets, emptyFields } from '../../redux/actions/googleSheets.actions'

class GoogleSheetActions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      description: '',
      googleSheetAction: '',
      spreadSheet: '',
      worksheet: '',
    	mapping: '',
      showModal: false,
      lookUpValue: '',
      lookUpColumn: '',
      worksheetName: ''
    }

    props.fetchSpreadSheets()

    this.updateGoogleAction = this.updateGoogleAction.bind(this)
    this.openModal = this.openModal.bind(this)
    this.save = this.save.bind(this)
    this.removeGoogleAction = this.removeGoogleAction.bind(this)
  }
  componentDidMount () {
    console.log('in componentDidMount of googleSheetAction', this.props)
    if (this.props.googleSheetAction !== '' && this.props.mapping !== '' && this.props.worksheet && this.props.spreadSheet) {
      this.setState({mapping: this.props.mapping, spreadSheet: this.props.spreadSheet, worksheet: this.props.worksheet, worksheetName: this.props.worksheetName, lookUpValue: this.props.lookUpValue, lookUpColumn: this.props.lookUpColumn})
      this.updateGoogleAction(this.props.googleSheetAction, true)
    }
  }
  removeGoogleAction () {
    console.log('in remove googleSheetAction')
    this.setState({googleSheetAction: '',
    spreadSheet: '',
    worksheet: '',
    mapping: '',
    title: '',
    description: '',
    lookUpColumn: '',
    lookUpValue: ''
    })
    this.props.emptyFields()
    this.props.removeGoogleAction()
  }

  save (spreadSheetValue, workSheetValue, worksheetName, mappingData, lookUpColumn, lookUpValue) {
    console.log('mappingData in save', mappingData)
    this.refs.ActionModal.click()
    this.setState({spreadSheet: spreadSheetValue,
    worksheet: workSheetValue,
    worksheetName: worksheetName,
    mapping: mappingData,
    lookUpColumn: lookUpColumn,
    lookUpValue: lookUpValue,
    showModal: false
  })
    this.props.saveGoogleSheet({
      googleSheetAction: this.state.googleSheetAction,
      spreadSheet: spreadSheetValue,
    	worksheet: workSheetValue,
      worksheetName: worksheetName,
    	mapping: mappingData,
      lookUpColumn: lookUpColumn,
      lookUpValue: lookUpValue
    })
  }

  updateGoogleAction (googleSheetAction, dontShow) {
    console.log('in updateGoogleAction')
    this.setState({googleSheetAction: googleSheetAction, showModal: !(dontShow)})
    let title = googleSheetAction === 'insert_row' ? 'Send KiboPush Data to Google Sheets'
          : googleSheetAction === 'get_row_by_value' ? 'Get Row by Value'
          : googleSheetAction === 'update_row' ? 'Update Row' : ''
    let description = googleSheetAction === 'insert_row' ? 'Insert Row'
          : googleSheetAction === 'get_row_by_value' ? 'Return Google Sheets Data to KiboPush'
          : googleSheetAction === 'update_row' ? 'Update Google Sheets with KiboPush Data' : ''
    this.setState({title: title, description: description})
  }

  openModal () {
    console.log('in openModal', this.state.mapping)
    let modals = {
      'insert_row': (<InsertRow 
        save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
      />),
      'update_row': (<UpdateRow 
        save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
        lookUpValue={this.state.lookUpValue}
        lookUpColumn={this.state.lookUpColumn}
        />),
      'get_row_by_value': (<GetRowByValue 
        save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
        lookUpValue={this.state.lookUpValue}
        lookUpColumn={this.state.lookUpColumn} />)
    }
    return modals[this.state.googleSheetAction]
  }
  render () {
    <div>
    <a href='#/' style={{ display: 'none' }} ref='ActionModal' data-toggle='modal' data-target='#ActionModal'>ActionModal</a>
    <div style={{ background: 'rgba(33, 37, 41, 0.6)', width: '72vw' }} className='modal fade' id='ActionModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className='modal-dialog modal-lg' role='document'>
        {this.state.showModal && this.openModal()}
      </div>
    </div>
  </div>
  }
}

function mapStateToProps (state) {
  return {
    spreadsheets: (state.googleSheetsInfo.spreadsheets),
    worksheets: (state.googleSheetsInfo.worksheets),
    columns: (state.googleSheetsInfo.columns)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSpreadSheets,
    emptyFields
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleSheetActions)
