/* eslint-disable no-undef */

import React from 'react'
import TextModal from '../TextModal'

class Text extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      editing: false,
      buttons: props.buttons ? props.buttons : [],
      text: props.message ? props.message : '',
      showEmojiPicker: false,
      count: 0,
      showUserOptions: false,
      numOfButtons: 0,
      styling: {
        minHeight: 30, width: 100 + '%', marginLeft: 0 + 'px'
      },
      buttonActions: this.props.buttonActions.slice(0, 2)
    }

    this.edit = this.edit.bind(this)
    this.closeEditButton = this.closeEditButton.bind(this)
    this.openTextModal = this.openTextModal.bind(this)
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

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openTextModal () {
    console.log('opening TextModal for edit', this.state)
    return (<TextModal edit handleText={this.props.handleText} id={this.props.id} buttons={this.state.buttons} text={this.state.text} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
  }

  render () {
    let textStyles
    if (this.props.removeState) {
      textStyles = {marginBottom: 70 + 'px'}
    } else {
      textStyles = {marginBottom: 70 + 'px', width: '60%'}
    }
    return (

      <div className='broadcast-component' style={textStyles}>
        {this.props.removeState &&
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{ float: 'right', height: 20 + 'px' }}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
      }
        {
          this.state.editing && this.openTextModal()
      }
        <span className='discussion'>
          <div onClick={this.edit} style={{cursor: 'pointer'}} className='bubble recipient'>{this.state.text}</div>
          {
              this.state.buttons.map((button, index) => {
                return (
                  <div className='bubble recipient' style={{marginTop: '5px', fontSize: '0.95rem', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', wordBreak: 'break-all'}}>{button.type === 'element_share' ? 'Share' : button.title}</div>
                )
              })
          }
        </span>
      </div>
    )
  }
}

export default (Text)
