
import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'
import { Popover, PopoverBody } from 'reactstrap'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: props.text ? props.text : '',
      buttons: props.buttons.map(button => {return {visible: true, title: button.title}} ),
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      buttonLimit: 3,
      buttonDisabled: false,
      messengerAdPayloads: this.props.buttons.map((button) => button.payload).filter(button => !!button)
    }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.toggleUserOptions = this.toggleUserOptions.bind(this)
    this.getName = this.getName.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  toggleUserOptions () {
    this.setState({showUserOptions: !this.state.showUserOptions})
  }

  getName (e, name) {
    console.log('getName', name)
    let message = this.state.text + ((this.state.text && this.state.text.length > 0) ? ` {{${name}}}` : `{{${name}}}`)
    this.setState({text: message, showUserOptions: false})
  }

  handleTextChange (e) {
    this.setState({text: e.target.value, edited: true})
  }

  updateButtonStatus (status) {
    status.edited = true
    this.setState(status)
  }

  handleDone () {
    if (this.props.noButtons) {
      this.addComponent([])
    } else {
      this.AddButton.handleDone()
    }
  }

  addComponent (buttons) {
    console.log('addComponent in TextModal', this.props)
    let deletePayload = []
    if (this.messengerAdPayloads.length > 0) {
      for (let i = 0; i < messengerAdPayloads.length; i++) {
        let foundPayload = false
        for (let j = 0; j < buttons.length; j++) {
          if (messengerAdPayloads[j] === buttons[j].payload) {
            foundPayload = true
          }
        }
        if (!foundPayload) {
          deletePayload.push(messengerAdPayloads[i]) 
        } else {
          foundPayload = false
        }
      }
    }
    this.props.addComponent({
      id: this.props.id >= 0 ? this.props.id : null,
      componentType: 'text',
      text: this.state.text,
      buttons,
      deletePayload: deletePayload.length > 0 ? deletePayload : null}, this.props.edit)
  }

  closeModal () {
    if (!this.state.edited || (this.state.text === '' && this.state.buttons.length === 0)) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  componentWillUnmount() {
    this.props.closeModal()
  }

  render () {
    return (
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.closeModal}>
          <h3>Add Text Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
              <h4>Text:</h4>
              <textarea placeholder={'Please type here...'} value={this.state.text} style={{maxWidth: '100%', minHeight: '100px', borderColor: this.state.text === '' ? 'red' : ''}} onChange={this.handleTextChange} className='form-control' />
              { (!this.props.hideUserOptions) &&
                    <div className='m-messenger__form-tools pull-right messengerTools' style={{backgroundColor: '#F1F0F0', marginTop: '-25px', marginRight: '2px'}}>
                      <div id='userOptions' data-tip='options' style={{display: 'inline-block', float: 'left'}}>
                        <i onClick={this.toggleUserOptions} style={{height: '24px',
                          width: '24px',
                          position: 'relative',
                          display: 'inline-block',
                          cursor: 'pointer'}}>
                          <i className='greetingMessage fa fa-user' style={{fontSize: '20px',
                            left: '0px',
                            width: '100%',
                            height: '2em',
                            textAlign: 'center',
                            color: 'rgb(120, 120, 120)'}} />
                        </i>
                      </div>
                    </div>
              }

      { (!this.props.hideUserOptions) &&
          <Popover container={document.getElementsByClassName('narcissus_17w311v')[0]} placement='left' isOpen={this.state.showUserOptions} className='greetingPopover' target='userOptions' toggle={this.toggleUserOptions}>
            <PopoverBody>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_first_name')}>First Name</div>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_last_name')}>Last Name</div>
              <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_full_name')}>Full Name</div>
            </PopoverBody>
          </Popover>
        }
              <div style={{marginBottom: '30px', color: 'red'}}>{this.state.text === '' ? '*Required' : ''}</div>
              {
                !this.props.noButtons &&
                  <AddButton
                  replyWithMessage={this.props.replyWithMessage}
                  buttons={this.state.buttons}
                  finalButtons={this.props.buttons}
                  buttonLimit={this.state.buttonLimit}
                  pageId={this.props.pageId}
                  buttonActions={this.state.buttonActions}
                  ref={(ref) => { this.AddButton = ref }}
                  updateButtonStatus={this.updateButtonStatus}
                  addComponent={(buttons) => this.addComponent(buttons)}
                  disabled = {!this.state.text}
                  />
              }
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px'}} >
                <div className='discussion' style={{display: 'inline-block', marginTop: '100px'}} >
                  <div style={{maxWidth: '100%', fontSize: '18px'}} className='bubble recipient'>{this.state.text}</div>
                    {
                        this.state.buttons.map((button, index) => {
                          if (button.visible) {
                            return (
                              <div className='bubble recipient' style={{maxWidth: '100%', textAlign: 'center', margin: 'auto', marginTop: '5px', fontSize: '16px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', wordBreak: 'break-all', color: '#0782FF'}}>{button.title}</div>
                            )
                          }
                        })
                    }
                  </div>
                </div>
            </div>

            <div className='row' style={{marginTop: '-5vh'}}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.text || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default TextModal
