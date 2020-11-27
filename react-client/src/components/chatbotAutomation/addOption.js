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
      skipAllowed: false
    }
    this.state = {
      title: '',
      selectedBlock: '',
      selectedRadio: '',
      additionalActions: this.props.additionalActions ? this.props.additionalActions : this.initialAdditionalActions
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
  }

  updateAdditonalActions (updated) {
    this.setState({
      additionalActions: {
        ...this.state.additionalActions, 
        ...updated
      }
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
          <div className="form-group m-form__group">
            <label>{this.props.showRemove ? 'Linked to block:' : 'Action:'}</label>
            {
              !this.props.showRemove &&
              <div className="m-radio-list">
                {
                  this.props.isCreatable &&
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
                }
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
            }
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
          {
            <div style={{    
                marginBottom: "10px",
                marginLeft: "5px",
                cursor: "pointer",
                fontWeight: 500,
                color: "#575962",
              }}>
                {
                  (this.props.additionalActions || this.props.showAdditionalActions) &&
                  <span data-toggle='collapse' data-target='#customFields'
                    onClick={() => this.updateAdditonalActions({showing: !this.state.additionalActions.showing})}>
                    Additional Actions{" "}
                    {this.state.additionalActions.showing
                      ? <i style={{ fontSize: '12px' }} className='la la-angle-up ' />
                      : <i style={{ fontSize: '12px' }} className='la la-angle-down ' />
                    }
                  </span>
                }
           </div>
          }
          {
            this.state.additionalActions.showing &&
            <div style={{maxWidth: '220px'}}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                options={this.additionalOptions}
                value={this.additionalOptions.find(o => o.value === this.state.additionalActions.query)}
                onChange={(value) => this.updateAdditonalActions({query: value ? value.value : ""})}
              />
              {
                this.state.additionalActions.query &&
                <>
                  <div style={{marginTop: '5px', marginLeft: '3px', fontSize: '12px'}}>
                    Note: Subscriber's {this.getCorrespondingCustomField()} will be stored in the {this.getCorrespondingCustomField()} custom field once this is selected.
                  </div>
                  <label style={{fontSize: '13px', marginLeft: '5px', color: "#575962", marginTop: "10px"}} className="m--font-bolder">
                    <input
                      style={{position: 'relative', top: '2px', marginRight: "5px"}}
                      type="checkbox"
                      checked={this.state.additionalActions.keyboardInputAllowed}
                      onChange={(e) => this.updateAdditonalActions({keyboardInputAllowed: e.target.checked})}
                    />
                    Allow Keyboard Input
                  </label>
                  <label style={{fontSize: '13px', marginLeft: '5px', color: "#575962", marginTop: "5px"}} className="m--font-bolder">
                    <input
                      style={{position: 'relative', top: '2px', marginRight: "5px"}}
                      type="checkbox"
                      checked={this.state.additionalActions.skipAllowed}
                      onChange={(e) => this.updateAdditonalActions({skipAllowed: e.target.checked})}
                    />
                    Allow Skip
                  </label>
                </>
              }
            </div>
          }
          {
            this.props.showRemove &&
            <button
              type='button'
              style={{marginTop: '20px', marginBottom: '10px'}}
              className='btn btn-danger btn-sm pull-left'
              onClick={this.onRemove}
            >
              Remove
            </button>
          }
          <button
            type='button'
            style={{marginTop: '20px', marginBottom: '10px'}}
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
