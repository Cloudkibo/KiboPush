
import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: props.text ? props.text : 'Test Message',
      buttons: props.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      buttonActions: ['open website', 'open webview', 'add share'],
      buttonLimit: 3,
      disabled: false,
      buttonDisabled: false
    }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
  }

  handleTextChange (e) {
    this.setState({text: e.target.value}, () => {
      if (this.state.text === '') {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  updateButtonStatus (status) {
    this.setState(status)
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addComponent (buttons) {
    this.props.addComponent({
      id: this.props.id ? this.props.id : null,
      componentType: 'text',
      text: this.state.text,
      buttons})
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Text Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '500px', overflowY: 'scroll'}}>
              <h4>Text:</h4>
              <textarea value={this.state.text} style={{marginBottom: '30px', maxWidth: '100%', minHeight: '100px'}} onChange={this.handleTextChange} className='form-control' />
              <AddButton
                buttons={this.state.buttons}
                finalButtons={this.props.buttons}
                buttonLimit={this.state.buttonLimit}
                pageId={this.props.pageId}
                buttonActions={this.state.buttonActions}
                ref={(ref) => { this.AddButton = ref }}
                updateButtonStatus={this.updateButtonStatus}
                addComponent={(buttons) => this.addComponent(buttons)} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '490px', marginLeft: '-50px'}} >
                <div className='discussion' style={{display: 'inline-block', marginTop: '100px'}} >
                  <div style={{maxWidth: '100%', fontSize: '18px'}} className='bubble recipient'>{this.state.text}</div>
                    {
                        this.state.buttons.map((button, index) => {
                          if (button.visible) {
                            return (
                              <div className='bubble recipient' style={{maxWidth: '100%', textAlign: 'center', margin: 'auto', marginTop: '5px', fontSize: '16px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', wordBreak: 'break-all'}}>{button.title}</div>
                            )
                          }
                        })
                    }
                  </div>
                </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Add'}
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
