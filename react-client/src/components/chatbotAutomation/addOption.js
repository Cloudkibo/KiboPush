import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class AddOption extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: '',
      selectedBlock: '',
      selectedRadio: ''
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onBlockChange = this.onBlockChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onRadioClick = this.onRadioClick.bind(this)
    this.getSelectOptions = this.getSelectOptions.bind(this)
  }

  componentDidMount () {
    let selectedBlock = ''
    if (this.props.blockId) {
      const block = this.props.blocks.find((item) => item.uniqueId.toString() === this.props.blockId.toString())
      selectedBlock = {
        label: block.title,
        value: this.props.blockId
      }
    }
    this.setState({
      title: this.props.title,
      selectedBlock,
      selectedRadio: this.props.action
    })
  }

  onTitleChange (e) {
    if (e.target.value.length <= 20) {
      this.setState({title: e.target.value})
    }
  }

  onRadioClick (e) {
    this.setState({selectedRadio: e.target.value})
  }

  onBlockChange (value, others) {
    console.log('onBlockChange', {value, others})
    this.setState({selectedBlock: value})
  }

  onSave () {
    if (!this.state.title) {
      this.props.alertMsg.error('Title cannot empty')
    } else if (this.state.selectedRadio === 'link' && !this.state.selectedBlock) {
      this.props.alertMsg.error('Please select a block to trigger')
    } else {
      this.props.onSave(
        this.state.title,
        this.state.selectedRadio,
        this.state.selectedBlock.value
      )
      this.props.onCancel()
    }
  }

  onUpdate () {
    this.props.onUpdate(
      this.state.selectedBlock.value,
      this.props.index,
      this.state.title,
      this.props.payloadAction
    )
    this.props.onCancel()
  }

  onRemove () {
    this.props.onRemove(
      this.state.selectedBlock.value,
      this.props.index,
      this.props.payloadAction
    )
    this.props.onCancel()
  }

  getSelectOptions () {
    const options = this.props.blocks.map((item) => {
      return {
        label: item.title,
        value: item.uniqueId
      }
    })
    return options
  }

  render () {
    return (
      <div>
        <i onClick={this.props.onCancel} style={{cursor: 'pointer'}} className='la la-close pull-right' />
        <div style={{paddingTop: '10px'}}>
          <div className="form-group m-form__group">
            <label>Title:</label>
  					<input
              type="text"
              className="form-control m-input"
              placeholder="Enter title..."
              value={this.state.title}
              onChange={this.onTitleChange}
            />
          </div>
          <div className='m--space-10' />
          {
            !this.props.showRemove &&
            <div className="form-group m-form__group">
              <label>Action:</label>
              <div className="m-radio-list">
                <label className="m-radio m-radio--bold m-radio--state-brand">
                  <input
                    type="radio"
                    onClick={this.onRadioClick}
                    onChange={() => {}}
                    value='create'
                    checked={this.state.selectedRadio === 'create'}
                  />
                    Create new block
                  <span />
                </label>
                <label className="m-radio m-radio--bold m-radio--state-brand">
                  <input
                    type="radio"
                    onClick={this.onRadioClick}
                    onChange={() => {}}
                    value='link'
                    checked={this.state.selectedRadio === 'link'}
                  />
                    Link existing block
                  <span />
                </label>
              </div>
              {
                this.state.selectedRadio === 'link' &&
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  options={this.getSelectOptions()}
                  value={this.state.selectedBlock}
                  onChange={this.onBlockChange}
                />
              }
            </div>
          }
          {
            this.props.showRemove &&
            <button
              type='button'
              style={{marginBottom: '10px'}}
              className='btn btn-danger btn-sm pull-left'
              onClick={this.onRemove}
            >
              Remove
            </button>
          }
          <button
            type='button'
            style={{marginBottom: '10px'}}
            className='btn btn-primary btn-sm pull-right'
            onClick={this.props.showRemove ? this.onUpdate : this.onSave}
            disabled={!(this.state.title)}
          >
            Save
          </button>
        </div>
      </div>
    )
  }
}

AddOption.propTypes = {
  'title': PropTypes.string.isRequired,
  'blockId': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  'blocks': PropTypes.array.isRequired,
  'onSave': PropTypes.func.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onRemove': PropTypes.func.isRequired,
  'showRemove': PropTypes.bool.isRequired,
  'action': PropTypes.string.isRequired,
  'payloadAction': PropTypes.string.isRequired,
  'onUpdate': PropTypes.func.isRequired
}

export default AddOption
