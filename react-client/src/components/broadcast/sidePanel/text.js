import React from 'react'
import PropTypes from 'prop-types'

class Text extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange (e) {
    this.setState({text: e.target.value})
    this.props.updateBroadcastData(this.props.blockId, this.props.componentId, 'update', {updateField: 'text', updateValue: e.target.value})
  }

  render () {
    return (
      <div id='side_panel_text_component'>
        <span className='m--font-boldest'>Text:</span>
        <textarea
          className='form-control'
          style={{height: '100px'}}
          placeholder='Please type here...'
          value={this.state.text}
          onChange={this.onValueChange}
        />
      </div>
    )
  }
}

Text.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.string.isRequired,
  'componentId': PropTypes.string.isRequired
}

export default Text
