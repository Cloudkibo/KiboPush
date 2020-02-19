import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from './buttonItem'
import BUTTONACTION from '../buttonActions/main'

class ButtonsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.addButton = this.addButton.bind(this)
  }

  addButton () {
    const button = {title: '', type: '', id: new Date().getTime() + (Math.floor(Math.random() * 100))}
    this.props.addButton(button)
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
              additionalActions={['Subscribe to Sequence', 'Unsubscribe from Sequence', 'Set Custom Field', 'Google Sheets actions', 'HubSpot actions']}
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
  'updateButton': PropTypes.func.isRequired
}

export default ButtonsContainer
