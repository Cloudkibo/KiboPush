/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Button from './Button'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: 'Test Message',
      buttons: [{visible: false, title: 'Button 1'}, {visible: false, title: 'Button 2'}, {visible: false, title: 'Button 3'}],
      buttonActions: ['open website', 'open webview', 'add share'],
      buttonLimit: 3,
      disabled: false
    }
    this.finalButtons = []
    this.buttonComponents = [null, null, null]
    this.handleTextChange = this.handleTextChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.handleButtonTitleChange = this.handleButtonTitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.onAddButton = this.onAddButton.bind(this)
    this.closeButton = this.closeButton.bind(this)
    this.buttonLimitReached = this.buttonLimitReached.bind(this)
    this.checkInvalidButtons = this.checkInvalidButtons.bind(this)
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

  handleButtonTitleChange (title, index) {
    let buttons = this.state.buttons
    buttons[index].title = title
    this.setState({buttons})
  }

  addButton () {
    let buttons = this.state.buttons
    for (let i = 0; i < this.state.buttons.length; i++) {
      if (!this.state.buttons[i].visible) {
        buttons[i].visible = true
        this.setState({buttons}, () => {
          this.checkInvalidButtons()
        })
        return
      }
    }
  }

  closeButton (index) {
    let buttons = this.state.buttons
    buttons[index].visible = false
    buttons[index].title = `Button ${index + 1}`
    this.buttonComponents[index] = null
    this.setState({buttons}, () => {
      this.checkInvalidButtons()
    })
  }

  onAddButton (button) {
    console.log('onAddButton TextModal', button)
    this.finalButtons.push(button)
    let buttonComponents = this.buttonComponents.filter(button => button !== null)
    if (this.finalButtons.length === buttonComponents.length) {
      console.log('done adding', this.finalButtons)
      this.props.addComponent({componentType: 'text',
        text: this.state.text,
        buttons: this.finalButtons})
    }
  }

  handleDone () {
    console.log('text modal handleDone', this.state)
    if (this.buttonComponents.length === 0) {
      this.props.addComponent({componentType: 'text',
        text: this.state.text,
        buttons: []})
    }
    for (let i = 0; i < this.buttonComponents.length; i++) {
      if (this.buttonComponents[i]) {
        console.log(`buttons[${i}]`, this.buttonComponents[i])
        this.buttonComponents[i].getWrappedInstance().handleDone()
      }
    }
  }

  buttonLimitReached () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    if (visibleButtons >= 3) {
      return true
    }
  }

  checkInvalidButtons () {
    for (let i = 0; i < this.buttonComponents.length; i++) {
      if (this.state.buttons[i].visible && !this.buttonComponents[i]) {
        this.setState({disabled: true})
        return
      }
      if (this.buttonComponents[i] && this.buttonComponents[i].getWrappedInstance().state.disabled) {
        console.log('this.buttonComponents[i].getWrappedInstance()', this.buttonComponents[i].getWrappedInstance())
        this.setState({disabled: true})
        return
      }
    }
    this.setState({disabled: false})
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
              <h4>Buttons (Optional):</h4>
              {
                  this.state.buttons.map((button, index) => {
                    if (button.visible) {
                      return (
                        // <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', height: '300px', marginTop: '30px'}} >
                        //   <div style={{whiteSpace: 'nowrap', marginTop: '10px'}}>
                        //     <h5 style={{display: 'inline'}}>title:</h5>
                        //     <input type='text' id='id1' className='form-control col-6 pull-right' style={{marginRight: '130px', height: '25px'}} />
                        //   </div>
                        // </div>
                        <Button updateButtonStatus={this.updateButtonStatus} closeButton={() => this.closeButton(index)} ref={(ref) => { this.buttonComponents[index] = ref }} title={button.title} handleTitleChange={this.handleButtonTitleChange} button_id={index} pageId={this.props.pageId} buttonActions={this.state.buttonActions} replyWithMessage={this.props.replyWithMessage} onAdd={this.onAddButton} />
                      )
                    }
                  })
              }
              {
                !this.buttonLimitReached() && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginTop: '30px', marginBottom: '30px'}} onClick={this.addButton}>
                  <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                    <h6> + Add Button </h6>
                  </div>
                </div>
              }

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
                <button disabled={this.state.disabled} onClick={() => this.handleDone()} className='btn btn-primary'>
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
