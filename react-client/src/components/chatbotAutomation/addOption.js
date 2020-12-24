import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class AddOption extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.initialAdditionalActions = {
      showing: false,
      query: '',
      keyboardInputAllowed: false,
      skipAllowed: { isSkip: false }
    }
    let selectedRadioSkip = 'create'
    if (this.props.additionalActions && this.props.additionalActions.skipAllowed && this.props.additionalActions.skipAllowed.blockId) {
      selectedRadioSkip = 'link'
    }
    const existingBlocks = props.blocks.map((item) => {
      return {
        label: item.title,
        value: item.uniqueId
      }
    })
    this.state = {
      title: '',
      skipTitle: '',
      selectedRadioSkip, 
      additionalActions: this.props.additionalActions ? this.props.additionalActions : this.initialAdditionalActions,
      existingBlocks
    }
    this.additionalOptions = [
      {
        label: 'Get Email Address',
        value: 'email'
      },
      {
        label: 'Get Phone Number',
        value: 'phone'
      }
    ]
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onBlockChange = this.onBlockChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onRadioClick = this.onRadioClick.bind(this)
    this.getSelectOptions = this.getSelectOptions.bind(this)
    this.updateAdditonalActions = this.updateAdditonalActions.bind(this)
    this.getCorrespondingCustomField = this.getCorrespondingCustomField.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
    this.updateSkipRadio = this.updateSkipRadio.bind(this)
    this.updateSkipAdditonalActions = this.updateSkipAdditonalActions.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.blocks) {
      const existingBlocks = nextProps.blocks.map((item) => {
        return {
          label: item.title,
          value: item.uniqueId
        }
      })
      return ({ existingBlocks })
    }
    return null
  }

  checkDisabled () {
    if (!this.state.title || 
      (this.state.selectedRadioSkip === 'create' && !this.state.additionalActions.skipAllowed.messageBlockTitle) ||
      (this.state.selectedRadioSkip === 'link' && !this.state.additionalActions.skipAllowed.blockId)
    ) {
      return true
    }
  }

  updateAdditonalActions (updated) {
    this.setState({
      additionalActions: {
        ...this.state.additionalActions,
        ...updated
      },
      selectedRadioSkip:
        updated.skipAllowed && !updated.skipAllowed.isSkip ? '' : this.state.selectedRadioSkip
    })
  }

  updateSkipAdditonalActions (updated) {
    this.setState({
      additionalActions: {
        ...this.state.additionalActions, 
        skipAllowed: {
          ...this.state.additionalActions.skipAllowed,
          ...updated,
        }
      },
    })
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
      selectedRadio: this.props.action,
      additionalActions: this.props.additionalActions ? this.props.additionalActions : this.initialAdditionalActions
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
        this.state.selectedBlock.value,
        this.state.additionalActions.query ? this.state.additionalActions : null
      )
      this.props.onCancel()
    }
  }

  onUpdate () {
    this.props.onUpdate(
      this.state.selectedBlock.value,
      this.props.index,
      this.state.title,
      this.state.additionalActions.query ? this.state.additionalActions : null
    )
    this.props.onCancel()
  }

  onRemove () {
    this.props.onRemove(
      this.state.selectedBlock.value,
      this.props.index
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

  updateSkipRadio (selectedRadioSkip) {
    this.setState({
      additionalActions: {
        ...this.state.additionalActions,
        blockId: null,
        messageBlockTitle: ''
      },  
      selectedRadioSkip
    })
  }

  getCorrespondingCustomField () {
    if (this.state.additionalActions.query === 'email') {
      return "Email"
    } else if (this.state.additionalActions.query === 'phone') {
      return "Phone Number"
    }
  }

  render () {
    return (
      <div>
        <i
          onClick={this.props.onCancel}
          style={{ cursor: 'pointer' }}
          className='la la-close pull-right'
        />
        <div style={{ paddingTop: '10px' }}>
          <div className='form-group m-form__group'>
            <label>Title:</label>
            <input
              type='text'
              className='form-control m-input'
              placeholder='Enter title...'
              value={this.state.title}
              onChange={this.onTitleChange}
            />
          </div>
          <div className='m--space-10' />
          <div className='form-group m-form__group'>
            <label>{this.props.showRemove ? 'Linked to block:' : 'Action:'}</label>
            {!this.props.showRemove && (
              <div className='m-radio-list'>
                {this.props.isCreatable && (
                  <label className='m-radio m-radio--bold m-radio--state-brand'>
                    <input
                      type='radio'
                      onClick={this.onRadioClick}
                      onChange={() => {}}
                      value='create'
                      checked={this.state.selectedRadio === 'create'}
                    />
                    Create new block
                    <span />
                  </label>
                )}
                <label className='m-radio m-radio--bold m-radio--state-brand'>
                  <input
                    type='radio'
                    onClick={this.onRadioClick}
                    onChange={() => {}}
                    value='link'
                    checked={this.state.selectedRadio === 'link'}
                  />
                  Link existing block
                  <span />
                </label>
              </div>
            )}
            {this.state.selectedRadio === 'link' && (
              <Select
                className='basic-single'
                classNamePrefix='select'
                isClearable={true}
                isSearchable={true}
                options={this.state.existingBlocks}
                value={this.state.selectedBlock}
                onChange={this.onBlockChange}
              />
            )}
          </div>
          {
            <div
              style={{
                marginBottom: '10px',
                marginLeft: '5px',
                cursor: 'pointer',
                fontWeight: 500,
                color: '#575962'
              }}
            >
              <span
                data-toggle='collapse'
                data-target='#customFields'
                onClick={() =>
                  this.updateAdditonalActions({ showing: !this.state.additionalActions.showing })
                }
              >
                Additional Actions{' '}
                {this.state.additionalActions.showing ? (
                  <i style={{ fontSize: '12px' }} className='la la-angle-up ' />
                ) : (
                  <i style={{ fontSize: '12px' }} className='la la-angle-down ' />
                )}
              </span>
            </div>
          }
          {this.state.additionalActions.showing && (
            <div style={{ maxWidth: '220px' }}>
              <Select
                className='basic-single'
                classNamePrefix='select'
                isClearable={true}
                options={this.additionalOptions}
                value={this.additionalOptions.find(
                  (o) => o.value === this.state.additionalActions.query
                )}
                onChange={(value) =>
                  this.updateAdditonalActions({ query: value ? value.value : '' })
                }
              />
              {this.state.additionalActions.query && (
                <>
                  <div style={{ marginTop: '5px', marginLeft: '3px', fontSize: '12px' }}>
                    Note: Subscriber's {this.getCorrespondingCustomField()} will be stored in the{' '}
                    {this.getCorrespondingCustomField()} custom field once this is selected.
                  </div>
                  <label
                    style={{
                      fontSize: '13px',
                      marginLeft: '5px',
                      color: '#575962',
                      marginTop: '10px'
                    }}
                    className='m--font-bolder'
                  >
                    <input
                      style={{ position: 'relative', top: '2px', marginRight: '5px' }}
                      type='checkbox'
                      checked={this.state.additionalActions.keyboardInputAllowed}
                      onChange={(e) =>
                        this.updateAdditonalActions({ keyboardInputAllowed: e.target.checked })
                      }
                    />
                    Allow Keyboard Input
                  </label>
                  <label
                    style={{
                      fontSize: '13px',
                      marginLeft: '5px',
                      color: '#575962',
                      marginTop: '5px'
                    }}
                    className='m--font-bolder'
                  >
                    <input
                      style={{ position: 'relative', top: '2px', marginRight: '5px' }}
                      type='checkbox'
                      checked={this.state.additionalActions.skipAllowed.isSkip}
                      onChange={(e) =>
                        this.updateAdditonalActions({ skipAllowed: { isSkip: e.target.checked } })
                      }
                    />
                    Allow Skip
                  </label>

                  {this.state.additionalActions.skipAllowed.isSkip && (
                    <div style={{marginTop: '10px', marginLeft: '3px'}} className='m-radio-list'>
                      {!this.props.additionalActions && (
                        <label className='m-radio m-radio--bold m-radio--state-brand'>
                          <input
                            type='radio'
                            onClick={() => this.updateSkipRadio('create')}
                            onChange={() => {}}
                            value='create'
                            checked={this.state.selectedRadioSkip === 'create'}
                          />
                          Create new block for skip
                          <span />
                        </label>
                      )}
                      {
                        this.state.selectedRadioSkip === 'create' &&
                        <input
                          type="text"
                          className="form-control m-input"
                          placeholder="Enter block title for skip..."
                          value={this.state.additionalActions.skipAllowed.messageBlockTitle}
                          onChange={(e) => this.updateSkipAdditonalActions({messageBlockTitle: e.target.value})}
                          style={{marginBottom: '10px'}}
                        />
                      }
                      <label className='m-radio m-radio--bold m-radio--state-brand'>
                        <input
                          type='radio'
                          onClick={() => this.updateSkipRadio('link')}
                          onChange={() => {}}
                          value='link'
                          checked={this.state.selectedRadioSkip === 'link'}
                        />
                        Link existing block for skip
                        <span />
                      </label>
                      {
                        this.state.selectedRadioSkip === 'link' &&
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          isClearable={true}
                          isSearchable={true}
                          options={this.state.existingBlocks}
                          value={this.state.existingBlocks.find(o => o.value === this.state.additionalActions.skipAllowed.blockId)}
                          onChange={
                            (value) => this.updateSkipAdditonalActions({
                              blockId: value ? value.value : null, 
                              messageBlockTitle: value ? value.label : ''
                            })
                          }
                        />
                      }
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {this.props.showRemove && (
            <button
              type='button'
              style={{ marginTop: '20px', marginBottom: '10px' }}
              className='btn btn-danger btn-sm pull-left'
              onClick={this.onRemove}
            >
              Remove
            </button>
          )}
          <button
            type='button'
            style={{ marginTop: '20px', marginBottom: '10px' }}
            className='btn btn-primary btn-sm pull-right'
            onClick={this.props.showRemove ? this.onUpdate : this.onSave}
            disabled={this.checkDisabled()}
          >
            Save
          </button>
        </div>
      </div>
    )
  }
}

AddOption.defaultProps = {
  'isCreatable': true
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
  'onUpdate': PropTypes.func.isRequired,
  'isCreatable': PropTypes.bool
}

export default AddOption
