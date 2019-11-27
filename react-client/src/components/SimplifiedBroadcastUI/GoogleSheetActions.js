import React from 'react'

class GoogleSheetActions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: '',
      description: ''
    }
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
          onClick={() => this.props.updateGoogleAction(this.props.googleSheetAction)} >
          <h6>{this.state.title} <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.props.removeGoogleAction} /></h6>
          <span style={{color: '#676c7b'}}>{this.state.description}</span>
        </div>
        : <div>
          <span>Select one of the Actions below:</span>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.props.updateGoogleAction('insert_row')} >
              <h6>Insert Row</h6>
              <span style={{color: '#676c7b'}}>Send KiboPush Data to Google Sheets</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.props.updateGoogleAction('get_row_by_value')} >
              <h6>Get Row by Value</h6>
              <span style={{color: '#676c7b'}}>Return Google Sheets Data to KiboPush</span>
            </div>
            <div className='ui-block'
              style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', padding: '18px', textAlign: 'left', cursor: 'pointer'}}
              onClick={() => this.props.updateGoogleAction('update_row')} >
              <h6>Update Row</h6>
            <span style={{color: '#676c7b'}}>Update Google Sheets with KiboPush Data</span>
          </div>
        </div>
    }
  </div>
    )
  }
}

export default GoogleSheetActions
