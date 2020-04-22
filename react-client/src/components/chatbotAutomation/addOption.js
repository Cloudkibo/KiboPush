import React from 'react'
import PropTypes from 'prop-types'

class AddOption extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      blockId: props.blockId,
      selectedRadio: props.action
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onBlockChange = this.onBlockChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onRadioClick = this.onRadioClick.bind(this)
  }

  onTitleChange (e) {
    if (e.target.value.length <= 20) {
      this.setState({title: e.target.value})
    }
  }

  onRadioClick (e) {
    this.setState({selectedRadio: e.target.value})
  }

  onBlockChange (e) {
    this.setState({blockId: e.target.value})
  }

  onSave () {
    if (!this.state.title) {
      this.props.alertMsg.error('Title cannot empty')
    } else if (this.state.selectedRadio === 'link' && !this.state.blockId) {
      this.props.alertMsg.error('Please select a block to trigger')
    } else {
      this.props.onSave(
        this.state.title,
        this.state.selectedRadio,
        this.state.blockId
      )
      this.props.onCancel()
    }
  }

  onUpdate () {
    this.props.onUpdate(
      this.props.blockId,
      this.props.index,
      this.state.title,
      this.props.payloadAction
    )
    this.props.onCancel()
  }

  onRemove () {
    this.props.onRemove(
      this.props.blockId,
      this.props.index,
      this.props.payloadAction
    )
    this.props.onCancel()
  }

  render () {
    return (
      <div>
        <i onClick={this.props.onCancel} style={{cursor: 'pointer'}} className='la la-close pull-right' />
        <div style={{paddingTop: '10px', overflow: 'hidden'}}>
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
                <select
                  className="form-control m-input"
                  value={this.state.blockId}
                  onChange={this.onBlockChange}
                >
                  <option value='' disabled>Select a block...</option>
                  {
                    this.props.blocks.map((block) => (
                      <option key={block._id} value={block.uniqueId}>{block.title}</option>
                    ))
                  }
                </select>
              }
            </div>
          }
          {
            this.props.showRemove &&
            <button
              type='button'
              className='btn btn-danger btn-sm pull-left'
              onClick={this.onRemove}
            >
              Remove
            </button>
          }
          <button
            type='button'
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
