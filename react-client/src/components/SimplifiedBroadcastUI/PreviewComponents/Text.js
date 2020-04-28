/* eslint-disable no-undef */

import React from 'react'
import YouTube from 'react-youtube'

class Text extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      videoId: props.videoId,
      videoTitle: props.videoTitle,
      videoDescription: props.videoDescription,
      buttons: props.buttons ? props.buttons : [],
      text: props.message ? props.message : '',
      showEmojiPicker: false,
      count: 0,
      showUserOptions: false,
      numOfButtons: 0,
      styling: {
        minHeight: 30, width: 100 + '%', marginLeft: 0 + 'px'
      },
      buttonActions: this.props.buttonActions
    }
    console.log('Text state', this.state)
    this.edit = this.edit.bind(this)
  }

  componentDidMount () {
    if (this.props.message && this.props.message !== '') {
      this.setState({text: this.props.message})
    }
    if (this.props.buttons && this.props.buttons.length > 0) {
      if (this.state.buttons.length < 1) {
        this.setState({
          buttons: this.props.buttons
        })
      }
    }
  }

  edit () {
    if (this.state.videoId) {
      console.log('this.state.urlMetaData in edit', this.state.urlMetaData)
      this.props.editComponent('video', {
        edit: true,
        youtubeLink:this.state.text,
        videoId:this.state.videoId,
        videoTitle: this.state.videoTitle,
        videoDescription: this.state.videoDescription,
        id:this.props.id
      })
    } else {
      this.props.editComponent('text', {
        id: this.props.id,
        buttons: JSON.parse(JSON.stringify(this.state.buttons)),
        text: this.state.text,
        buttonActions: this.state.buttonActions
      })
    }
  }

  getDeletePayload () {
    let buttons = this.state.buttons
    let deletePayload = []
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i] && buttons[i].type === 'postback') {
        let buttonPayload = JSON.parse(buttons[i].payload)
        deletePayload = deletePayload.concat(buttonPayload)
      }
    }
    return deletePayload
  }

  validateButton(button) {
    //debugger;
    if (button.type === 'postback') {
      let buttonPayload = JSON.parse(button.payload)
      for (let i = 0; i < buttonPayload.length; i++) {
        if (buttonPayload[i].action === 'send_message_block' && !buttonPayload[i].blockUniqueId) {
          return false
        }
      }
    }
    return true
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        {this.props.onRemove &&
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.getDeletePayload()}) }}
            style={{float: 'right', height: 20 + 'px', marginTop: '-4px', marginRight: '-10px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        {this.props.editComponent &&
          <i onClick={this.edit} style={{cursor: 'pointer', float: 'left', marginLeft: '-15px', height: '20px', marginRight: '15px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        }
        <div className='discussion' style={{display: 'inline-block'}} >

        {
          this.state.videoId &&
          <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', maxWidth: '80%', margin: 'auto'}} >
          <div>
            <div>
              <YouTube
                videoId={this.state.videoId}
                opts={{
                  height: '100',
                  width: '200',
                  playerVars: {
                    autoplay: 0
                  }
                }}
                />
            </div>
            {
              this.state.videoTitle &&
              <div>
                <div style={{textAlign: 'left', 'marginLeft': '10px'}}>
                  <h6>{this.state.videoTitle}</h6>
                  <h7>{this.state.videoDescription.length > 50 ? this.state.videoDescription.substr(0, 47)+'...' : this.state.videoDescription}</h7>
                  <p style={{fontSize: '0.7em', marginTop: '5px'}}>www.youtube.com</p>
                </div>
                <hr />
                <p style={{textAlign: 'left', color: '#0782FF', fontSize: '0.9em', marginLeft: '5px'}}>{this.state.text}</p>
              </div>
            }
            </div>
          </div>
          }
          {
            !this.state.videoId && <div style={{maxWidth: '100%', fontSize: '16px', textAlign: 'center', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}} className='bubble recipient broadcastContent'>{this.state.text}</div>
          }
          {
              this.state.buttons.map((button, index) => {
                return (
                  <div id={`button-${button.id}`} className='bubble recipient'
                    style={{
                      maxWidth: '100%',
                      textAlign: 'center',
                      margin: 'auto',
                      marginTop: '5px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      border: !this.validateButton(button) ? '1px solid red' : '1px solid rgba(0,0,0,.1)',
                      borderRadius: '10px',
                      wordBreak: 'break-all',
                      color: '#0782FF'
                    }}>{button.title}</div>
                )
              })
          }
        </div>
      </div>
    )
  }
}

export default (Text)
