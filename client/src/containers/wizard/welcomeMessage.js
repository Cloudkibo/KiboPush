/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { Link } from 'react-router'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { loadBroadcastDetails, saveBroadcastInformation } from '../../redux/actions/templates.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { createWelcomeMessage, isWelcomeMessageEnabled } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import ViewMessage from '../../components/ViewMessage/viewMessage'

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      stayOpen: false,
      disabled: false,
      pageValue: '',
      stay: false,
      previewMessage: '',
      welcomeMessage: false,
      switchState: false
    }
    props.getuserdetails()
    props.loadSubscribersList()
    props.loadCustomerLists()
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.viewGreetingMessage = this.viewGreetingMessage.bind(this)
    this.closePreviewDialog = this.closePreviewDialog.bind(this)
    this.pageChange = this.pageChange.bind(this)
  }
  componentWillReceiveProps (nextprops) {
    if (this.state.pageValue === '') {
      this.initializeSwitch(nextprops.pages[0].isWelcomeMessageEnabled, nextprops.pages[0]._id)
      this.setState({ switchState: true, pageValue: nextprops.pages[0]._id, welcomeMessage: nextprops.pages[0].isWelcomeMessageEnabled })
      this.setEditComponents(nextprops.pages[0].welcomeMessage)
    }
    //  this.setEditComponents(nextprops.pages[0].welcomeMessage)
  }
  initializeSwitch (state, id) {
    var self = this
    // var temp = '#' + id
    /* eslint-disable */
    $("[name='switch']").bootstrapSwitch({
      /* eslint-enable */
      onText: 'Enabled',
      offText: 'Disabled',
      offColor: 'danger',
      state: state
    })
    /* eslint-disable */
    $("[name='switch']").on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
      if (state === true) {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
      } else {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
      }
    })
  }
  pageChange (event) {
    if (event === null) {
      this.setState({pageValue: event})
      return
    }
    this.setState({pageValue: event.target.value})
    for (var i = 0; i < this.props.pages.length; i++) {
      if (event.target.value === this.props.pages[i]._id) {
        console.log('this.props.pages[i].isWelcomeMessageEnabled', this.props.pages[i].isWelcomeMessageEnabled)
        /* eslint-disable */
        console.log($("[name='switch']").bootstrapSwitch('state'))
        // if ($("[name='switch']").bootstrapSwitch('state') !== this.props.pages[i].isWelcomeMessageEnabled) {
        $("[name='switch']").bootstrapSwitch('state', this.props.pages[i].isWelcomeMessageEnabled, true)
        /* eslint-enable */
        // }
        // console.log($("[name='switch']").bootstrapSwitch('toggleState'))
        this.setState({welcomeMessage: this.props.pages[i].isWelcomeMessageEnabled})
        this.setEditComponents(this.props.pages[i].welcomeMessage)
      }
    }
  }
  setEditComponents (payload) {
    var temp = []
    var message = []
    for (var i = 0; i < payload.length; i++) {
      payload[i].id = temp.length
      if (payload[i].componentType === 'text') {
        temp.push({content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload[i].buttons} removeState={false} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'image') {
        temp.push({content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'audio') {
        temp.push({content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'video') {
        temp.push({content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'file') {
        temp.push({content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'card') {
        temp.push({content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'gallery') {
        temp.push({content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      }
    }
  }
  componentDidMount () {
    document.title = 'KiboPush | Create Broadcast'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }

    this.setState({page: {options: options}})
    //  this.initializePageSelect(options)
    // if (this.props.pages.length > 0) {
    //   this.setState({pageValue: this.props.pages[0].pageId})
    //   this.setEditComponents(this.props.pages[0].welcomeMessage)
    // }
  }
  handleText (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
  }

  handleCard (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].image_url = obj.image_url
        temp[i].fileurl = obj.fileurl
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  sendConvo () {
    if (this.state.broadcast.length === 0) {
      return
    }
    for (let i = 0; i < this.state.broadcast.length; i++) {
      if (this.state.broadcast[i].componentType === 'card') {
        if (!this.state.broadcast[i].buttons) {
          return this.msg.error('Card must have at least one button.')
        } else if (this.state.broadcast[i].buttons.length === 0) {
          return this.msg.error('Card must have at least one button.')
        }
      }
      if (this.state.broadcast[i].componentType === 'gallery') {
        for (let j = 0; j < this.state.broadcast[i].cards.length; j++) {
          if (!this.state.broadcast[i].cards[j].buttons) {
            return this.msg.error('Card in gallery must have at least one button.')
          } else if (this.state.broadcast[i].cards[j].buttons.length === 0) {
            return this.msg.error('Card in gallery must have at least one button.')
          }
        }
      }
    }
    this.props.createWelcomeMessage({_id: this.state.pageValue, welcomeMessage: this.state.broadcast}, this.msg)
    this.setState({stay: true})
  }

  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
   /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: true
    })
    // this.setState({pageValue: pageOptions[0].id})
    // console.log("Setting pageValue in InitPage Select", this.state.pageValue)
    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
    /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedOptions = e.target.selectedOptions[0].value
      // var selected = []
      // for (var i = 0; i < selectedOptions.length; i++) {
      //   var selectedOption = selectedOptions[i].value
      //   selected.push(selectedOption)
      // }
      self.setState({ pageValue: selectedOptions })
      for (var i = 0; i < self.props.pages.length; i++) {
        if (selectedOptions === self.props.pages[i].pageId) {
          self.setEditComponents(this.props.pages[0].welcomeMessage)
        }
      }
    })
  }
  viewGreetingMessage (e) {
    this.setState({showPreview: true})
  }
  closePreviewDialog () {
    this.setState({showPreview: false})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    // const { disabled, stayOpen } = this.state

    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        {
          this.state.showPreview &&
          <ModalContainer style={{top: '100px'}}
            onClose={this.closePreviewDialog}>
            <ModalDialog style={{top: '100px'}}
              onClose={this.closePreviewDialog}>
              <h3>Welcome Message Preview</h3>
              <ViewMessage user={this.props.user} payload={this.state.broadcast} />
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='4' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 4: Welcome Message
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body'>
                          <div className='form-group m-form__group row'>
                            <label style={{fontWeight: 'normal'}}>This page will help you setup welcome message for your page. Welcome message is sent when a subscriber starts the conversation with you by tapping getting started on messenger. We have set a default message for you. Click on "See how it looks" to see how it would look on messenger. Modify it and create your desired welcome message for your messenger susbcribers. Here you can set a welcome message using text component only but you can set a weclome message using image, audio, video, file, cards, and gallery later from our settings page.</label>
                          </div>
                          <br />
                          <div className='form-group m-form__group row'>
                            <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Change Page</label>
                            <div className='col-8 input-group'>
                              <select
                                className='form-control m-input'
                                placeholder='Select a page...'
                                onChange={this.pageChange}
                                style={{width: 'inherit'}}>
                                { this.props.pages.map((page, i) => (
                                (
                                  page.connected &&
                                  <option
                                    value={page._id} name={page.pageName} key={page.pageId} selected={page._id === this.state.pageValue}>{page.pageName}</option>
                                )
                              ))
                              }
                              </select>
                            </div>
                          </div>
                          <br />
                          <center>
                            <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' style={{width: '560px'}} />
                          </center>
                          <div className='row'>
                            <div className='col-lg-6 m--align-left' >
                              {// this.state.switchState &&
                                <div className='row'>
                                  <label style={{fontWeight: 'normal', marginRight: '15px', marginTop: '8px'}}>Welcome Message is currently</label>
                                  <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                                    <div className='bootstrap-switch-container'>
                                      <input data-switch='true' type='checkbox' name='switch' id={this.state.pageValue} data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={this.state.buttonState} />
                                    </div>
                                  </div>
                                  {/* this.initializeSwitch(this.state.welcomeMessage, this.state.pageValue) */}
                                </div>
                              }
                            </div>
                            <div className='col-lg-6 m--align-right'>
                              <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block'}} onClick={this.viewGreetingMessage}>See how it looks </Link>
                              <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                            </div>
                          </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/greetingTextWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div>
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/autopostingWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <span>Next</span>&nbsp;&nbsp;
                                    <i className='la la-arrow-right' />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo),
    user: (state.basicInfo.user),
    broadcastDetails: (state.templatesInfo.broadcastDetails),
    currentBroadcast: (state.templatesInfo.currentBroadcast),
    customerLists: (state.listsInfo.customerLists),
    subscribers: (state.subscribersInfo.subscribers)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      loadBroadcastDetails: loadBroadcastDetails,
      saveBroadcastInformation: saveBroadcastInformation,
      createWelcomeMessage: createWelcomeMessage,
      loadCustomerLists: loadCustomerLists,
      loadSubscribersList: loadSubscribersList,
      isWelcomeMessageEnabled: isWelcomeMessageEnabled,
      loadMyPagesList: loadMyPagesList
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
