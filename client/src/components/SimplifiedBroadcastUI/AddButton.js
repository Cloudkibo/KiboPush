import React from 'react'
import Button from './Button'

class AddButton extends React.Component {
  constructor (props) {
    super(props)
    let buttons = []
    for (let i = 0; i < this.props.buttonLimit; i++) {
      if (props.buttons && props.buttons[i]) {
        buttons.push(props.buttons[i])
      } else {
        buttons.push({visible: false, title: `Button ${i + 1}`})
      }
    }
    this.state = {
      buttons,
      numOfCurrentButtons: 0
    }
    this.finalButtons = this.props.finalButtons ? this.props.finalButtons : []
    this.buttonComponents = [null, null, null]
    this.addButton = this.addButton.bind(this)
    this.handleButtonTitleChange = this.handleButtonTitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.onAddButton = this.onAddButton.bind(this)
    this.closeButton = this.closeButton.bind(this)
    this.buttonLimitReached = this.buttonLimitReached.bind(this)
    this.checkInvalidButtons = this.checkInvalidButtons.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.onAddButtonCalled = 0
  }

  updateButtonStatus (status, sharedIndex) {
    status.buttons = this.state.buttons
    if (sharedIndex >= 0) {
      status.buttons[sharedIndex] = {title: 'Share', visible: true}
    }
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
        this.setState({buttons, numOfCurrentButtons: ++this.state.numOfCurrentButtons}, () => {
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
    this.setState({buttons, numOfCurrentButtons: --this.state.numOfCurrentButtons}, () => {
      this.checkInvalidButtons()
    })
    this.props.updateButtonStatus({buttons})
  }

  onAddButton (button, index) {
    console.log('onAddButton AddButton', button)
    this.onAddButtonCalled++
    if (index >= 0) {
      this.finalButtons[index] = button.button
    } else {
      this.finalButtons.push(button)
    }
    let buttonComponents = this.buttonComponents.filter(button => button !== null)
    if (this.onAddButtonCalled === this.finalButtons.length && this.finalButtons.length === buttonComponents.length) {
      console.log('done adding', this.finalButtons)
      this.props.addComponent(this.finalButtons)
    }
  }

  handleDone () {
    console.log('AddButton handleDone', this.finalButtons)
    let visibleButtons = this.buttonComponents.filter(button => button !== null)
    if (visibleButtons.length === 0) {
      this.props.addComponent([])
    }
    for (let i = 0; i < this.buttonComponents.length; i++) {
      if (this.buttonComponents[i]) {
        console.log(`buttons[${i}]`, this.buttonComponents[i])
        if (this.finalButtons && this.finalButtons[i]) {
          console.log('handleDoneEdit', this.finalButtons)
          this.buttonComponents[i].getWrappedInstance().handleDoneEdit()
        } else {
          this.buttonComponents[i].getWrappedInstance().handleDone()
        }
      }
    }
  }

  buttonLimitReached () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    if (visibleButtons >= this.props.buttonLimit) {
      return true
    }
  }

  checkInvalidButtons () {
    for (let i = 0; i < this.buttonComponents.length; i++) {
      if (this.state.buttons[i].visible && !this.buttonComponents[i]) {
        this.props.updateButtonStatus({buttonDisabled: true})
        return
      }
      if (this.buttonComponents[i] && this.buttonComponents[i].getWrappedInstance().state.buttonDisabled) {
        console.log('this.buttonComponents[i].getWrappedInstance()', this.buttonComponents[i].getWrappedInstance())
        this.props.updateButtonStatus({buttonDisabled: true})
        return
      }
    }
    this.props.updateButtonStatus({buttonDisabled: false})
  }

  render () {
    return (
      <div>
        <h4 style={{marginBottom: '20px'}}>Buttons (Optional):</h4>
        {
            this.state.buttons.map((button, index) => {
              if (button.visible) {
                return (
                  <Button
                    handleText={this.props.handleText}
                    updateButtonStatus={this.updateButtonStatus}
                    button={this.finalButtons[index]}
                    index={index}
                    closeButton={() => this.closeButton(index)}
                    ref={(ref) => { this.buttonComponents[index] = ref }}
                    title={button.title}
                    handleTitleChange={this.handleButtonTitleChange}
                    button_id={index}
                    pageId={this.props.pageId}
                    buttonActions={this.props.buttonActions}
                    replyWithMessage={this.props.replyWithMessage}
                    onAdd={this.onAddButton} />
                )
              }
            })
        }
        {
            (this.state.numOfCurrentButtons < this.props.buttonLimit) && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px'}} onClick={this.addButton}>
              <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                <h6> + Add Button </h6>
              </div>
            </div>
        }
      </div>
    )
  }
}

export default AddButton
