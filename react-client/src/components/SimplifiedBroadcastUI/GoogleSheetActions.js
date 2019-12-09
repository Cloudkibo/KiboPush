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
    this.props.removeGoogleAction(this.props.index)
  }

  save (spreadSheetValue, workSheetValue, worksheetName, mappingData, lookUpColumn, lookUpValue) {
    console.log('mappingData in save', mappingData)
    this.props.closeGSModal()
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
    }, this.props.index)
    this.props.emptyFields()
  }

  updateGoogleAction (googleSheetAction, dontShow) {
    console.log('in updateGoogleAction')
    this.setState({googleSheetAction: googleSheetAction, showModal: !(dontShow)}, () => {
      if (this.state.showModal) {
        this.props.toggleGSModal(this.state.showModal, this.openModal())
      } else {
        this.props.toggleGSModal(this.state.showModal, null)
      }
    })
    let title = googleSheetAction === 'insert_row' ? 'Insert Row'
          : googleSheetAction === 'get_row_by_value' ? 'Get Row by Value'
          : googleSheetAction === 'update_row' ? 'Update Row' : ''
    let description = googleSheetAction === 'insert_row' ? 'Send KiboPush Data to Google Sheets'
          : googleSheetAction === 'get_row_by_value' ? 'Return Google Sheets Data to KiboPush'
          : googleSheetAction === 'update_row' ? 'Update Google Sheets with KiboPush Data' : ''
    this.setState({title: title, description: description})
  }

  openModal () {
    console.log('in openModal', this.state.mapping)
    let modals = {
      'insert_row': (<InsertRow save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
        closeGSModal={this.props.closeGSModal}
      />),
      'update_row': (<UpdateRow save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
        lookUpValue={this.state.lookUpValue}
        lookUpColumn={this.state.lookUpColumn}
        closeGSModal={this.props.closeGSModal}
        />),
      'get_row_by_value': (<GetRowByValue save={this.save}
        spreadsheet={this.state.spreadSheet}
    	  worksheet={this.state.worksheet}
        worksheetName={this.state.worksheetName}
    	  mapping={this.state.mapping}
        lookUpValue={this.state.lookUpValue}
        lookUpColumn={this.state.lookUpColumn}
        closeGSModal={this.props.closeGSModal}
        />)
    }
    return modals[this.state.googleSheetAction]
  }
  render () {
    return (
      <div>
        { this.state.title !== ''
        ? <div>
          <div className={this.props.index ? 'google-sheet-close-icon-quick-reply' : 'google-sheet-close-icon'} onClick={this.removeGoogleAction}></div>
          <div className='ui-block'
            style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.07)'}}
            onClick={() => this.updateGoogleAction(this.state.googleSheetAction)} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`} >
            <h6>{this.state.title}
            </h6>
            <span style={{color: '#676c7b'}}>{this.state.description}</span>
          </div>
        </div>
        : <div>
          <span>Select one of the Actions below:</span>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('insert_row')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`}>
              <h6>Insert Row</h6>
              <span style={{color: '#676c7b'}}>Send KiboPush Data to Google Sheets</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('get_row_by_value')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`} >
              <h6>Get Row by Value</h6>
              <span style={{color: '#676c7b'}}>Return Google Sheets Data to KiboPush</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('update_row')} data-toggle='modal' data-target={`#${this.props.GSModalTarget}`} >
              <h6>Update Row</h6>
            <span style={{color: '#676c7b'}}>Update Google Sheets with KiboPush Data</span>
          </div>
        </div>
    }
  </div>
    )
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
