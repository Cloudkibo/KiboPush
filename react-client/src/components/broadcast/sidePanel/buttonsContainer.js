import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from './buttonItem'
import BUTTONACTION from '../buttonActions/main'

class ButtonsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.addButton = this.addButton.bind(this)
    this.getAdditionalActions = this.getAdditionalActions.bind(this)
  }

  addButton () {
    const button = {
      title: '',
      type: '',
      id: new Date().getTime() + (Math.floor(Math.random() * 100)),
      actions: []
    }
    this.props.addButton(button)
  }

  getAdditionalActions (button) {
    let payload = []
    let actions = []
    let additionalActions = ['Subscribe to Sequence', 'Unsubscribe from Sequence', 'Set Custom Field', 'Google Sheets actions', 'HubSpot actions']
    if (button.payload) {
      payload = JSON.parse(button.payload)
      actions = payload.map((item) => item.action)
    }
    if (actions.includes('subscribe') || !(this.props.sequences && this.props.sequences.length > 0)) {
      additionalActions = additionalActions.filter((action) => action !== 'Subscribe to Sequence')
    }
    if (actions.includes('unsubscribe') || !(this.props.sequences && this.props.sequences.length > 0)) {
      additionalActions = additionalActions.filter((action) => action !== 'Unsubscribe from Sequence')
    }
    if (actions.includes('subscribe') || actions.includes('unsubscribe')) {
      additionalActions.push('Reply with a message')
    }
    return additionalActions
  }

  render () {
    console.log('props in buttons container side panel', this.props)
    return (
      <div style={{marginTop: '20px'}} id='side_panel_buttons_container'>
        <span className='m--font-boldest'>Buttons (Optional):</span>
        {
          this.props.buttons.map((button, index) => (
            <BUTTONACTION
              button={button}
              index={index}
              updateButton={this.props.updateButton}
              removeButton={this.props.removeButton}
              mainActions={['Open a website', 'Open a webview', 'Reply with a message']}
              additionalActions={this.getAdditionalActions(button)}
              insertButton={this.props.insertButton}
              editButton={this.props.editButton}
              alertMsg={this.props.alertMsg}
              page={this.props.page}
              whitelistedDomains={this.props.whitelistedDomains}
              sequences={this.props.sequences}
            />
          ))
        }
        {
          this.props.buttons.length < this.props.limit &&
          <div style={{border: 'none', marginTop: '10px'}} className='card'>
            <BUTTONITEM
              title='+ Add Button'
              onButtonClick={this.addButton}
            />
          </div>
        }
      </div>
    )
  }
}

ButtonsContainer.propTypes = {
  'buttons': PropTypes.array.isRequired,
  'addButton': PropTypes.func.isRequired,
  'limit': PropTypes.number.isRequired,
  'removeButton': PropTypes.func.isRequired,
  'updateButton': PropTypes.func.isRequired,
  'insertButton': PropTypes.func.isRequired,
  'editButton': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired,
  'whitelistedDomains': PropTypes.array.isRequired,
  'sequences': PropTypes.array
}

export default ButtonsContainer
