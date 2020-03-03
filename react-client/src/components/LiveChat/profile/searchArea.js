import React from 'react'
import Dotdotdot from 'react-dotdotdot'
import Highlighter from 'react-highlight-words'
import { scroller } from 'react-scroll'
import PropTypes from 'prop-types'

class SearchArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: '',
      searching: false
    }
    this.changeSearchValue = this.changeSearchValue.bind(this)
    this.searchChat = this.searchChat.bind(this)
    this.scrollToMessage = this.scrollToMessage.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.searchChatMsgs) {
          this.setState({searching: false})
      }
  }

  changeSearchValue (e) {
    this.setState({searchValue: e.target.value})
  }

  scrollToMessage (messageId) {
    console.log('scrollToMessage called')
    // check if message exists
    let counter = 0
    for (let i = 0; i < this.props.userChat.length; i++) {
      if (this.props.userChat[i]._id === messageId) {
        counter = 1
        break
      }
    }

    if (counter === 1) {
      scroller.scrollTo(messageId, {delay: 3000, containerId: 'chat-container'})
    } else {
      this.props.fetchUserChats(this.props.activeSession._id, {page: 'next', number: 25, last_id: this.props.userChat[0]._id, messageId: messageId}, this.scrollToMessage)
    }
  }

  searchChat () {
    this.props.clearSearchResult()
    this.setState({searching: true})
    const data = {
      subscriber_id: this.props.activeSession._id,
      text: this.state.searchValue
    }
    console.log('data to search', data)
    this.props.searchChat(data)
  }

  render () {
    return (
      <div id='searchArea' style={{padding: '0px', border: '1px solid #F2F3F8', marginBottom: '0px'}} className='col-xl-3 m-portlet'>
        <div className='m-card-profile'>
          <div style={{padding: '0px'}} className='m-portlet__body'>
            <div style={{padding: '1.5rem'}}>
              <h5>Search Chat<i style={{cursor: 'pointer', float: 'right', fontWeight: 'bold'}} onClick={this.props.hideSearch} className='la la-close' /></h5>
              <br />
              <div className='input-group'>
                <input onChange={this.changeSearchValue} value={this.state.searchValue} type='text' className='form-control' placeholder='Search Messages...' />
                <span className='input-group-btn'>
                  <button onClick={this.searchChat} className='btn btn-primary' type='button'>
                    Go!
                  </button>
                </span>
              </div>
            </div>
            <div style={{height: '65vh', overflowY: 'scroll'}} className='m-widget4'>
                {
                  this.state.searching &&
                  <div className='align-center'>
                    <center>
                      <div className="m-loader" style={{width: "30px", display: "inline-block"}}></div>
                      <span>Searching...</span>
                    </center>
                  </div>
                }
              {
                this.props.searchChatMsgs && this.props.searchChatMsgs.length > 0
                ? this.props.searchChatMsgs.map((chat, index) => (
                  <div key={chat._id} onClick={() => { this.scrollToMessage(chat._id) }} style={{cursor: 'pointer'}} className='m-widget4__item'>
                    <div className='m-widget4__info'>
                      <span className='m-widget4__sub'>{new Date(chat.datetime).getDate() + '/' + new Date(chat.datetime).getMonth() + '/' + new Date(chat.datetime).getFullYear()}</span>
                      <br />
                      <Dotdotdot clamp={2}>
                        <span style={{fontWeight: 'normal'}} className='m-widget4__title'>
                          <strong>{chat.format === 'facebook' ? (this.props.activeSession.firstName + ': ') : 'You: '}</strong>
                          <Highlighter
                            searchWords={this.state.searchValue.split(' ')}
                            highlightStyle={{backgroundColor: 'yellow'}}
                            autoEscape
                            textToHighlight={chat.payload.text}
                          />
                        </span>
                      </Dotdotdot>
                    </div>
                  </div>
                ))
                : this.props.searchChatMsgs && this.props.searchChatMsgs.length === 0 &&
                <p style={{textAlign: 'center'}}>No search result found</p>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SearchArea.propTypes = {
    'activeSession': PropTypes.object.isRequired,
    'hideSearch': PropTypes.func.isRequired,
    'searchChatMsgs': PropTypes.array,
    'userChat': PropTypes.array.isRequired,
    'searchChat': PropTypes.func.isRequired,
    'fetchUserChats': PropTypes.func.isRequired,
    'clearSearchResult': PropTypes.func.isRequired
}
  
export default SearchArea