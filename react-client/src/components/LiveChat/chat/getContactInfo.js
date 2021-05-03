import React from 'react'
import QuickReplies from '../messages/quickReplies'

class GetContactInfo extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        query: '',
        message: '',
        keyboardInputAllowed: false,
        skipAllowed: {isSkip: false},
    }
    this.getCorrespondingCustomField = this.getCorrespondingCustomField.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.getQuickReply = this.getQuickReply.bind(this)
    this.getQuickReplyTitle = this.getQuickReplyTitle.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  getCorrespondingCustomField() {
    if (this.state.query === 'email') {
      return 'Email'
    } else if (this.state.query === 'phone') {
      return 'Phone Number'
    }
  }

  getQuickReplyTitle() {
    if (this.state.query === 'email') {
      return "subscriber's email"
    } else if (this.state.query === 'phone') {
      return "subscriber's phone number"
    }
  }

  getQuickReply () {
    const quickReplies = [{title: this.getQuickReplyTitle()}]
    if (this.state.skipAllowed && this.state.skipAllowed.isSkip) {
      quickReplies.push({title: 'skip'})
    }
    return quickReplies
  }

  sendMessage(e) {
    e.preventDefault()
    this.props.togglePopover()
    const quickReplies = [
      {
        title: this.getQuickReplyTitle(),
        query: this.state.query,
        keyboardInputAllowed: this.state.keyboardInputAllowed,
        skipAllowed: this.state.skipAllowed
      }
    ]
    this.props.sendQuickReplyMessage(this.state.message, quickReplies)
  }

  updateQuery(query) {
    const updatedState = { query }
    if (!query) {
      updatedState.message = ''
      updatedState.keyboardInputAllowed = false
      updatedState.skipAllowed = {isSkip: false}
    } else {
      if (query === 'email') {
        updatedState.message = 'Please provide your email'
      } else if (query === 'phone') {
        updatedState.message = 'Please provide your phone number'
      }
    }
    this.setState(updatedState, () => {
      this.props.refreshPopover()
    })
  }

  render() {
    return (
      <div>
        {!this.state.query && (
          <>
            <div
              onClick={() => this.updateQuery('phone')}
              className='ui-block hoverborder'
              style={{
                minHeight: '30px',
                width: '100%',
                marginLeft: '0px',
                marginBottom: '15px',
                paddingLeft: '10px',
                paddingRight: '10px'
              }}
            >
              <div className='align-center'>
                <h6> Ask for Phone Number </h6>
              </div>
            </div>
            <div
              onClick={() => this.updateQuery('email')}
              className='ui-block hoverborder'
              style={{
                minHeight: '30px',
                width: '100%',
                marginLeft: '0px',
                marginBottom: '15px',
                paddingLeft: '10px',
                paddingRight: '10px'
              }}
            >
              <div className='align-center'>
                <h6> Ask for Email </h6>
              </div>
            </div>
          </>
        )}
        {this.state.query && (
          <form onSubmit={(e) => {this.props.checkSendingLogic(() => { this.sendMessage(e) })}} >
            <h5>Ask for Subscriber's {this.getCorrespondingCustomField()}</h5>
            <p>
              This will enable you to retrieve subscriber's {this.getCorrespondingCustomField().toLowerCase()} and store
              it in a custom field: "{this.getCorrespondingCustomField()}".
              <br />
              <br />
              {this.state.query === 'phone' &&
                "Note: You will only be able to retrieve user's phone number if they have made their number public on Facebook. Also, this quick reply will be removed if you send another message before the user taps on it."}
              {this.state.query === 'email' &&
                'Note: This quick reply will be removed if you send another message before the user taps on it.'}
            </p>

            <textarea
              id='contactInfoMessage'
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder='Enter Message Text...'
              required
              className='form-control m-input'
              rows='3'
              maxLength={150}
            />
            <label
              style={{ fontSize: '13px', marginLeft: '5px', color: '#575962', marginTop: '10px', display: 'block' }}
              className='m--font-bolder'
            >
              <input
                style={{ position: 'relative', top: '2px', marginRight: '5px' }}
                type='checkbox'
                checked={this.state.keyboardInputAllowed}
                onChange={(e) => this.setState({ keyboardInputAllowed: e.target.checked })}
              />
              Allow Keyboard Input
            </label>
            <label
              style={{ fontSize: '13px', marginLeft: '5px', color: '#575962', marginTop: '5px', display: 'block' }}
              className='m--font-bolder'
            >
              <input
                style={{ position: 'relative', top: '2px', marginRight: '5px' }}
                type='checkbox'
                checked={this.state.skipAllowed.isSkip}
                onChange={(e) => this.setState({ skipAllowed: { isSkip: e.target.checked } })}
              />
              Allow Skip
            </label>

            <h6 style={{ marginTop: '20px', marginBottom: '10px' }}>Preview:</h6>
            <div style={{ border: '1px solid lightgray', borderRadius: '5px', padding: '10px' }}>
              <div
                className='discussion'
                style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}
              >
                <div
                  style={{
                    maxWidth: '100%',
                    fontSize: '16px',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  className='bubble recipient'
                >
                  {this.state.message}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <QuickReplies buttons={this.getQuickReply()} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', marginBottom: '15px' }}>
              <button onClick={() => this.updateQuery('')} style={{ float: 'right' }} className='btn btn-default'>
                Cancel
              </button>
              <button style={{ float: 'right', marginLeft: '15px' }} type='submit' className='btn btn-primary'>
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }
}

export default GetContactInfo
