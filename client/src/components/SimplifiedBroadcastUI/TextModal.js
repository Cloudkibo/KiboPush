/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: 'Test Message',
      buttons: [],
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
    this.props.addComponent({componentType: 'text',
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
            <div className='col-6'>
              <h4>Text:</h4>
              <textarea value={this.state.text} style={{marginBottom: '30px', maxWidth: '100%', minHeight: '100px'}} onChange={this.handleTextChange} className='form-control' />
              <AddButton buttonLimit={this.state.buttonLimit} buttonActions={this.state.buttonActions} ref={(ref) => { this.AddButton = ref }} updateButtonStatus={this.updateButtonStatus} addComponent={(buttons) => this.addComponent(buttons)} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '490px', marginLeft: '-50px'}} >
                <section className='discussion'>
                  <div className='bubble recipient' style={{marginRight: '120px', marginTop: '100px', fontSize: '20px'}}>{this.state.text}</div>
                </section>
                {
                  this.state.buttons.map((button, index) => {
                    if (button.visible) {
                      return (
                        <section className='discussion'>
                          <div className='bubble recipient' style={{margin: 'auto', marginTop: '5px', fontSize: '18px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px'}}>{button.title}</div>
                        </section>
                      )
                    }
                  })
                }

              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                    Add
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
