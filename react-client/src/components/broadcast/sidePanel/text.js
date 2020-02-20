import React from 'react'
import PropTypes from 'prop-types'
import BUTTONSCONTAINER from './buttonsContainer'

class Text extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.componentData.text,
      buttons: props.componentData.buttons
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.updateButton = this.updateButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  onValueChange (e) {
    this.setState({text: e.target.value})
    let data = this.props.componentData
    data.text = e.target.value
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  addButton (button) {
    let data = this.props.componentData
    data.buttons.push(button)
    this.setState({buttons: data.buttons}, () => {
      setTimeout(this.scrollToBottom, 1)
    })
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  updateButton (button, index) {
    let data = this.props.componentData
    data.buttons[index] = button
    this.setState({buttons: data.buttons})
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  removeButton (index) {
    let data = this.props.componentData
    data.buttons.splice(index, 1)
    this.setState({buttons: data.buttons})
    this.props.updateBroadcastData(this.props.blockId, data.id, 'update', data)
  }

  scrollToBottom () {
    if (this.bottom) {
      this.bottom.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of text side panel called ', nextProps)
    if (nextProps.componentData) {
      this.setState({
        text: nextProps.componentData.text,
        buttons: nextProps.componentData.buttons
      })
    }
  }

  render () {
    console.log('props in text side panel', this.props)
    return (
      <div id='side_panel_text_component'>
        <div id='dynamic_height_sidepanel' style={{maxHeight: '550px', overflow: 'scroll'}}>
          <span className='m--font-boldest'>Text:</span>
          <textarea
            className='form-control'
            style={{height: '100px'}}
            placeholder='Please type here...'
            value={this.state.text}
            onChange={this.onValueChange}
          />
          <BUTTONSCONTAINER
            buttons={this.state.buttons}
            addButton={this.addButton}
            updateButton={this.updateButton}
            removeButton={this.removeButton}
            limit={3}
            insertButton={this.props.insertButton}
            editButton={this.props.editButton}
            alertMsg={this.props.alertMsg}
            page={this.props.page}
            whitelistedDomains={this.props.whitelistedDomains}
            sequences={this.props.sequences}
          />
          <div style={{float: 'left', clear: 'both'}}
            ref={(el) => { this.bottom = el }} />
        </div>
      </div>
    )
  }
}

Text.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.number.isRequired,
  'insertButton': PropTypes.func.isRequired,
  'editButton': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired,
  'whitelistedDomains': PropTypes.array.isRequired,
  'sequences': PropTypes.array
}

export default Text
