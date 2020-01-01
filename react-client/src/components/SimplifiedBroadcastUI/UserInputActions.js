import React from 'react'
import CustomFields from '../customFields/customfields'
import GoogleSheetActions from './GoogleSheetActions'
import HubspotActions from './hubspot/HubspotActions'

class UserInputActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        openCustomField: false,
        openGoogleSheets: false,
        openHubspot: false,
        questions: this.props.questions,
        openPopover: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.showCustomField = this.showCustomField.bind(this)
    this.showGoogleSheets = this.showGoogleSheets.bind(this)
    this.showHubspot = this.showHubspot.bind(this)
    this.closeGoogleSheets = this.closeGoogleSheets.bind(this)
    this.closeHubspot = this.closeHubspot.bind(this)
    this.closeCustomField = this.closeCustomField.bind(this)
    this.getMappingData = this.getMappingData.bind(this)
  }

  showCustomField() {
    this.setState({ openCustomField: true })
  }

  closeGoogleSheets() {
    this.setState({openGoogleSheets: false})
    this.props.removeAction()
  }

  closeHubspot () {
    this.setState({openHubspot: false})
    this.props.removeAction()
  }

  closeCustomField () {
    this.setState({openCustomField: false})
    this.props.removeAction()
  }

  showGoogleSheets() {
    this.setState({ openGoogleSheets: true })
  }

  showHubspot() {
    this.setState({ openHubspot: true })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps UserInputActions', nextProps)
  }

  getMappingData () {
    if (this.props.questions) {
      let mappingData = []
      for (let i = 0; i < this.props.questions.length; i++) {
        if (this.state.openGoogleSheets) {
          mappingData.push({question: this.props.questions[i], googleSheetColumn: ''})
        }
        if (this.state.openHubspot) {
          mappingData.push({question: this.props.questions[i], hubspotColumn: ''})
        }
      }
      return mappingData
    }
  }


  handleClick (e) {
    this.setState({openPopover: true}, () => {
      document.getElementById('userInputActionsHeading').scrollIntoView({ behavior: 'smooth' })
    })
  }

  handleClose () {
    this.setState({openPopover: false})
    this.props.updateActionStatus({actionDisabled: false})
  }

  render () {
    return (
      <div>
        {
          !this.props.noHeader && <h5 style={{marginBottom: '10px', textAlign: 'left'}}>Action:</h5>
        }
        {
          this.state.openPopover &&
          <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '200px', marginBottom: '30px', padding: '20px'}} >
            <div onClick={this.handleClose} style={{marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer'}}><span role='img' aria-label='times'>❌</span></div>
            <div>
            <h6 id='userInputActionsHeading'>Save user's answers </h6>
            {
                !this.state.openCustomField && !this.state.openGoogleSheets && !this.state.openHubspot &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginTop: '10px'}} onClick={this.showGoogleSheets}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Google Sheets</h7>
                  </div>

                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginTop: '10px'}} onClick={this.showHubspot}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Hubspot</h7>
                  </div>

                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginTop: '10px'}} onClick={this.showCustomField}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Custom Fields</h7>
                  </div>
                </div>
            }
            {
              this.state.openGoogleSheets &&
              <div className='card'>
                <h7 className='card-header'>Google Sheets <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeGoogleSheets} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <GoogleSheetActions
                    questions={this.props.questions}
                    removeGoogleAction={this.props.removeAction}
                    saveGoogleSheet={this.props.saveGoogleSheet}
                    removeGoogleAction={this.removeGoogleAction}
                    googleSheetAction={this.props.action && this.props.action.googleSheetAction ? this.props.action.googleSheetAction : ''}
                    worksheet={this.props.action && this.props.action.worksheet ? this.props.action.worksheet : ''}
                    worksheetName={this.props.action && this.props.action.worksheetName ? this.props.action.worksheetName : ''}
                    spreadSheet={this.props.action && this.props.action.spreadSheet ? this.props.action.spreadSheet : ''}
                    mapping={this.props.action && this.props.action.mapping ? this.props.action.mapping : this.getMappingData()}
                    lookUpValue={this.props.action && this.props.action.lookUpValue ? this.props.action.lookUpValue : ''}
                    lookUpColumn={this.props.action && this.props.action.lookUpColumn ? this.props.action.lookUpColumn : ''}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    GSModalTarget='ActionModal'
                  />
                </div>
              </div>
            }
            {
              this.state.openHubspot &&
              <div className='card'>
                <h7 className='card-header'>Hubspot <i style={{ float: 'right', cursor: 'pointer' }} className='la la-close' onClick={this.closeHubspot} /></h7>
                <div style={{ padding: '10px' }} className='card-block'>
                  <HubspotActions
                    questions={this.props.questions}
                    savehubSpotForm={this.props.savehubSpotForm}
                    hubspotAction={this.props.action && this.props.action.hubspotAction ? this.props.action.hubspotAction : ''}
                    removeHubspotAction={this.props.removeAction}
                    hubSpotForm={this.state.hubSpotForm}
                    portalId={this.state.portalId}
                    mapping={this.props.action && this.props.action.mapping ? this.props.action.mapping : this.getMappingData()}
                    identityFieldValue={this.props.action && this.props.action.identityCustomFieldValue ? this.props.action.identityCustomFieldValue : ''}
                    index={this.props.index}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    GSModalTarget='ActionModal'
                  />
                </div>
              </div>
            }
            </div>
          </div>
        }
        {
          !this.state.openPopover && 
          <div>
            <div className='ui-block hoverborder' style={{ borderColor: this.props.required ? 'red' : '', minHeight: '30px', width: '100%', marginLeft: '0px'}} onClick={this.handleClick}>
              <div ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                <h6> + Add Action </h6>
              </div>
            </div>
            <div style={{color: 'red', textAlign: 'left'}}>{this.props.required ? '*Required' : ''}</div>
          </div>
        }
      </div>
    )
  }
}

export default UserInputActions
