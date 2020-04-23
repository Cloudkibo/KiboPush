import React from 'react'
import { saveDraft, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { formatAMPM } from '../../utility/utils'
import TextArea from '../../components/sponsoredMessaging/textArea'
import DragSortableList from 'react-drag-sortable'
import Text from '../../components/SimplifiedBroadcastUI/PreviewComponents/Text'
import Card from '../../components/SimplifiedBroadcastUI/PreviewComponents/Card'
import QuickReplies from '../../components/SimplifiedBroadcastUI/QuickReplies'

class Ad extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: this.props.sponsoredMessage.payload[0] ? this.props.sponsoredMessage.payload[0].text : '',
      card: {},
      buttons: [],
      quickReplies: [],
      selectedFormat: 'text',
      selectedAction: props.sponsoredMessage.payload.length > 1 ? 'textAndImage' : 'text',
      buttonActions: ['open website'],
      broadcast: this.props.sponsoredMessage.payload ? this.props.sponsoredMessage.payload : [],
      list: [],
      adName: this.props.sponsoredMessage.adName ? this.props.sponsoredMessage.adName : '',
      scheduleDateTime: ''
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
      console.log('in one')
      if (!this.state.quickRepliesComponent) {
        console.log('in two')
        this.setState({quickRepliesComponent: {
          content:
            (<QuickReplies
              toggleGSModal={this.toggleGSModal}
              closeGSModal={this.closeGSModal}
              customFields={this.props.customFields}
              sequences={this.props.sequences}
              tags={this.props.tags}
              quickReplies={this.state.quickReplies}
              updateQuickReplies={this.updateQuickReplies}
              currentId={this.state.currentId}
            />)
        }})
      } else {
        console.log('in three')
        return this.state.list.concat([this.state.quickRepliesComponent])
      }
    } else {
      console.log('in four')
      return this.state.list
    }
  }

  handleFormat (e) {
    this.setState({selectedFormat: e.target.value})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'selectedFormat', e.target.value)
  }

  updateState (componentDetails) {
    console.log('in updateState', componentDetails)
    let component = this.getComponent(componentDetails)
    this.updateList(component)
    component.handler()
    // this.setState(state)
    // this.preparePayload(state)
   }

   updateList (component) {
     let temp = this.state.list
     let componentIndex = this.state.list.findIndex(item => item.content.props.id === component.component.props.id)
     if (componentIndex < 0) {
       console.log('adding new component')
       console.log({list: [...temp, {content: component.component}]})
       this.setState({list: [...temp, {content: component.component}]})
     } else {
       console.log('editing exisiting component')
       temp[componentIndex] = {content: component.component}
       this.setState({list: temp})
     }
   }

   handleText (obj) {
     console.log('handleText', obj)
     var temp = this.state.broadcast
     var isPresent = false
     for (let a = 0; a < temp.length; a++) {
       let data = temp[a]
       if (data.id === obj.id) {
         temp[a].text = obj.text
         if (obj.buttons.length > 0) {
           temp[a].buttons = obj.buttons
         } else {
           delete temp[a].buttons
         }
         isPresent = true
       }
     }

     if (!isPresent) {
       if (obj.buttons.length > 0) {
         temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text', buttons: obj.buttons})
       } else {
         temp.push({id: obj.id, text: obj.text, componentType: 'text', componentName: 'text'})
       }
     }
    //  temp = this.appendQuickRepliesToEnd(temp, this.state.quickReplies)
     console.log('handleText temp', temp)
     console.log('handleText state', this.state)
     this.setState({broadcast: temp})
     this.handleChange({broadcast: temp}, obj)
   }

   appendQuickRepliesToEnd (broadcast, quickReplies) {
     let quickRepliesIndex = broadcast.findIndex(x => !!x.quickReplies)
     console.log('quickRepliesIndex', quickRepliesIndex)
     if (quickRepliesIndex > -1) {
       delete broadcast[quickRepliesIndex].quickReplies
     }
     broadcast[broadcast.length-1].quickReplies = quickReplies
     console.log('appendQuickRepliesToEnd', broadcast)
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
             youtubeVideo: broadcast.youtubeVideo,
             elementLimit: broadcast.elementLimit,
             header: broadcast.header,
             defaultErrorMsg: broadcast.defaultErrorMsg,
             invalidMsg: broadcast.invalidMsg,
             validMsg: broadcast.validMsg,
             retrievingMsg: broadcast.retrievingMsg,
             buttonTitle: broadcast.buttonTitle,
             validateUrl: broadcast.validateUrl,
             links: broadcast.links,
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
             webviewurl: broadcast.webviewurl,
             elementUrl: broadcast.elementUrl,
             webviewsize: broadcast.webviewsize,
             default_action: broadcast.default_action,
             deletePayload: broadcast.deletePayload
           })
         }
       }
     }
     return components[broadcast.componentType]
   }

   preparePayload (state) {
     let broadcast = this.state.broadcast
     if (state.text) {
       console.log('inside if')
       broadcast[0] = {
         componentType: 'text',
         text: state.text
       }
     } else if (state.text === '') {
       broadcast.splice(0, 1)
     }
     this.setState(broadcast)
     if (broadcast.newFiles || broadcast.initialFiles) {
       this.props.updateSponsoredMessage(this.props.sponsoredMessage, null, null, broadcast)
     } else {
       this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'payload', broadcast)
     }
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
      console.log('handleChange ad', broadcast)
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
    //<TextArea updateParentState={this.updateState} text: {this.state.text} />
    // <CardArea updateParentState={this.updateState} card: {this.state.card} />
    // <Buttons updateParentState={this.updateState} card: {this.state.card} />
    // <QuickReplies updateParentState={this.updateState} card: {this.state.card} />
    // <Preview />
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
              text={this.state.broadcast[0] ? this.state.broadcast[0].text : ''} />
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
    updateSessionTimeStamp: state.sponsoredMessagingInfo.updateSessionTimeStamp
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage,
    saveDraft
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Ad)
