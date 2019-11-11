/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { saveCurrentPost } from '../../redux/actions/commentCapture.actions'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'

class CommentCaptureEdit extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview'],
      broadcast: [],
      convoTitle: '',
      componentLimit: null,
      itemMenus: [],
      pageId: this.props.pages.filter((page) => page._id === this.props.currentPost.pageId)[0].pageId
    }

    this.gotoCommentCapture = this.gotoCommentCapture.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }
  saveMessage () {
    var currentPost = this.props.currentPost
    if (this.props.location.state && this.props.location.state.mode) {
      if (this.props.location.state.mode === 'reply') {
        var reply =  this.state.broadcast.length > 0 ? this.state.broadcast: []
        currentPost.reply = reply
        this.props.saveCurrentPost(currentPost)
      }
      if (this.props.location.state.mode === 'secondReply') {
        var secondReply = {
          action: 'reply',
          payload: this.state.broadcast.length > 0 ? this.state.broadcast: []
        }
        currentPost.secondReply = secondReply
        this.props.saveCurrentPost(currentPost)
      }
      this.msg.success('Message saved successfully')
    }
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
    if (this.props.location.state && this.props.location.state.mode) {
      if (this.props.location.state.mode === 'reply') {
        this.setState({
          broadcast: this.props.currentPost.reply ? this.props.currentPost.reply : [],
          convoTitle: 'Create Bot Reply',
          componentLimit: 1
        })
      }
      if (this.props.location.state.mode === 'secondReply') {
        this.setState({
          broadcast: this.props.currentPost.secondReply && this.props.currentPost.secondReply.payload ? this.props.currentPost.secondReply.payload : [],
          convoTitle: 'Create Second Reply',
          componentLimit: null
        })
      }
    }
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
          pages={[this.props.currentPost.pageId]}
          broadcast={this.state.broadcast}
          handleChange={this.handleChange}
          convoTitle={this.state.convoTitle}
          buttonActions={this.state.buttonActions}
          componentLimit={this.state.componentLimit}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentPost: (state.postsInfo.currentPost),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      saveCurrentPost: saveCurrentPost
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentCaptureEdit)
