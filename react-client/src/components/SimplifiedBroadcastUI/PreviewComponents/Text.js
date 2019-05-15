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
      buttonActions: this.props.buttonActions
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
    return (<TextModal edit buttonActions={this.props.buttonActions} handleText={this.props.handleText} id={this.props.id} buttons={this.state.buttons} text={this.state.text} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        {
          this.state.editing && this.openTextModal()
        }
        <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px', marginRight: '-15px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', float: 'left', marginLeft: '-15px', height: '20px', marginRight: '15px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div className='discussion' style={{display: 'inline-block'}} >
          <div style={{maxWidth: '100%', fontSize: '18px'}} className='bubble recipient'>{this.state.text}</div>
          {
              this.state.buttons.map((button, index) => {
                return (
                  <div className='bubble recipient' style={{maxWidth: '100%', textAlign: 'center', margin: 'auto', marginTop: '5px', fontSize: '16px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', wordBreak: 'break-all'}}>{button.type === 'element_share' ? 'Share' : button.title}</div>
                )
              })
          }
        </div>
      </div>
    )
  }
}

export default (Text)
