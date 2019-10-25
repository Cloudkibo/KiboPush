import React from 'react'
import Button from './Button'
import { throws } from 'assert';

class AddButton extends React.Component {
  constructor (props) {
    super(props)
    let buttons = []
    for (let i = 0; i < this.props.buttonLimit; i++) {
      if (props.buttons && props.buttons[i]) {
        buttons.push(props.buttons[i])
      } else {
        buttons.push({visible: false, title: ``})
      }
    }
    this.state = {
      buttons,
      numOfCurrentButtons: buttons.filter(button => button.visible).length
    }
    console.log('constructor buttons', buttons)
    console.log('constructor numOfCurrentButtons', this.state.numOfCurrentButtons)
    this.finalButtons = this.props.finalButtons ? this.props.finalButtons : new Array(buttons.length)
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

    this.recievedProps = false
    console.log('AddButton constructor state', this.state)
    console.log('AddButton constructor props', this.props)
  }

  componentWillReceiveProps (nextProps) {
      if (nextProps.finalButtons.length > 0 && nextProps.finalButtons[0] && !nextProps.finalButtons[0].type) {
        let buttons = []
        for (let i = 0; i < nextProps.buttonLimit; i++) {
          if (nextProps.buttons && nextProps.buttons[i]) {
            buttons.push(nextProps.buttons[i])
          } else {
            buttons.push({visible: false, title: ``})
          }
        }
        let newState = {
          buttons,
          numOfCurrentButtons: buttons.filter(button => button.visible).length
        }

    console.log('componentWillRecieveProps numOfCurrentButtons', this.state.numOfCurrentButtons)
        this.tempButtons = nextProps.finalButtons
        console.log('AddButton newState', newState)
        this.setState(newState)
      }
  }

  componentDidMount () {
    if (this.props.required && !this.props.edit) {
      this.updateButtonStatus({buttonDisabled: true, edited: false})
    }
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
    buttons[index].title = ``
    this.finalButtons[index] = null
    this.buttonComponents[index] = null
    this.setState({buttons, numOfCurrentButtons: --this.state.numOfCurrentButtons}, () => {
      this.checkInvalidButtons()
    })
    this.props.updateButtonStatus({buttons})
  }

  onAddButton (button, index) {
    console.log('onAddButton AddButton', button)

    //If editing existing button
    if (button.button) {
      this.finalButtons[index] = button.button
    //Else adding new button
    } else {
      this.finalButtons[index] = button
    }
    this.onAddButtonCalled++
    console.log('onAddButtonCalled', this.onAddButtonCalled)
    console.log('this.finalButtons', this.finalButtons)
    let buttonComponents = this.buttonComponents.filter(button => button !== null)
    let visibleFinalButtons = this.finalButtons.filter(button => button !== null && button !== undefined)
    console.log('visibleFinalButtons', visibleFinalButtons)
    if (this.onAddButtonCalled === visibleFinalButtons.length && visibleFinalButtons.length === buttonComponents.length) {
      console.log('done adding', visibleFinalButtons)
      this.props.addComponent(visibleFinalButtons)
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
        if (this.finalButtons && this.finalButtons[i] && this.finalButtons[i].type) {
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
      if (this.state.buttons[i] && this.state.buttons[i].visible && !this.buttonComponents[i]) {
        console.log('first button disable case')
        this.props.updateButtonStatus({buttonDisabled: true})
        return
      }
      if (this.buttonComponents[i] && this.buttonComponents[i].getWrappedInstance().state.buttonDisabled) {
        console.log('second button disable case')
        console.log('this.buttonComponents[i].getWrappedInstance()', this.buttonComponents[i].getWrappedInstance())
        this.props.updateButtonStatus({buttonDisabled: true})
        return
      }
    }
    if (this.props.required && this.state.numOfCurrentButtons === 0) {
      console.log('third button disable case')
      this.props.updateButtonStatus({buttonDisabled: true})
    } else {
      console.log('enabling button')
      this.props.updateButtonStatus({buttonDisabled: false})
    }
  }

  render () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    console.log('disabled ', this.props.disabled)
    return (
      <div>
        <h4 style={{marginBottom: '20px'}}>Buttons:</h4>
        {
            this.state.buttons.map((button, index) => {
              if (button.visible) {
                return (
                  <Button
                    cardId={this.props.cardId}
                    scrollTo={!this.finalButtons[index] && visibleButtons.length-1 === index}
                    edit={this.props.edit}
                    handleText={this.props.handleText}
                    updateButtonStatus={this.updateButtonStatus}
                    button={this.finalButtons[index]}
                    tempButton = {this.tempButtons ? this.tempButtons[index] : null}
                    index={index}
                    closeButton={() => this.closeButton(index)}
                    ref={(ref) => { this.buttonComponents[index] = ref }}
                    title={button.title}
                    handleTitleChange={this.handleButtonTitleChange}
                    button_id={index}
                    pageId={this.props.pageId}
                    buttonActions={this.props.buttonActions}
                    replyWithMessage={this.props.replyWithMessage}
                    onAdd={this.onAddButton}
                    disabled={this.props.disabled}
                    />
                )
              }
            })
        }
        {
            (this.state.numOfCurrentButtons < this.props.buttonLimit) && 
            <div>
              <div className='ui-block hoverborder' 
                style={{minHeight: '30px', 
                  width: '100%', 
                  marginLeft: '0px', 
                  borderColor: this.props.required && visibleButtons.length === 0 ? 'red' : ''}} 
                  onClick={this.addButton}>
                <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                  <h6> + Add Button </h6>
                </div>
              </div>
              <div style={{color: 'red', marginBottom: '30px', textAlign: 'left'}}>{this.props.required && visibleButtons.length === 0 ? '*At least one required' : ''}</div>
            </div>
        }
      </div>
    )
  }
}

export default AddButton
