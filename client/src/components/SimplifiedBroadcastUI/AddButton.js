/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Button from './Button'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttons: [{visible: false, title: 'Button 1'}, {visible: false, title: 'Button 2'}, {visible: false, title: 'Button 3'}],
      buttonActions: this.props.buttonActions,
      buttonLimit: this.props.buttonLimit
    }
    this.finalButtons = []
    this.buttonComponents = [null, null, null]
    this.addButton = this.addButton.bind(this)
    this.handleButtonTitleChange = this.handleButtonTitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.onAddButton = this.onAddButton.bind(this)
    this.closeButton = this.closeButton.bind(this)
    this.buttonLimitReached = this.buttonLimitReached.bind(this)
    this.checkInvalidButtons = this.checkInvalidButtons.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
  }

  updateButtonStatus (status) {
    status.buttons = this.state.buttons
    this.props.updateButtonStatus(status)
  }

  handleButtonTitleChange (title, index) {
    let buttons = this.state.buttons
    buttons[index].title = title
    this.setState({buttons})
    this.props.updateButtonStatus({buttons})
  }

  addButton () {
    let buttons = this.state.buttons
    for (let i = 0; i < this.state.buttons.length; i++) {
      if (!this.state.buttons[i].visible) {
        buttons[i].visible = true
        this.setState({buttons}, () => {
          this.checkInvalidButtons()
        })
        this.props.updateButtonStatus({buttons})
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
    this.props.updateButtonStatus({buttons})
  }

  onAddButton (button) {
    console.log('onAddButton TextModal', button)
    this.finalButtons.push(button)
    let buttonComponents = this.buttonComponents.filter(button => button !== null)
    if (this.finalButtons.length === buttonComponents.length) {
      console.log('done adding', this.finalButtons)
      this.props.addComponent(this.finalButtons)
    }
  }

  handleDone () {
    console.log('text modal handleDone', this.state)
    if (this.buttonComponents.length === 0) {
      this.props.addComponent([])
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
        this.props.updateButtonStatus({disabled: true})
        return
      }
      if (this.buttonComponents[i] && this.buttonComponents[i].getWrappedInstance().state.disabled) {
        console.log('this.buttonComponents[i].getWrappedInstance()', this.buttonComponents[i].getWrappedInstance())
        this.props.updateButtonStatus({disabled: true})
        return
      }
    }
    this.props.updateButtonStatus({disabled: false})
  }

  render () {
    return (
      <div>
        <h4>Buttons (Optional):</h4>
        {
            this.state.buttons.map((button, index) => {
              if (button.visible) {
                return (
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
    )
  }
}

export default TextModal
