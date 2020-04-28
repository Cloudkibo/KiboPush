import React from 'react'
import { saveDraft, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'
import { formatAMPM } from '../../utility/utils'
import TextArea from '../../components/sponsoredMessaging/textArea'
import CardArea from '../../components/sponsoredMessaging/cardArea'
import QuickReplies from '../../components/sponsoredMessaging/quickReplies'
import DragSortableList from 'react-drag-sortable'
import Text from '../../components/SimplifiedBroadcastUI/PreviewComponents/Text'
import Card from '../../components/SimplifiedBroadcastUI/PreviewComponents/Card'
import PreviewQuickReplies from '../../components/sponsoredMessaging/previewQuickReplies'
import { loadTags } from '../../redux/actions/tags.actions'
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { loadCustomFields } from '../../redux/actions/customFields.actions'
import { getIntegrations } from '../../redux/actions/settings.actions'

class Ad extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: this.props.sponsoredMessage.payload && this.props.sponsoredMessage.payload[0] ? this.props.sponsoredMessage.payload[0].text : '',
      card: {},
      buttons: props.sponsoredMessage.payload && props.sponsoredMessage.payload.length > 0 ? props.sponsoredMessage.payload[props.sponsoredMessage.payload.length - 1].buttons : [],
      quickReplies: props.sponsoredMessage.payload && props.sponsoredMessage.payload.length > 0 ? props.sponsoredMessage.payload[props.sponsoredMessage.payload.length - 1].quickReplies : [],
      selectedFormat: props.sponsoredMessage.payload && props.sponsoredMessage.payload.length > 1 ? 'textAndImage' : 'text',
      selectedAction: props.sponsoredMessage.payload && props.sponsoredMessage.payload.length > 0 && props.sponsoredMessage.payload[props.sponsoredMessage.payload.length - 1].quickReplies && props.sponsoredMessage.payload[props.sponsoredMessage.payload.length - 1].quickReplies.length > 0 ? 'quickReplies' : 'buttons',
      buttonActions: ['open website'],
      broadcast: this.props.sponsoredMessage.payload ? this.props.sponsoredMessage.payload : [{componentType: 'text', text: '', id: 0}],
      list: [],
      adName: this.props.sponsoredMessage.adName ? this.props.sponsoredMessage.adName : '',
      scheduleDateTime: '',
      quickRepliesComponent: null
    }
    this.updateState = this.updateState.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeAdName = this.changeAdName.bind(this)
    this.openScheduleModal = this.openScheduleModal.bind(this)
    this.openCancelScheduleModal = this.openCancelScheduleModal.bind(this)
    this.showScheduledDateTime = this.showScheduledDateTime.bind(this)
    this.handleFormat = this.handleFormat.bind(this)
    this.getItems = this.getItems.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleAction = this.handleAction.bind(this)
    this.updateQuickReplies = this.updateQuickReplies.bind(this)

    this.props.loadCustomFields()
    this.props.loadTags()
    this.props.fetchAllSequence()
    this.props.getIntegrations()

  }

  updateQuickReplies (quickReplies) {
    return new Promise((resolve, reject) => {
      let broadcast
      if (this.state.selectedAction === 'buttons') {
        broadcast = this.appendButtonsToEnd(this.state.broadcast, quickReplies)
        let component = this.getComponent(broadcast[broadcast.length - 1])
        this.updateList(component)
        this.setState({buttons: quickReplies, broadcast}, () => {
          resolve()
        })
      } else {
        broadcast = this.appendQuickRepliesToEnd(this.state.broadcast, quickReplies)
        this.setState({quickReplies, broadcast}, () => {
          resolve()
        })
      }
      this.handleChange({broadcast})
    })
  }

  handleAction (e) {
    this.setState({selectedAction: e.target.value})
    let broadcast = this.state.broadcast
    if (e.target.value === 'buttons') {
      if (broadcast[broadcast.length -1].quickReplies && broadcast[broadcast.length -1].quickReplies.length > 0) {
        delete broadcast[broadcast.length -1].quickReplies
      }
    } else if (e.target.value === 'quickReplies') {
      if (broadcast[broadcast.length -1].buttons && broadcast[broadcast.length -1].buttons.length > 0) {
        delete broadcast[broadcast.length -1].buttons
      }
    }
    this.setState({broadcast: broadcast})
    let component = this.getComponent(broadcast[broadcast.length -1])
    this.updateList(component)
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
  }

  handleCard (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    for (let a = 0; a < temp.length; a++) {
      let data = temp[a]
      if (data.id === obj.id) {
        temp[a].componentType = obj.componentType
        temp[a].componentName = obj.componentName
        temp[a].fileName = obj.fileName
        temp[a].fileurl = obj.fileurl
        temp[a].image_url = obj.image_url
        temp[a].size = obj.size
        temp[a].type = obj.type
        temp[a].title = obj.title
        // temp[a].buttons = obj.buttons
        temp[a].description = obj.description
        isPresent = true
      }
    }
    if (!isPresent) {
      temp.push(obj)
    }

    temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
    temp = this.appendButtonsToEnd(temp, this.state.buttons)
    this.setState({broadcast: temp})
    this.handleChange({broadcast: temp}, obj)
  }

  componentDidMount () {
    if (this.state.broadcast && this.state.broadcast.length > 0) {
      this.initializeList(this.state.broadcast)
    }
  }

  initializeList (broadcast) {
    let temp = []
    for (var i = 0; i < broadcast.length; i++) {
      let component = this.getComponent(broadcast[i]).component
      temp.push({content: component})
    }
    this.setState({list: temp, broadcast})
  }

  getItems () {
    if (this.state.list.length > 0) {
      if (this.state.broadcast[this.state.broadcast.length -1].quickReplies && this.state.broadcast[this.state.broadcast.length -1].quickReplies.length > 0) {
        return this.state.list.concat([{
          content:
            (<PreviewQuickReplies
              quickReplies={this.state.broadcast[this.state.broadcast.length -1].quickReplies}
              currentId={this.state.currentId}
            />)
        }])
      } else {
        return this.state.list
      }
    } else {
      return this.state.list
    }
  }

  handleFormat (e) {
    this.setState({selectedFormat: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'selectedFormat', e.target.value)
    if (e.target.value === 'text') {
      if (this.state.broadcast[1]) {
        let broadcast = this.state.broadcast
        let list = this.state.list
        let quickReplies = broadcast[1].quickReplies
        let buttons = broadcast[1].buttons
        list.splice(1, 1)
        broadcast.splice(1, 1)
        if (quickReplies) {
          broadcast = this.appendQuickRepliesToEnd(broadcast, quickReplies)
        }
        if (buttons) {
          broadcast = this.appendButtonsToEnd(broadcast, buttons)
        }
        let component = this.getComponent(broadcast[0])
        this.updateList(component)
        this.setState({broadcast: broadcast, list: list})
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
      }
    } else if (e.target.value === 'textAndImage') {
      let broadcast = this.state.broadcast
      if (!this.state.broadcast[1]) {
        broadcast.push({componentType: 'card', id: 1})
        let component = this.getComponent(broadcast[1])
        this.updateList(component)
      }
      if (broadcast[0].quickReplies) {
        broadcast = this.appendQuickRepliesToEnd(broadcast, broadcast[0].quickReplies)
        delete broadcast[0].quickReplies
        let component = this.getComponent(broadcast[0])
        this.updateList(component)
        let component1 = this.getComponent(broadcast[1])
        this.updateList(component1)
      }
      if (broadcast[0].buttons) {
        broadcast = this.appendButtonsToEnd(broadcast, broadcast[0].buttons)
        delete broadcast[0].buttons
        let component = this.getComponent(broadcast[0])
        this.updateList(component)
        let component1 = this.getComponent(broadcast[1])
        this.updateList(component1)
      }
      this.setState({broadcast: broadcast})
      this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
    }
  }

  updateState (componentDetails) {
    let component = this.getComponent(componentDetails)
    this.updateList(component)
    component.handler()
   }

   updateList (component) {
     let temp = this.state.list
     let componentIndex = this.state.list.findIndex(item => item.content.props.id === component.component.props.id)
     if (componentIndex < 0) {
       if (component.component.props.id === 0) {
         temp.unshift({content: component.component})
         this.setState({list: temp})
       } else {
         this.setState({list: [...temp, {content: component.component}]})
       }
     } else {
       temp[componentIndex] = {content: component.component}
       this.setState({list: temp})
     }
   }

   handleText (obj) {
     var temp = this.state.broadcast
     var isPresent = false
     for (let a = 0; a < temp.length; a++) {
       let data = temp[a]
       if (data.id === obj.id) {
         temp[a].text = obj.text
        //  if (obj.buttons.length > 0) {
        //    temp[a].buttons = obj.buttons
        //  } else {
        //    delete temp[a].buttons
        //  }
         isPresent = true
       }
     }
     if (!isPresent) {
       if (temp[0]) {
         temp.unshift({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text'})
       } else if (obj.buttons.length > 0) {
         temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text', buttons: obj.buttons})
       } else {
         temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text'})
       }
     }
     this.setState({broadcast: temp})
     this.handleChange({broadcast: temp}, obj)
   }

   appendQuickRepliesToEnd (broadcast, quickReplies) {
     let quickRepliesIndex = broadcast.findIndex(x => !!x.quickReplies)
     if (quickRepliesIndex > -1) {
       delete broadcast[quickRepliesIndex].quickReplies
     }
     broadcast[broadcast.length-1].quickReplies = quickReplies
     return broadcast
   }

   appendButtonsToEnd (broadcast, buttons) {
     let buttonsIndex = broadcast.findIndex(x => !!x.buttons)
     if (buttonsIndex > -1) {
       delete broadcast[buttonsIndex].buttons
     }
     broadcast[broadcast.length-1].buttons = buttons
     return broadcast
   }

   getComponent (broadcast) {
     let componentId = broadcast.id || broadcast.id === 0 ? broadcast.id : new Date().getTime()
     let components = {
       'text': {
         component: (<Text
           id={componentId}
           key={componentId}
           buttons={broadcast.buttons}
           message={broadcast.text}
           />),
         handler: () => {
           this.handleText({
             id: componentId,
             text: broadcast.text,
             buttons: broadcast.buttons ? broadcast.buttons : []
           })
         }
       },
       'card': {
         component: (<Card
           id={componentId}
           card={broadcast.card}
           youtubeLink={broadcast.youtubeLink}
           fileSizeExceeded={broadcast.fileSizeExceeded}
           elementLimit={broadcast.elementLimit}
           componentName={broadcast.componentName}
           header={broadcast.header}
           defaultErrorMsg={broadcast.defaultErrorMsg}
           invalidMsg={broadcast.invalidMsg}
           validMsg={broadcast.validMsg}
           retrievingMsg={broadcast.retrievingMsg}
           buttonTitle={broadcast.buttonTitle}
           validateUrl={broadcast.validateUrl}
           links={broadcast.links}
           fileurl={broadcast.fileurl}
           image_url={broadcast.image_url}
           editComponent={this.showAddComponentModal}
           pageId={this.state.pageId}
           pages={this.props.pages}
           key={componentId}
           handleCard={this.handleCard}
           fileName= {broadcast.fileName}
           type= {broadcast.type}
           size= {broadcast.size}
           buttons={broadcast.buttons}
           img={broadcast.image_url}
           title={broadcast.title}
           onRemove={this.removeComponent}
           singleCard
           buttonActions={this.props.buttonActions}
           replyWithMessage={this.props.replyWithMessage}
           cardDetails={broadcast}
           webviewurl={broadcast.webviewurl}
           elementUrl={broadcast.elementUrl}
           webviewsize={broadcast.webviewsize}
           default_action={broadcast.default_action} />),
         handler: () => {
           this.handleCard({
             id: componentId,
             componentType: 'card',
             componentName:  broadcast.componentName ? broadcast.componentName: 'card',
             title: broadcast.title ? broadcast.title : '',
             description: broadcast.description ? broadcast.description : '',
             fileurl: broadcast.fileurl ? broadcast.fileurl : '',
             image_url: broadcast.image_url ? broadcast.image_url : '',
             fileName: broadcast.fileName ? broadcast.fileName : '',
             type: broadcast.type ? broadcast.type : '',
             size: broadcast.size ? broadcast.size : '',
             buttons: broadcast.buttons ? broadcast.buttons : [],
             deletePayload: broadcast.deletePayload
           })
         }
       }
     }
     return components[broadcast.componentType]
   }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.sponsoredMessage.scheduleDateTime && nextProps.sponsoredMessage.scheduleDateTime !== '') {
      this.setState({scheduleDateTime: new Date(nextProps.sponsoredMessage.scheduleDateTime)})
    } else {
      this.setState({scheduleDateTime: ''})
    }
  }

  changeAdName (e) {
    this.setState({adName: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'adName', e.target.value)
  }

  handleChange (broadcast) {
      if (broadcast.newFiles || broadcast.initialFiles) {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
      } else {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', broadcast)
      }
      this.setState(broadcast)
  }

  handleBack () {
    this.props.changeCurrentStep('adSet')
  }

  openScheduleModal () {
    this.props.scheduleModal.click()
  }

  openCancelScheduleModal () {
    this.props.cancelScheduleModal.click()
  }

  showScheduledDateTime (datetime) {
    let scheduledDateTime = new Date(datetime)
    return `${scheduledDateTime.toDateString()} at ${formatAMPM(scheduledDateTime)}`
  }

  render () {
    return (
      <div style={{display: this.props.currentStep === 'ad' ? 'block' : 'none'}}>
        <h5>Step 04:</h5>
        {this.props.sponsoredMessage.status === 'scheduled' &&
        <div>
          <br />
          <span><b>Note:</b> This Sponsored Broadcast is scheduled to be sent for review on {this.showScheduledDateTime(this.props.sponsoredMessage.scheduleDateTime)}</span>
          <button className='btn btn-secondary btn-sm' style={{marginLeft: '10px'}} onClick={this.openCancelScheduleModal}>
            Cancel
          </button>
          <button className='btn btn-primary btn-sm' style={{marginLeft: '10px'}} onClick={this.props.openScheduleModal}>
            Edit
          </button>
        </div>
        }
        {this.props.sponsoredMessage.status === 'failed' && this.props.sponsoredMessage.errorMessage &&
        <div>
          <br />
          <div className='alert alert-danger' role='alert'>
  					{this.props.sponsoredMessage.errorMessage}
  				</div>
        </div>
        }
        {this.props.sponsoredMessage.status.toLowerCase() === 'with_issues' &&
        this.props.sponsoredMessage.statusFbPayload &&
        <div>
          <br />
          <div className='alert alert-danger' role='alert'>
            { this.props.sponsoredMessage.statusFbPayload.error_message ? this.props.sponsoredMessage.statusFbPayload.error_message : 'Some unknown error occurred in your ad accounts. Please check on Facebook Ads Manager.'}
  				</div>
        </div>
        }
        <br />
        <div className='row'>
          <div className='col-md-7'>
            <div className='form-group m-form__group'>
              <span style={{fontWeight: 'bold'}}>Ad Name:</span>
              <input type='text' className='form-control m-input' placeholder='Enter Ad Name...' onChange={this.changeAdName} value={this.state.adName} style={{width: '85%', display: 'inline-block', marginLeft: '15px'}} />
            </div>
            <br />
            <div className='form-group m-form__group'>
              <label>Format:</label>
                <div className="m-radio-inline" style={{paddingLeft: '30px', display: 'inline'}}>
									<label className="m-radio" style={{fontWeight: 'lighter'}}>
										<input
                      type='radio'
                      value='text'
                      onChange={this.handleFormat}
                      onClick={this.handleFormat}
                      checked={this.state.selectedFormat === 'text'}
                    />
				              Text
                    <span></span>
									</label>
									<label className="m-radio" style={{fontWeight: 'lighter'}}>
										<input
                      type='radio'
                      value='textAndImage'
                      onChange={this.handleFormat}
                      onClick={this.handleFormat}
                      checked={this.state.selectedFormat === 'textAndImage'}
                     />
                      Text and Image
										<span></span>
									</label>
								</div>
            </div>
            <br />
            <TextArea
              updateParentState={this.updateState}
              text={this.state.broadcast[0] ? this.state.broadcast[0].text : ''}
              textArea={this.state.broadcast[0]}
              />
            {this.state.selectedFormat === 'textAndImage' &&
              <CardArea
                updateParentState={this.updateState}
                card={this.state.broadcast[1] ? this.state.broadcast[1] : {}}
                />
            }
            <br />
            <div className='form-group m-form__group'>
              <span style={{fontWeight: 'bold'}}>Actions (Optional):</span>
                <select className='form-control' value={this.state.selectedAction} onChange={this.handleAction}>
                 <option key={1} value={'buttons'}>Buttons</option>
                 <option key={2} value={'quickReplies'}>Quick Replies</option>
             </select>
            </div>
            {this.state.selectedAction === 'quickReplies' ?
              <QuickReplies
                toggleGSModal={this.toggleGSModal}
                closeGSModal={this.closeGSModal}
                customFields={this.props.customFields}
                sequences={this.props.sequences}
                tags={this.props.tags}
                quickReplies={this.state.broadcast[this.state.broadcast.length - 1].quickReplies}
                updateQuickReplies={this.updateQuickReplies}
                currentId={this.state.currentId}
                integrations={this.props.integrations}
                module='quickReplies'
                limit={13}
                className='btn m-btn--pill btn-sm m-btn btn-secondary'
              />
            : <QuickReplies
              toggleGSModal={this.toggleGSModal}
              closeGSModal={this.closeGSModal}
              customFields={this.props.customFields}
              sequences={this.props.sequences}
              tags={this.props.tags}
              quickReplies={this.state.broadcast[this.state.broadcast.length - 1].buttons}
              updateQuickReplies={this.updateQuickReplies}
              currentId={this.state.currentId}
              integrations={this.props.integrations}
              module='buttons'
              limit={3}
              className='btn btn-sm m-btn btn-secondary'
            />
          }
          </div>
          <div className='col-md-5'>
            <div className='iphone-x' style={{height: !this.props.noDefaultHeight ? 90 + 'vh' : null, marginTop: '15px', paddingRight: '10%', paddingLeft: '10%', paddingTop: 100}}>
              <DragSortableList style={{overflowY: 'scroll', height: '75vh'}} items={this.getItems()} dropBackTransitionDuration={0.3} type='vertical' />
            </div>
          </div>
        </div>
        {/*<GenericMessage
            newFiles={this.props.sponsoredMessage.newFiles}
            initialFiles={this.props.initialFiles}
            module = 'sponsorMessaging'
            hiddenComponents={['media','audio','file','video']}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            pageId={this.props.sponsoredMessage.pageId}
            buttonActions={this.state.buttonActions} />
            */}
        <Footer
          currentStep='ad'
          handleBack={this.handleBack}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    updateSessionTimeStamp: state.sponsoredMessagingInfo.updateSessionTimeStamp,
    customFields: (state.customFieldInfo.customFields),
    sequences: state.sequenceInfo.sequences,
    tags: state.tagsInfo.tags,
    integrations: (state.settingsInfo.integrations)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage,
    saveDraft,
    loadCustomFields,
    fetchAllSequence,
    loadTags,
    getIntegrations
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Ad)
