/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createWelcomeMessage } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { validateFields } from '../convo/utility'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {getFileIdsOfBroadcast, deleteInitialFiles} from '../../utility/utils'

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      broadcast: [],
      initialFiles: this.props.location && this.props.location.state ? getFileIdsOfBroadcast(this.props.location.state.payload) : [],
      selectedPage: [],
      convoTitle: 'Welcome Message',
      buttonActions: ['open website', 'open webview'],
      pageId: this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])[0].pageId,
      linkedMessages: undefined
    }
    this.goBack = this.goBack.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getLinkedMessage = this.getLinkedMessage.bind(this)
  }

  handleChange (broadcast) {
    let array = broadcast.broadcast
    this.setState(broadcast)
    if (array && array.length > 0) {
      if (array[array.length -1].isEmailPhoneComponent && array[array.length - 1].quickReplies[0]) {
        this.setState({linkedMessages: this.getLinkedMessage(array)})
      } else {
        this.setState({linkedMessages: undefined})
      }
    } else {
      this.setState({linkedMessages: undefined})
    }
  }

  saveMessage () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    let initialFiles = this.state.initialFiles
    let currentFiles = getFileIdsOfBroadcast(this.state.broadcast)
    deleteInitialFiles(initialFiles, currentFiles)
    this.setState({newFiles: [], initialFiles: currentFiles})
    let broadcast = this.state.broadcast
    if (broadcast[broadcast.length-1].quickReplies) {
      broadcast[broadcast.length-1].quickReplies = broadcast[broadcast.length-1].quickReplies.map((quickReply) => (
          {
            content_type: quickReply.content_type,
            payload: quickReply.payload,
            title: quickReply.title
          }
        )
      )
    }
    this.props.createWelcomeMessage({_id: this.props.location.state.pages[0], welcomeMessage: broadcast, linkedMessages: this.state.linkedMessages}, this.msg)
  }

  goBack () {
    this.props.history.push({
      pathname: `/welcomeMessage`
    })
  }

  getLinkedMessage(broadcast) {
    return [{
      id: JSON.parse(broadcast[broadcast.length-1].quickReplies[0].payload)[1].blockUniqueId,
      messageContent: [{
        componentName: 'text',
        componentType: 'text',
        id: new Date().getTime(),
        quickReplies: [{
          content_type: 'user_phone_number',
          payload : JSON.stringify([{action: 'set_subscriber_field', fieldName: 'phoneNumber'}]),
          title: 'Phone Number'
        }],
        text: 'Please share your Phone Number with us'
      }],
      title: 'Email Address'
    }]
  }

  componentDidMount () {
    this.props.loadMyPagesList()
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Edit Template`
    this.scrollToTop()
    if (this.props.location.state && this.props.location.state.payload) {
      var data = this.props.location.state.payload
      this.setState({
        broadcast: this.props.location.state.payload,
        linkedMessages: data.length > 0 && data[data.length - 1].isEmailPhoneComponent ? this.getLinkedMessage(data) : undefined
      })
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.pages !== this.props.pages) {
    var pages= nextProps.pages.filter((page) => page._id === this.props.location.state.pages[0])
    this.setState({selectedPage: pages[0].welcomeMessage})
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                          Welcome Message
                        </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <div className='pull-right'>
                      <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.goBack}>
                      Back
                    </button>
                      <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.saveMessage}>
                      Save
                    </button>
                    </div>
                </div>
                </div>
                <GenericMessage
                  pageId={this.state.pageId}
                  newFiles={this.state.newFiles}
                  initialFiles={this.state.initialFiles}
                  pages={this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])}
                  broadcast={this.state.broadcast}
                  handleChange={this.handleChange}
                  convoTitle={this.state.convoTitle}
                  buttonActions={this.state.buttonActions}
                  default_action={this.props.location.state.default_action ? this.props.location.state.default_action : ''}
                  module='welcomeMessage'
                />
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
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createWelcomeMessage: createWelcomeMessage,
      loadMyPagesList: loadMyPagesList
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
