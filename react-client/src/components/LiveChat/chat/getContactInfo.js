import React from 'react'

class GetContactInfo extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        query: '',
        text: '',
        keyboardInputAllowed: false,
        skipAllowed: ''
    }
    this.getCorrespondingCustomField = this.getCorrespondingCustomField.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
  }

  getCorrespondingCustomField () {
    if (this.state.query === 'email') {
      return "Email"
    } else if (this.state.query === 'phone') {
      return "Phone Number"
    }
  }

  sendMessage (e) {
    e.preventDefault()
  }

  updateQuery (query) {
    const updatedState = {query}
    if (!query) {
      updatedState.text = ''
      updatedState.keyboardInputAllowed = false
      updatedState.skipAllowed = false
    }
    this.setState(updatedState, () => {
      this.props.refreshPopover()
    })
  }

  render () {
    return (
      <div>
        {
          !this.state.query &&
          <>
            <div
              onClick={() => this.updateQuery('phone')}
              className="ui-block hoverborder"
              style={{
                minHeight: "30px",
                width: "100%",
                marginLeft: "0px",
                marginBottom: "15px",
                paddingLeft: "10px",
                paddingRight: "10px"
              }}
            >
            <div className="align-center">
              <h6> Ask for Phone Number </h6>
            </div>
          </div>
          <div
            onClick={() => this.updateQuery('email')}
            className="ui-block hoverborder"
            style={{
              minHeight: "30px",
              width: "100%",
              marginLeft: "0px",
              marginBottom: "15px",
              paddingLeft: "10px",
              paddingRight: "10px"
            }}
          >
            <div className="align-center">
              <h6> Ask for Email </h6>
            </div>
          </div>
        </>
      }
      {
        this.state.query === 'email' && 
        <form onSubmit={this.sendMessage}>
          <h5>
            Ask for Subscriber's Email
          </h5>
          <p>
            This will enable you to retrieve subscriber's email and store it in a custom field: "Email".
            Note: This quick reply will be removed if you send another message before the user taps on it.
          </p>

          <textarea 
            id="contactInfoMessage"
            placeholder="Enter Message Text..."
            required 
            className="form-control m-input" 
            rows="3" />


          <label style={{fontSize: '13px', marginLeft: '5px', color: "#575962", marginTop: "10px", display: 'block'}} className="m--font-bolder">
            <input
              style={{position: 'relative', top: '2px', marginRight: "5px"}}
              type="checkbox"
              checked={this.state.keyboardInputAllowed}
              onChange={(e) => this.setState({keyboardInputAllowed: e.target.checked})}
            />
            Allow Keyboard Input
          </label>
          <label style={{fontSize: '13px', marginLeft: '5px', color: "#575962", marginTop: "5px", display: "block"}} className="m--font-bolder">
            <input
              style={{position: 'relative', top: '2px', marginRight: "5px"}}
              type="checkbox"
              checked={this.state.skipAllowed}
              onChange={(e) => this.setState({skipAllowed: e.target.checked})}
            />
            Allow Skip
          </label>

          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '15px', marginBottom: '15px'}}>
            <button onClick={() => this.updateQuery('')} style={{ float: 'right' }} className="btn btn-default">
              Cancel
            </button>
            <button style={{ float: 'right', marginLeft: '15px' }} type='submit' className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      }
      {
        this.state.query === 'phone' && 
        <div>
          <h5>
            Ask for subscriber's phone number
          </h5>
        </div>
      }

    </div>
    )
  }
}

export default GetContactInfo
