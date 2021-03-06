
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { RingLoader } from 'halogenium'
import Slider from 'react-slick'
import { uploadImage } from '../../redux/actions/convos.actions'
import GoogleSheetActions from './GoogleSheetActions'
import HubspotAction from './hubspot/HubspotActions'
import { getIntegrations } from '../../redux/actions/settings.actions'
import ActionsPopover from './ActionsPopover'

class QuickReplies extends React.Component {
  constructor (props) {
    super(props)
    let actions = []
    if (this.props.module === 'broadcast') {
        actions.push('send_message_block')
    }
    if (this.props.customFields && this.props.customFields.length > 0) {
        actions.push('set_custom_field')
    }
    if (this.props.sequences && this.props.sequences.length > 0) {
        actions.push('subscribe_to_sequence',  'unsubscribe_from_sequence')
    }
    if (this.props.tags && this.props.tags.length > 0) {
        actions.push('assign_tag', 'unassign_tag')
    }
    this.quickReplyLimit = 13
    this.state = {
        actions,
        quickReplies: this.props.quickReplies ? this.props.quickReplies : [],
        addingQuickReply: this.props.addingQuickReply ? this.props.addingQuickReply : false,
        image_url: '',
        addingAction: false,
        currentTitle: '',
        currentActions: [],
        customFields: [],
        index: -1,
        editing: false,
        currentSlideIndex: this.props.quickReplies && this.props.quickReplies.length > 3 ? this.props.quickReplies.length - 3 : 0,
        showGSModal: false,
        deletePayload: []
    }
    props.getIntegrations()
    this.addQuickReply = this.addQuickReply.bind(this)
    this.toggleAddQuickReply = this.toggleAddQuickReply.bind(this)
    this.addAction = this.addAction.bind(this)
    this.closeAddAction = this.closeAddAction.bind(this)
    this.selectAction = this.selectAction.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.getActionTitle = this.getActionTitle.bind(this)
    this.removeAction = this.removeAction.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this._onChange = this._onChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.disableSave = this.disableSave.bind(this)
    this.updateSequence = this.updateSequence.bind(this)
    this.updateTag = this.updateTag.bind(this)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.updateCustomField = this.updateCustomField.bind(this)
    this.saveQuickReply = this.saveQuickReply.bind(this)
    this.editQuickReply = this.editQuickReply.bind(this)
    this.removeQuickReply = this.removeQuickReply.bind(this)
    this.clickFile = this.clickFile.bind(this)
    this.slideIndexChange = this.slideIndexChange.bind(this)
    this.toggleAddAction = this.toggleAddAction.bind(this)
    this.updateCustomFieldValue = this.updateCustomFieldValue.bind(this)
    this.onLoadCustomFields = this.onLoadCustomFields.bind(this)
    this.closeQuickReply = this.closeQuickReply.bind(this)
    this.saveGoogleSheet = this.saveGoogleSheet.bind(this)
    this.savehubSpotForm = this.savehubSpotForm.bind(this)
    this.toggleGSModal = this.toggleGSModal.bind(this)
    this.closeGSModal = this.closeGSModal.bind(this)
    this.removeGoogleAction = this.removeGoogleAction.bind(this)
    this.removeHubspotAction = this.removeHubspotAction.bind(this)
    this.addReplyWithMessage = this.addReplyWithMessage.bind(this)
    this.createQuickReplyActions = this.createQuickReplyActions.bind(this)

    this.GSModalContent = null
    if (this.props.setToggleQuickReply) {
        this.props.setToggleQuickReply(this.toggleAddQuickReply)
    }
    if (this.props.setRemoveQuickReply) {
        this.props.setRemoveQuickReply(this.removeQuickReply)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.integrations && nextProps.integrations.length > 0) {
        let actions = this.state.actions
        let googleIntegration = nextProps.integrations.filter(integration => integration.integrationName === 'Google Sheets' && integration.enabled)
        let hubspotIntegration = nextProps.integrations.filter(integration => integration.integrationName === 'Hubspot'  && integration.enabled)
        if (!actions.includes('google sheets') && googleIntegration && googleIntegration.length > 0) {
            actions.push('google_sheets')
            this.setState({actions})
        }
        if (!actions.includes('hubspot') && hubspotIntegration && hubspotIntegration.length > 0) {
            actions.push('hubspot')
            this.setState({actions})
        }
    }
}

  createQuickReplyActions () {
    let quickReplyActions = []
    for (let i = 0; i < this.state.actions.length; i++) {
      let action = this.state.actions[i]
      if (action === 'send_message_block' && !this.state.openCreateMessage) {
        let replyAction = this.state.currentActions.filter(a => a.action.includes('message'))
        if (replyAction.length === 0) {
          quickReplyActions.push({title: 'Reply with a message', action: () => this.selectAction(action)})
        }
      }
      if (action === 'subscribe_to_sequence') {
        quickReplyActions.push({title: 'Subscribe to sequence', action: () => this.selectAction(action)})
      }
      if (action === 'unsubscribe_from_sequence') {
        quickReplyActions.push({title: 'Unsubscribe from sequence', action: () => this.selectAction(action)})
      }
      if (action === 'set_custom_field') {
        quickReplyActions.push({title: 'Set custom field', action: () => this.selectAction(action)})
      }
      if (action === 'google_sheets') {
        quickReplyActions.push({title: 'Google Sheets', action: () => this.selectAction(action)})
      }
      if (action === 'hubspot') {
        quickReplyActions.push({title: 'Hubspot', action: () => this.selectAction(action)})
      }
      if (action === 'assign_tag') {
        quickReplyActions.push({title: 'Assign Tag', action: () => this.selectAction(action)})
      }
      if (action === 'unassign_tag') {
        quickReplyActions.push({title: 'Unassign Tag', action: () => this.selectAction(action)})
      }
    }
    return quickReplyActions
  }

  toggleGSModal (value, content) {
    this.setState({showGSModal: value})
    this.GSModalContent = content
  }

  closeGSModal () {
    this.setState({showGSModal: false})
    this.refs.ActionModalGS.click()
  }

  componentDidMount () {
    console.log('componentDidMount quickReplies', this.state)
    if (this.state.index === -1) {
        let closeQuickReplyYes = document.getElementById('closeQuickReplyYes')
        if (closeQuickReplyYes) {
            document.getElementById('closeQuickReplyYes').addEventListener('click', () => {
                this.removeQuickReply()
            })
        }
    }
  }

  closeQuickReply () {
      if (!this.state.editing) {
          this.toggleAddQuickReply()
      }
  }

  onLoadCustomFields (customFields) {
      this.setState({customFields})
  }

  toggleAddAction () {
      this.setState({addingAction: !this.state.addingAction})
  }

  clickFile () {
      this.file.click()
  }

  removeQuickReply () {
      let quickReplies = this.state.quickReplies
      let deletePayload = []
      let quickReplyPayload
      if (this.state.index > -1) {
          quickReplyPayload = this.state.quickReplies[this.state.index].payload
          quickReplies.splice(this.state.index, 1)
      }
      if (quickReplyPayload) {
        deletePayload = JSON.parse(quickReplyPayload)
      }
      this.setState({addingQuickReply: false, index: -1, quickReplies, currentTitle: '', image_url: '', currentActions: [], currentSlideIndex: 0, editing: false}, () => {
        if (this.props.updateQuickReplies) {
            this.props.updateQuickReplies(this.state.quickReplies, -1, deletePayload)
        }
      })
  }

  editQuickReply (index) {
      this.setState({
        addingQuickReply: true,
        currentActions: JSON.parse(this.state.quickReplies[index].payload),
        currentTitle: this.state.quickReplies[index].title,
        image_url: this.state.quickReplies[index].image_url,
        index: index,
        editing: false
    }, () => {
        if (this.props.updateQuickReplies) {
            this.props.updateQuickReplies(this.state.quickReplies, index)
                .then(() => {
                    if (this.state.index > -1) {
                        let deleteQuickReplyYes = document.getElementById('deleteQuickReplyYes')
                        if (deleteQuickReplyYes && deleteQuickReplyYes.getAttribute('listener') !== 'true') {
                            deleteQuickReplyYes.addEventListener('click', (e) => {
                                const elementClicked = e.target
                                elementClicked.setAttribute('listener', 'true')
                                this.removeQuickReply()
                            })
                        }
                        let deleteQuickReplyNo = document.getElementById('deleteQuickReplyNo')

                        if (deleteQuickReplyNo && deleteQuickReplyNo.getAttribute('listener') !== 'true') {
                            deleteQuickReplyNo.addEventListener('click', (e) => {
                                const elementClicked = e.target
                                elementClicked.setAttribute('listener', 'true')
                                this.toggleAddQuickReply()
                            })
                        }
                    }
                })
        }
    })
  }

  disableSave () {
      if (!this.state.currentTitle || this.state.addingAction) {
          return true
      }
      for (let i = 0; i < this.state.currentActions.length; i++) {
          if (!this.state.currentActions[i].action &&
            !this.state.currentActions[i].sequenceId &&
            !this.state.currentActions[i].templateId &&
            !this.state.currentActions[i].tagId &&
            !this.state.currentActions[i].customFieldId  &&
            !this.state.currentActions[i].googleSheetAction &&
            !this.state.currentActions[i].hubspotAction) {
              return true
          }
          if (this.state.currentActions[i].customFieldId && !this.state.currentActions[i].customFieldValue) {
              return true
          }
          if (this.state.currentActions[i].googleSheetAction && !this.state.currentActions[i].worksheet && !this.state.currentActions[i].worksheetName) {
              return true
          }
      }
      return false
  }

  saveQuickReply () {
      let quickReplies = this.state.quickReplies
      let id = new Date().getTime() + (Math.floor(Math.random() * 100))
      let quickReply = {
        id,
        content_type: 'text',
        title:  this.state.currentTitle,
        payload: JSON.stringify(this.state.currentActions)
      }
      if (this.state.image_url) {
        quickReply = {
            id,
            content_type: 'text',
            title:  this.state.currentTitle,
            payload: JSON.stringify(this.state.currentActions),
            image_url: this.state.image_url
        }
      }

      if (this.state.index > -1) {
        quickReplies[this.state.index] = quickReply
      } else {
        quickReplies.push(quickReply)
      }
      let deletePayload = JSON.parse(JSON.stringify(this.state.deletePayload))
      this.setState({quickReplies, index: -1, addingQuickReply: false, currentTitle: '', image_url: '', addingAction: false, currentActions: [], editing: false, deletePayload: [] }, () => {
        if (this.props.updateQuickReplies) {
            this.props.updateQuickReplies(this.state.quickReplies, -1, deletePayload)
        }
      })
  }

  _onChange () {
      console.log('in _onChange')
      var file = this.file.files[0]
      if (file) {
        console.log('image file', file)
        this.setState({
          loading: true
        })
        this.props.uploadImage(file, undefined, 'image', {}, this.handleImage)
      }
    }

    handleImage (fileInfo) {
        console.log('finished uploading file', fileInfo)
        this.setState({image_url: fileInfo.image_url, loading: false}, () => {
            this.checkIfEdited()
        })
    }

  changeTitle (e) {
    this.setState({currentTitle: e.target.value}, () => {
        this.checkIfEdited()
    })
  }

  checkIfEdited () {
    if (this.state.currentTitle !== '' || this.state.image_url || this.state.currentActions.length > 0) {
        this.setState({editing: true})
    } else {
        this.setState({editing: false})
    }
  }

  closeAddAction () {
      this.setState({addingAction: false})
  }

  removeAction (index, action) {
    if (action.action.includes('message')) {
      this.setState({deletePayload: [this.state.currentActions[index]]})
    }
    let currentActions = this.state.currentActions
    currentActions.splice(index, 1)
    this.setState({currentActions}, () => {
      this.checkIfEdited()
    })
  }

  removeGoogleAction (index) {
    let currentActions = this.state.currentActions
    currentActions[index].googleSheetAction = ''
    currentActions[index].spreadSheet = ''
    currentActions[index].worksheet = ''
    currentActions[index].worksheetName = ''
    currentActions[index].mapping = ''
    currentActions[index].lookUpValue = ''
    currentActions[index].lookUpColumn = ''
    this.setState({currentActions})
  }

  saveGoogleSheet (googleSheetPayload, index) {
    let currentActions = this.state.currentActions
    currentActions[index].googleSheetAction = googleSheetPayload.googleSheetAction
    currentActions[index].spreadSheet = googleSheetPayload.spreadSheet
    currentActions[index].worksheet = googleSheetPayload.worksheet
    currentActions[index].worksheetName = googleSheetPayload.worksheetName
    currentActions[index].mapping = googleSheetPayload.mapping
    currentActions[index].lookUpValue = googleSheetPayload.lookUpValue
    currentActions[index].lookUpColumn = googleSheetPayload.lookUpColumn
    this.setState({currentActions})
  }

  removeHubspotAction(index) {
    let currentActions = this.state.currentActions
    currentActions[index].hubspotAction = ''
    currentActions[index].formId = ''
    currentActions[index].portalId = ''
    currentActions[index].mapping = ''
    currentActions[index].identityFieldValue = ''
    this.setState({currentActions})
  }

  savehubSpotForm(hubSpotFormPayload, index) {
    let currentActions = this.state.currentActions
    currentActions[index].hubspotAction = hubSpotFormPayload.hubspotAction
    currentActions[index].formId = hubSpotFormPayload.hubSpotForm
    currentActions[index].portalId = hubSpotFormPayload.portalId
    currentActions[index].mapping = hubSpotFormPayload.mapping
    currentActions[index].identityFieldValue = hubSpotFormPayload.identityFieldValue
    this.setState({currentActions})
  }

  updateCustomField (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].customFieldId = event.target.value
    this.setState({currentActions})
  }

  addReplyWithMessage (index) {
    let currentActions = this.state.currentActions
    currentActions[index].blockUniqueId = new Date().getTime() + (Math.floor(Math.random() * 100))
    this.setState({currentActions})
  }

  updateCustomFieldValue (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].customFieldValue = event.target.value
    this.setState({currentActions})
}

  updateSequence (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].sequenceId = event.target.value
    this.setState({currentActions})
  }

  updateTemplate (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].templateId = event.target.value
    this.setState({currentActions})
  }

  updateTag (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].tagId = event.target.value
    this.setState({currentActions})
  }

  getOptions (action, index) {
    if (action.includes('sequence')) {
        return (
            <div>
                <select value={this.state.currentActions[index].sequenceId ? this.state.currentActions[index].sequenceId : ''} style={{borderColor: !this.state.currentActions[index].sequenceId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateSequence(event, index)}>
                    <option value={''} disabled>Select a sequence</option>
                    {
                        this.props.sequences.map((sequence, index) => {
                            return (
                                <option key={index} value={sequence.sequence._id}>{sequence.sequence.name}</option>
                            )
                        })
                    }
                    {/* <option value={'Sequence 1'}>{'Sequence 1'}</option>
                    <option value={'Sequence 2'}>{'Sequence 2'}</option>
                    <option value={'Sequence 3'}>{'Sequence 3'}</option>                                     */}
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].sequenceId ? '*Required' : ''}</div>
            </div>
        )
    } else if (action.includes('message')) {
        return (
            <div>
                {/*<select value={this.state.currentActions[index].templateId ? this.state.currentActions[index].templateId : ''} style={{borderColor: !this.state.currentActions[index].templateId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateTemplate(event, index)}>
                    <option value={''} disabled>Select a message</option>
                    {
                        this.props.broadcasts.map((broadcast, index) => {
                            return (
                                <option key={index} value={broadcast._id}>{broadcast.title}</option>
                            )
                        })
                    }
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].templateId ? '*Required' : ''}</div>*/}
                New message will be created when you click on Save button
            </div>
        )
    } else if (action.includes('tag')) {
        return (
            <div>
                <select value={this.state.currentActions[index].tagId ? this.state.currentActions[index].tagId : ''} style={{borderColor: !this.state.currentActions[index].tagId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateTag(event, index)}>
                    <option value={''} disabled>Select a tag</option>
                    {
                        this.props.tags.map((tag, index) => {
                            return (
                                <option key={index} value={tag._id}>{tag.tag}</option>
                            )
                        })
                    }
                    {/* <option value={'Tag 1'}>{'Tag 1'}</option>
                    <option value={'Tag 2'}>{'Tag 2'}</option>
                    <option value={'Tag 3'}>{'Tag 3'}</option>                                     */}
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].tagId ? '*Required' : ''}</div>
            </div>
        )
    } else if (action.includes('custom')) {
        return (
            <div>
            <select value={this.state.currentActions[index].customFieldId ? this.state.currentActions[index].customFieldId : ''} style={{borderColor: !this.state.currentActions[index].customFieldId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateCustomField(event, index)}>
              <option value={''} disabled>Select a custom field</option>
                <optgroup label='Default Custom Fields'>
                    {
                    this.props.customFields.filter(cf => !!cf.default).map((cf, i) => (
                        <option key={i} value={cf._id}>{cf.name}</option>
                    ))
                    }
                </optgroup>
                    {
                    this.props.customFields.filter(cf => !cf.default).length > 0 &&
                    <optgroup label='User Defined Custom Fields'>
                        {
                        this.props.customFields.filter(cf => !cf.default).map((cf, i) => (
                            <option key={i} value={cf._id}>{cf.name}</option>
                        ))
                        }
                    </optgroup>
                    }
                </select>
                {
                    this.state.currentActions[index].customFieldId &&
                    <div style={{marginTop: '25px'}}>
                        <input style={{borderColor: !this.state.currentActions[index].customFieldValue ? 'red' : ''}} value={this.state.currentActions[index].customFieldValue} onChange={(event) => this.updateCustomFieldValue(event, index)} placeholder='Enter value here...' className='form-control' />
                        <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].customFieldValue ? '*Required' : ''}</div>
                    </div>
                }
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].customFieldId ? '*Required' : ''}</div>
                {/* <button onClick={() => this.props.history.push('/customFields')} id='customfieldid' style={{marginTop: '30px', marginLeft: '10px'}} className='btn btn-primary btn-sm'>
                    Manage Custom Fields
                </button> */}
            </div>
        )
    } else if (action.includes('google')) {
        return (
            <div>
              <GoogleSheetActions
                saveGoogleSheet={this.saveGoogleSheet}
                removeGoogleAction={this.removeGoogleAction}
                googleSheetAction={this.state.currentActions[index].googleSheetAction}
                worksheet={this.state.currentActions[index].worksheet}
                worksheetName={this.state.currentActions[index].worksheetName}
                spreadSheet={this.state.currentActions[index].spreadSheet}
                mapping={this.state.currentActions[index].mapping ? this.state.currentActions[index].mapping :''}
                lookUpValue={this.state.currentActions[index].lookUpValue}
                lookUpColumn={this.state.currentActions[index].lookUpColumn}
                toggleGSModal={this.props.toggleGSModal}
                closeGSModal={this.props.closeGSModal}
                GSModalTarget='ActionModal'
                index={index}
                />
            </div>
        )
    } else if (action.includes('hubspot')) {
        return (
            <div>
              <HubspotAction
                savehubSpotForm={this.savehubSpotForm}
                removeHubspotAction={this.removeHubspotAction}
                hubspotAction={this.state.currentActions[index].hubspotAction ? this.state.currentActions[index].hubspotAction:''}
                hubSpotForm={this.state.currentActions[index].formId ? this.state.currentActions[index].formId : ''}
                portalId={this.state.currentActions[index].portalId ? this.state.currentActions[index].portalId: ''}
                mapping={this.state.currentActions[index].mapping ? this.state.currentActions[index].mapping :''}
                identityFieldValue={this.state.currentActions[index].identityFieldValue ? this.state.currentActions[index].identityFieldValue : ''}
                toggleGSModal={this.props.toggleGSModal}
                closeGSModal={this.props.closeGSModal}
                GSModalTarget='ActionModal'
                index={index}
                />
            </div>
        )
    }
  }

  getActionIcon (action) {
      if (action.includes('sequence')) {
        return 'flaticon-share'
      } else if (action.includes('message')) {
        return 'flaticon-speech-bubble'
      } else if (action.includes('tag')) {
        return 'flaticon-interface-9'
      } else if (action.includes('custom')) {
        return 'flaticon-profile'
      }
  }

  getActionTitle (action) {
      let str = action.replace(/_/g, ' ')
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  addAction () {
      this.setState({addingAction: true})
  }

  selectAction (action) {
      let currentActions = this.state.currentActions
      currentActions.push({action})
      this.setState({selectedAction: action, addingAction: false, currentActions}, () => {
        this.checkIfEdited()
    })
  }

  toggleAddQuickReply () {
      console.log('toggleAddQuickReply', this.state)
      if (!this.state.addingAction) {
        this.setState({index: -1, addingQuickReply: false, currentTitle: '', addingAction: false, currentActions: [], image_url: '', editing: false})
      }
  }

  addQuickReply () {
      console.log('adding quick reply')
      this.setState({addingQuickReply: true})
  }

  slideIndexChange (newIndex) {
      this.setState({currentSlideIndex: newIndex})
  }

  render () {
    console.log('quickReplies props', this.props)
    console.log('quickReplies state', this.state)
    console.log('currentSlideIndex', this.state.currentSlideIndex)
    console.log('this.state.currentActions', this.state.currentActions)
    console.log(this.state.addingQuickReply, this.state.addingQuickReply)
    let settings = {
        dots: false,
        infinite: false,
        speed: 250,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: this.state.quickReplies.length > 1 ? true : false,
        initialSlide: this.state.currentSlideIndex,
        afterChange: this.slideIndexChange
    };
    return (
        <div className='no-drag'>

          <a href='#/' style={{ display: 'none' }} ref='ActionModalGS' data-toggle='modal' data-target='#ActionModalGS'>ActionModal</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: 9999 }} className='modal fade' id='ActionModalGS' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
            <div style={{ transform: 'translate(0, 0)'}} className='modal-dialog modal-lg' role='document'>
              {this.state.showGSModal && this.GSModalContent}
            </div>
          </div>

            <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="closeQuickReply" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div style={{ transform: 'translate(0px, 100px)' }} className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div style={{ display: 'block' }} className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Warning</h5>
                            <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {
                            <div style={{ color: 'black' }} className="modal-body">
                                <p>Are you sure you want to close this quick reply and lose all the data that was entered?</p>
                                <button style={{ float: 'right', marginLeft: '10px' }}
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                    this.toggleAddQuickReply()
                                }} data-dismiss='modal'>Yes
                                </button>
                                    <button style={{ float: 'right' }}
                                    className='btn btn-primary btn-sm'
                                    data-dismiss='modal'>Cancel
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteQuickReply" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div style={{ transform: 'translate(0px, 100px)' }} className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div style={{ display: 'block' }} className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Warning</h5>
                            <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {
                            <div style={{ color: 'black' }} className="modal-body">
                                <p>Do you want to delete this quick reply?</p>
                                <button style={{ float: 'right', marginLeft: '10px' }}
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                    this.removeQuickReply()
                                }} data-dismiss='modal'>Yes
                                </button>
                                <button style={{ float: 'right' }}
                                    className='btn btn-primary btn-sm'
                                    data-dismiss='modal'>No
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* <CustomFields onLoadCustomFields={this.onLoadCustomFields} /> */}
            {this.state.quickReplies.length > 0 &&
                <div style={{maxWidth: '80%'}}>
                    <Slider ref={(instance) => { this.slider = instance }}  {...settings}>
                        {
                            this.state.quickReplies.map((reply, index) => {
                                console.log(`quickReplies index ${index}`, this.state.quickReplies)
                                return (
                                    <div className='btn-toolbar' style={{padding: '10px', visibility: this.state.currentSlideIndex !== index ? 'hidden': 'visible', display: 'flex', flexWrap: 'nowrap'}} key={index}>
                                        <button onClick={() => this.editQuickReply(index)} style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                          {reply.image_url && <img src={reply.image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                          }
                                          {reply.title.length > 20 ? reply.title.slice(0,20)+'...' : reply.title}
                                        </button>

                                        {
                                            (index+1) < this.state.quickReplies.length &&
                                            <button onClick={() => this.editQuickReply(index+1)} style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                              {this.state.quickReplies[index+1].image_url && <img src={this.state.quickReplies[index+1].image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                              }
                                              {this.state.quickReplies[index+1].title}
                                            </button>
                                        }

                                        {
                                            (index+2) < this.state.quickReplies.length &&
                                            <button onClick={() => this.editQuickReply(index+2)} style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                              {this.state.quickReplies[index+2].image_url && <img src={this.state.quickReplies[index+2].image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                              }
                                              {this.state.quickReplies[index+2].title}
                                            </button>
                                        }
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            }

            {
                this.state.quickReplies.length < this.quickReplyLimit &&
                <button id={`addQuickReply-${this.props.currentId}`} onClick={this.addQuickReply} style={{marginLeft: '15%', marginTop: '10px', border: 'dashed', borderWidth: '1.5px', 'color': 'black'}} className="btn m-btn--pill btn-sm m-btn hoverbordercomponent">
                    + Add Quick Reply
                </button>
            }

            <Popover trigger='click' placement='auto' isOpen={this.state.addingQuickReply} target={`addQuickReply-${this.props.currentId}`} className='popoverQuickReplies'>
                <PopoverBody>
                    <div style={{paddingRight: '10px', maxHeight: '500px', overflowY: 'scroll', overflowX: 'hidden'}}>
                    <div data-toggle="modal" data-target={this.state.editing ? "#closeQuickReply" : ""} onClick={this.closeQuickReply} style={{marginLeft: '98%', cursor: 'pointer'}}><span role='img' aria-label='times'>❌</span></div>
                        <div style={{marginBottom: '20px', maxHeight: '100px'}} className='row'>
                            <div className='col-4'>
                                <div onClick={this.clickFile} className='ui-block hoverbordercomponent' style={{height: '75px', width: '75px', borderRadius: '50%', display: 'inline-block'}}>
                                    {
                                    this.state.loading
                                    ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
                                    : <div>
                                        <input
                                        ref={el => { this.file = el }}
                                        type='file'
                                        name='user[image]'
                                        multiple='true'
                                        accept='image/*'
                                        title=' '
                                        onChange={this._onChange} style={{display: 'none'}} />
                                        {
                                            (!this.state.image_url)
                                            ? <div className='align-center' style={{padding: '7px'}}>
                                                <h6 style={{pointerEvents: 'none', zIndex: -1, display: 'inline'}}>Upload Image </h6>
                                            </div>
                                            : <div className='align-center' style={{marginTop: '-12px', marginLeft: '-2px'}}>
                                                <img src={this.state.image_url} style={{pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '75px', height: '75px'}} alt='Text' />
                                            </div>
                                        }
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className='col-8' style={{marginTop: '25px'}}>
                                <input style={{borderColor: this.state.currentTitle === '' ? 'red' : ''}} value={this.state.currentTitle} onChange={this.changeTitle} placeholder='Enter title here...' className='form-control' />
                                <div style={{color: 'red', textAlign: 'left'}}>{this.state.currentTitle === '' ? '*Required' : ''}</div>
                            </div>
                        </div>

                        <h4>Actions:</h4>
                        {
                            this.state.currentActions.map((action, index) => {
                                return (
                                    <div style={{marginTop: '10px', border: '1px solid #d3d3d3'}} className="m-portlet">
                                        <div style={{background: 'lightgrey', height: '3rem', padding: '15px'}} className="m-portlet__head m-portlet--head-solid-bg">
                                            <div className="m-portlet__head-caption">
                                                <div className="m-portlet__head-title">
                                                    <span className="m-portlet__head-icon">
                                                        <i style={{color: 'black'}} className={this.getActionIcon(action.action)}></i>
                                                    </span>
                                                    <h5 style={{fontSize: '1em'}} className="m-portlet__head-text">
                                                        {this.getActionTitle(action.action)}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="m-portlet__head-tools">
                                                <ul className="m-portlet__nav">
                                                    <li className="m-portlet__nav-item">
                                                        <div className="m-portlet__nav-link m-portlet__nav-link--icon">
                                                            <i onClick={() => {this.removeAction(index, action)}} style={{color: 'red', cursor: 'pointer'}} className="la la-close"></i>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="m-portlet__body">
                                            {this.getOptions(action.action, index)}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <ActionsPopover
                            showPopover={this.state.addingAction}
                            togglePopover={this.toggleAddAction}
                            targetId={`addActionButton`}
                            actions={this.createQuickReplyActions()}
                        />
                        <div style={{marginBottom: '10px', marginTop: '20px'}}>
                            <button disabled={this.state.addingAction ? true : null} id="addActionButton" onClick={this.addAction} style={{ border: 'dashed', marginLeft: '30%', borderWidth: '1.5px', 'color': 'black'}} className="btn m-btn--pill btn-sm m-btn hoverbordercomponent">
                                + Add Action
                            </button>
                        </div>
                        <div style={{marginBottom: '10px', marginTop: '20px'}}>
                            <button data-toggle="modal" data-target="#deleteQuickReply" style={{marginLeft: '10px'}} disabled={this.disableSave()} className='btn btn-primary btn-sm'>
                                Delete
                            </button>
                            <button onClick={this.saveQuickReply} style={{float: 'right'}} disabled={this.disableSave()} className='btn btn-primary btn-sm'>
                                Save
                            </button>
                        </div>
                        <div className='m-alert__text' style={{fontSize: '0.9em', marginTop: '25px', marginLeft: '15px'}}>
                            Need help in understanding quick replies? Here is the <a href='http://kibopush.com/quick-replies/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                        </div>

                    </div>
                </PopoverBody>
            </Popover>

        </div>
    )
  }
}

QuickReplies.defaultProps = {
  'sequences': [],
  'tags': []
}


function mapStateToProps (state) {
    console.log(state)
    return {
        integrations: (state.settingsInfo.integrations)
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        uploadImage: uploadImage,
        getIntegrations
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(QuickReplies)
