/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { validateFields } from '../convo/utility'
import AlertContainer from 'react-alert'
import { saveSecondReply } from '../../redux/actions/commentCapture.actions'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'

class CommentCaptureEdit extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview'],
      broadcast: this.props.secondReply ? this.props.secondReply.payload : [],
      convoTitle: 'Create Second Reply',
      itemMenus: [],
      pageId: this.props.pages.filter((page) => page._id === this.props.secondReply.pageId)[0].pageId
    }

    this.gotoCommentCapture = this.gotoCommentCapture.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }
  saveMessage () {
    var secondReply = {
      pageId: this.props.secondReply.pageId,
      payload: this.state.broadcast.length > 0 ? this.state.broadcast: []
    }
    console.log('Second Reply Payload', secondReply)
    this.props.saveSecondReply(secondReply)
    this.msg.success('Message saved successfully')
  }
  gotoCommentCapture () {
    this.props.history.push({
      pathname: `/createPost`,
      state: {action: 'secondreply'}
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Second Reply`
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
      <div style={{width: '100%'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content' style={{marginBottom: '-30px'}}>
          <div className='row'>
            <div className='col-12'>
              <div className='pull-right'>
                <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.gotoCommentCapture}>
                Back
              </button>
                <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.saveMessage}>
                Save
              </button>
              </div>
            </div>
          </div>
        </div>
        <GenericMessage
          pageId={this.state.pageId}
          pages={[this.props.secondReply.pageId]}
          broadcast={this.state.broadcast}
          handleChange={this.handleChange}
          convoTitle={this.state.convoTitle}
          buttonActions={this.state.buttonActions} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    secondReply: (state.postsInfo.secondReply),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      saveSecondReply: saveSecondReply
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentCaptureEdit)