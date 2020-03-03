import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Popover, PopoverBody } from 'reactstrap'
import Select from 'react-select'

const hoverOn = {
    cursor: 'pointer',
    border: '1px solid #3c3c7b',
    borderRadius: '30px',
    marginBottom: '7px',
    background: 'rgb(60, 60, 123, 0.5)'
  }
  
const hoverOff = {
    cursor: 'pointer',
    border: '1px solid rgb(220, 220, 220)',
    borderRadius: '30px',
    marginBottom: '7px',
    background: 'white'
}

class CustomFields extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        show: false,
        showingPopover: false,
        hoverId: '',
        selectedField: {
            label: '',
            value: ''
        },
        defaultFields: this.props.customFieldOptions.filter(cf => !!cf.default).map((cf) => (
            {
                label: cf.label,
                value: cf._id,
                type: cf.type,
                group: 'default'
            }
        )),
        userDefinedFields: this.props.customFieldOptions.filter(cf => !cf.default).map((cf) => (
            {
                label: cf.label,
                value: cf._id,
                type: cf.type,
                group: 'userDefined'
            }
        )),
        currentSelected: '',
        currentSelectedValue: '',
        settingCustomField: false,
        currentTarget: 'customFieldTarget1'
    }
    this.toggle = this.toggle.bind(this)
    this.hoverOn = this.hoverOn.bind(this)
    this.hoverOff = this.hoverOff.bind(this)
    this.toggleSetFieldPopover = this.toggleSetFieldPopover.bind(this)
    this.handleSetCustomField = this.handleSetCustomField.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.setCustomField = this.setCustomField.bind(this)
  }

  setCustomField () {
      this.setState({showingPopover: true, settingCustomField: true, currentTarget:'setCustomField'})
  }

  toggle () {
      this.setState({show: !this.state.show})
  }

  hoverOn(id) {
    this.setState({ hoverId: id })
  }

  hoverOff() {
    this.setState({ hoverId: '' })
  }

  togglePopover () {
      this.setState({showingPopover: !this.state.showingPopover, 
        selectedField: {
            label: '',
            value: ''
        },
        settingCustomField: false
    })
  }

  toggleSetFieldPopover(field, currentTarget) {
    console.log('field', field)
    this.setState({ showingPopover: true, currentTarget, selectedField: field })
  }

  handleSetCustomField (e) {
      let selectedField = this.state.selectedField
      if (selectedField) {
          selectedField.value = e.target.value
          this.setState({selectedField})
      }
  }

  saveCustomField () {
    let data = {
      customFieldId: this.state.selectedField._id,
      subscriberIds: [this.props.activeSession._id],
      value: this.state.selectedField.value
    }
    this.props.setCustomFieldValue(data)
    this.setState({showingPopover: false, selectedField: {
            label: '',
            value: ''
        },
        settingCustomField: false
    })
  }

  onSelectChange (selected) {
    console.log('onSelectChange', selected)
    this.setState({selectedField: {
        label: selected.label,
        _id: selected.value,
        type: selected.type,
        value: ''
    }})
}

  render () {
    let setFieldInput = <input
        className='form-control m-input'
        placeholder='value'
        onChange={this.handleSetCustomField}
        value={this.state.selectedField.value}
    />
    if (this.state.selectedField) {
        if (this.state.selectedField.type === 'text') {
            setFieldInput = <input
                className='form-control m-input'
                placeholder='value'
                onChange={this.handleSetCustomField}
                value={this.state.selectedField.value}
            />
        } else if (this.state.selectedField.type === 'number') {
            setFieldInput = <input
                type='number'
                className='form-control m-input'
                placeholder='value'
                onChange={this.handleSetCustomField}
                value={this.state.selectedField.value}
            />
        } else if (this.state.selectedField.type === 'date') {
            setFieldInput = <input className='form-control m-input'
                value={this.state.selectedField.value}
                onChange={this.handleSetCustomField}
                type='date' />
        } else if (this.state.selectedField.type === 'datetime') {
            setFieldInput = setFieldInput = <input className='form-control m-input'
                value={this.state.selectedField.value}
                onChange={this.handleSetCustomField}
                type='datetime-local' />
        } else if (this.state.selectedField.type === 'true/false') {
            setFieldInput = <select className='custom-select' id='type' value={this.state.selectedField.value} style={{ width: '250px' }} tabIndex='-98' onChange={this.handleSetCustomField}>
                <option key='' value='' disabled>...Select...</option>
                <option key='true' value='true'>True</option>
                <option key='false' value='false'>False</option>
            </select>
        }
    }
    let options = [
        {
          label: 'Default Fields',
          options: this.state.defaultFields,
        }
    ]
    if (this.state.userDefinedFields.length > 0) {
        options.push({
            label: 'User Defined Fields',
            options: this.state.userDefinedFields,
        })
    }
    return (
        <div>
            <div className='row'>
                <div className='col-12'>
                    <span style={{ fontWeight: 500, marginLeft: '10px', fontSize: '12px' }}>
                        {this.props.customFieldOptions && this.props.customFieldOptions.length > 0
                        ? <span>
                            <h6>
                                <span id='customFieldsHeader'  data-toggle='collapse' data-target='#customFields' style={{ cursor: 'pointer' }}
                                    onClick={this.toggle}>
                                    Custom Fields
                                    {   this.state.show
                                        ? <i style={{ fontSize: '12px' }} className='la la-angle-up ' />
                                        : <i style={{ fontSize: '12px' }} className='la la-angle-down ' />
                                    }
                                </span>
                                <Link to='/customFields'>
                                    <span id='customfieldid' style={{ color: '#575962', cursor: 'pointer', float: 'right' }}><i className='la la-gear' style={{ fontSize: '13px' }} /> Manage</span>
                                </Link>
                            </h6>
                        </span>
                        : null
                        }
                    </span>
                </div>
            </div>

            <div id='customFields' style={{ overflowY: this.state.showingPopover ? 'hidden' : 'scroll', overflowX: 'hidden', maxHeight: '20vh' }} className='collapse'>
                <div id='setCustomField' style={{marginBottom: '10px'}}>
                    <span onClick={this.setCustomField} className='m-link' style={{ cursor: 'pointer' }}>+ Set Custom Field</span>
                </div>
                {
                    this.props.customFieldOptions.filter(cf => !!cf.value).map((field, i) => (
                    <div id={`customFieldTarget${i+1}`} key={i} className='row'>
                        <div className='col-sm-12'>
                            <div onClick={() => { this.toggleSetFieldPopover({...field}, `customFieldTarget${i+1}`) }}
                                onMouseEnter={() => { this.hoverOn(field._id) }}
                                onMouseLeave={this.hoverOff}
                                style={field._id === this.state.hoverId ? hoverOn : hoverOff}>
                                <span style={{ marginLeft: '10px' }}>
                                <span style={{ fontWeight: '100' }}>{field.label} : </span>
                                <span style={{ color: '#3c3c7b' }}>{field.value === "" ? 'Not Set' : field.value}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    ))
                }

                <Popover 
                    modifiers={
                        {
                        preventOverflow: {
                            enabled: false,
                          },
                          flip: {
                            enabled: false,
                          }
                        }
                    }
                    placement='left' 
                    className='subscriberPopover' 
                    isOpen={this.state.showingPopover} 
                    target={this.state.currentTarget}
                    toggle={this.togglePopover}>
                    <PopoverBody>
                        {
                            this.state.settingCustomField ? 
                            <div className='row' style={{width: '250px'}}>
                                <div className='col-12'>
                                    <Select
                                        options={options}
                                        onChange={this.onSelectChange}
                                        placeholder={'Select a Custom Field'}
                                    />
                                </div>
                                
                                <div style={{marginTop: '10px'}} className='col-12'>
                                    {setFieldInput}
                                </div>
                                
                              <div style={{marginTop: '10px', textAlign: 'center'}} className='col-12'>
                                <button disabled={!this.state.selectedField || !this.state.selectedField.value} onClick={() => this.saveCustomField()} className='btn btn-primary'>
                                  Save
                                </button>
                              </div>
                            </div>
                            : 
                            <div className='row'>
                                <div className='col-12'>
                                    <label>Set "{this.state.selectedField.label}" Value</label>
                                    {setFieldInput}
                                </div>
                                <button style={{ float: 'right', marginTop: '15px', marginLeft: '200px' }}
                                    className='btn btn-primary btn-sm'
                                    onClick={() => {
                                        this.saveCustomField()
                                    }}
                                    disabled={!this.state.selectedField.value}>
                                    Save
                                </button>
                            </div>
                        }
                    </PopoverBody>
                </Popover>   
            </div>

            
        </div>
    )
  }
}

CustomFields.propTypes = {
    'activeSession': PropTypes.object.isRequired,
    'customFieldOptions': PropTypes.array.isRequired,
    'setCustomFieldValue': PropTypes.func.isRequired
  }
  
export default CustomFields
