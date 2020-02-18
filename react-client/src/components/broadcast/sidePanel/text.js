import React from 'react'
import PropTypes from 'prop-types'

class Text extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.componentData.text
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange (e) {
    this.setState({text: e.target.value})
    let data = this.props.componentData
    data.text = e.target.value
    this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of text side panel called ', nextProps)
    if (nextProps.componentData) {
      this.setState({text: nextProps.componentData.text})
    }
  }

  render () {
    console.log('props in text side panel', this.props)
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
  'blockId': PropTypes.number.isRequired
}

export default Text
