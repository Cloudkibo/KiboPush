import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InsertRow from './InsertRow'
import UpdateRow from './UpdateRow'
import GetRowByValue from './GetRowByValue'
import { fetchSpreadSheets } from '../../redux/actions/googleSheets.actions'

class GoogleSheetActions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      description: '',
      openTab: '',
      googleSheetAction: ''
    }

    props.fetchSpreadSheets()

    this.updateGoogleAction = this.updateGoogleAction.bind(this)
    this.openModal = this.openModal.bind(this)
  }

  updateGoogleAction (googleSheetAction) {
    this.setState({googleSheetAction: googleSheetAction})
  }

  openModal () {
    let modals = {
      'insert_row': (<InsertRow spreadSheets={this.props.spreadsheets} />),
      'update_row': (<UpdateRow spreadSheets={this.props.spreadsheets} />),
      'get_row_by_value': (<GetRowByValue spreadSheets={this.props.spreadsheets} />)
    }
    return modals[this.state.googleSheetAction]
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps')
    let title = nextProps.googleSheetAction === 'insert_row' ? 'Send KiboPush Data to Google Sheets'
          : nextProps.googleSheetAction === 'get_row_by_value' ? 'Get Row by Value'
          : nextProps.googleSheetAction === 'update_row' ? 'Update Row' : ''
    let description = nextProps.googleSheetAction === 'insert_row' ? 'Insert Row'
          : nextProps.googleSheetAction === 'get_row_by_value' ? 'Return Google Sheets Data to KiboPush'
          : nextProps.googleSheetAction === 'update_row' ? 'Update Google Sheets with KiboPush Data' : ''
    console.log('title value', title)
    console.log('description value', description)
    this.setState({title: title, description: description})
  }
  render () {
    return (
      <div>
        { this.state.title !== ''
        ? <div className='ui-block'
          style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.07)'}}
          onClick={() => this.updateGoogleAction(this.props.googleSheetAction)} >
          <h6>{this.state.title} <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.props.removeGoogleAction} /></h6>
          <span style={{color: '#676c7b'}}>{this.state.description}</span>
        </div>
        : <div>
          <span>Select one of the Actions below:</span>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('insert_row')} data-toggle="modal" data-target="#ActionModal">
              <h6>Insert Row</h6>
              <span style={{color: '#676c7b'}}>Send KiboPush Data to Google Sheets</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('get_row_by_value')} >
              <h6>Get Row by Value</h6>
              <span style={{color: '#676c7b'}}>Return Google Sheets Data to KiboPush</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.updateGoogleAction('update_row')} >
              <h6>Update Row</h6>
            <span style={{color: '#676c7b'}}>Update Google Sheets with KiboPush Data</span>
          </div>
        </div>
    }
    <a href='#/' style={{ display: 'none' }} ref='ActionModal' data-toggle="modal" data-target="#ActionModal">ActionModal</a>
    <div style={{ background: 'rgba(33, 37, 41, 0.6)', width: '72vw' }} className="modal fade" id="ActionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div style={{ transform: 'translate(0, 0)', marginLeft: '13pc' }} className="modal-dialog modal-lg" role="document">
        {this.state.googleSheetAction !== '' && this.openModal()}
      </div>
    </div>
  </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    spreadsheets: (state.googleSheetsInfo.spreadsheets)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSpreadSheets
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleSheetActions)
