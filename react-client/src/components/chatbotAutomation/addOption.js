import React from 'react'
import PropTypes from 'prop-types'

class AddOption extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      blockId: props.blockId,
      selectedRadio: 'create'
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onBlockChange = this.onBlockChange.bind(this)
    this.onSave = this.onSave.bind(this)
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
    } else if (!this.state.blockId) {
      this.props.alertMsg.error('Please select a block to trigger')
    } else {
      this.props.onSave({title: this.state.title, blockId: this.state.blockId})
    }
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
                    <option key={block._id} value={block._id}>{block.title}</option>
                  ))
                }
              </select>
            }
          </div>
            {
              this.props.showRemove &&
              <button
                type='button'
                className='btn btn-danger btn-sm pull-left'
                onClick={this.props.onRemove}
              >
                Remove
              </button>
            }
            <button
              type='button'
              className='btn btn-primary btn-sm pull-right'
              onClick={this.onSave}
              disabled={!(this.state.title && this.state.blockId)}
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
  'blockId': PropTypes.string.isRequired,
  'blocks': PropTypes.array.isRequired,
  'onSave': PropTypes.func.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'onRemove': PropTypes.func.isRequired,
  'showRemove': PropTypes.bool.isRequired
}

export default AddOption
