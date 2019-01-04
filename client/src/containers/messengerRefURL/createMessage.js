/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

  import React from 'react'
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'
  import CreateMessage from '../../components/CreateMessage/createMessage'
  import { updateData } from '../../redux/actions/messengerRefURL.actions'
  import AlertContainer from 'react-alert'

  class MessengerRefURLMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
        reply: this.props.messengerRefURL.reply ? this.props.messengerRefURL.reply : [],
        pageId: this.props.pages.filter((page) => page.pageId === this.props.messengerRefURL.pageId)[0]._id
      }
      this.saveMessage = this.saveMessage.bind(this)
    }
    saveMessage (message) {
      this.setState({
        reply: message
      })
      this.props.updateData(this.props.messengerRefURL, 'reply', message)
      this.msg.success('Message has been saved.')
    }

    render () {
      var alertOptions = {
        offset: 75,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      }
      return (
        <div style={{width: '100%'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <CreateMessage title='Opt-In Message' module='messengerRefURL' saveMessage={this.saveMessage} editMessage={this.state.reply} pages={[this.state.pageId]} pageId={this.props.messengerRefURL.pageId} />
        </div>
      )
    }
  }

  function mapStateToProps (state) {
    return {
      messengerRefURL: state.messengerRefURLInfo.messengerRefURL,
      pages: state.pagesInfo.pages
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      updateData: updateData
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MessengerRefURLMessage)
