import React from 'react'
import PropTypes from 'prop-types'
import Dotdotdot from 'react-dotdotdot'
import Highlighter from 'react-highlight-words'


class Search extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: ''
    }
    this.changeSearchValue = this.changeSearchValue.bind(this)
  }
  changeSearchValue (e) {
    this.props.clearSearchResult()
    this.setState({searchValue: e.target.value})
  }

  render () {
    return (
      <div className='m-portlet m-portlet--full-height'>
        <div style={{padding: '0px'}} className='m-portlet__body'>
          <div style={{padding: '1.5rem'}}>
            <h5>Search<i style={{cursor: 'pointer', float: 'right', fontWeight: 'bold'}} onClick={this.props.hideSearch} className='la la-close' /></h5>
            <br />
            <div className='input-group'>
              <input onChange={this.changeSearchValue} value={this.state.searchValue} type='text' className='form-control' placeholder='Search Messages...' />
              <span className='input-group-btn'>
                <button onClick={() => { this.props.searchChat(this.state.searchValue)}} className='btn btn-primary' type='button'>
                  Go!
                </button>
              </span>
            </div>
          </div>
          <div style={{height: '525px', overflowY: 'scroll'}} className='m-widget4'>
            {
              this.props.searchChatMsgs && this.props.searchChatMsgs.length > 0
              ? this.props.searchChatMsgs.map((chat, index) => (
                <div key={chat._id} onClick={() => { this.props.scrollToMessage(chat._id) }} style={{cursor: 'pointer'}} className='m-widget4__item'>
                  <div className='m-widget4__info'>
                    <span className='m-widget4__sub'>{new Date(chat.datetime).getDate() + '/' + new Date(chat.datetime).getMonth() + '/' + new Date(chat.datetime).getFullYear()}</span>
                    <br />
                    <Dotdotdot clamp={2}>
                      <span style={{fontWeight: 'normal'}} className='m-widget4__title'>
                        <strong>{chat.format !== 'kibopush' ? (this.props.subscriberName.split(' ')[0]  + ': ') : 'You: '}</strong>
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
              <p style={{textAlign: 'center'}}>No search result found!</p>
            }
          </div>
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  'scrollToMessage': PropTypes.func.isRequired,
  'clearSearchResult': PropTypes.func.isRequired,
  'searchChatMsgs': PropTypes.array.isRequired,
  'hideSearch': PropTypes.func.isRequired,
  'searchChat': PropTypes.func.isRequired,
  'subscriberName': PropTypes.string.isRequired
}
export default Search
