import React from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable'

const components = {
  DropdownIndicator: null,
}

const createOption = (label) => ({
  label,
  value: label.toLowerCase(),
})

class TriggerArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      inputValue: '',
      value: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount () {
    if (this.props.triggers) {
      this.setState({value: this.props.triggers.map((item) => {return {label: item, value: item}})})
    }
  }

  handleChange (value, actionMeta) {
    console.log('value', value)
    console.log('actionMeta', actionMeta)
    const triggers = value || []
    this.setState({value: triggers})
    this.props.updateParentState({triggers: triggers.map((item) => item.value)})
  }

  handleInputChange (inputValue) {
    this.setState({inputValue})
  }

  handleKeyDown (event) {
    const { inputValue, value } = this.state
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (value.map((item) => item.value).includes(inputValue.toLowerCase())) {
          this.props.alertMsg.error('Cannot add the same trigger twice.')
        } else {
          this.setState({
            inputValue: '',
            value: [...value, createOption(inputValue)]
          },
          () => {
            this.props.updateParentState({triggers: this.state.value.map((item) => item.value)})
          })
        }
        event.preventDefault()
        break
      default:
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.triggers) {
      this.setState({value: nextProps.triggers.map((item) => {return {label: item, value: item}})})
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div style={{position: 'relative'}} className="form-group m-form__group">
            <span className='m--font-boldest'>Triggers:</span>
            <CreatableSelect
              components={components}
              inputValue={this.state.inputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Type something and press enter..."
              value={this.state.value}
            />
          </div>
        </div>
      </div>
    )
  }
}

TriggerArea.propTypes = {
  'updateParentState': PropTypes.func.isRequired
}

export default TriggerArea
