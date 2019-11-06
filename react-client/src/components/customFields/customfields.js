import React from 'react'
import { loadCustomFields, deleteCustomField, updateCustomField } from '../../redux/actions/customFields.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import CreateCustomField from './createCustomField'

class CustomFields extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      deleteCustomFieldId: '',
      disabled: '',
      toBeUpdateCustomField: {},
      updatedName: '',
      updatedDescription: '',
      updateValueName: false,
      updatevalueDescription: false,
      nameFieldEmpty: true
    }
    this.deleteCustomField = this.deleteCustomField.bind(this)
    this.toBeDeletedId = this.toBeDeletedId.bind(this)
    this.editClick = this.editClick.bind(this)
    this.onUpdateSubmit = this.onUpdateSubmit.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.customFields) {
      this.props.onLoadCustomFields(nextProps.customFields)
    }
  }

  componentDidMount () {
    this.props.loadCustomFields()
  }
  deleteCustomField (id) {
    this.props.deleteCustomField(id, this.msg)
    this.setState({
      deleteCustomFieldId: ''
    })
  }
  toBeDeletedId (id) {
    this.setState({
      deleteCustomFieldId: id
    })
  }
  editClick (field) {
    this.setState({disabled: field._id, toBeUpdateCustomField: field})
  }
  remove () {
    setTimeout(() => { this.setState({ disabled: '', updatedName: '', updatedDescription: '', updatevalueDescription: false, updateValueName: false }) }, 100)
  }
  onNameChange (event) {
    this.setState({updatedName: event.target.value, updateValueName: true, nameFieldEmpty: false})
    if (event.target.value === '' || event.target.value === this.state.toBeUpdateCustomField.name) this.setState({nameFieldEmpty: true})
  }

  onDescriptionChange (event) {
    this.setState({updatedDescription: event.target.value, updatevalueDescription: true})
    if (event.target.value !== this.state.toBeUpdateCustomField.description) this.setState({nameFieldEmpty: false})
    else this.setState({nameFieldEmpty: true})
  }
  onUpdateSubmit () {
    let data = {
      customFieldId: this.state.disabled,
      updated: {
        description: this.state.updatedDescription.toLocaleLowerCase()
      }
    }
    if (this.state.toBeUpdateCustomField.name !== this.state.updatedName) data.updated.name = this.state.updatedName.toLocaleLowerCase()
    this.props.updateCustomField(data, this.msg)
    this.setState({toBeUpdateCustomField: {}, disabled: '', updatedName: '', updatedDescription: '', updatevalueDescription: false, updateValueName: false, nameFieldEmpty: true})
    this.props.loadCustomFields()
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <CreateCustomField />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 99991}} className='modal fade' id='delete_confirmation_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', paddingLeft: '70px', marginTop: '150px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '400px' }} >
              <div style={{ display: 'block' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Are You Sure ?
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close'
                  data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>
                    &times;
                  </span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Are you sure you want to delete? The custom field will be removed and unassigned from all the subscribers.</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.deleteCustomField(this.state.deleteCustomFieldId)
                  }} data-dismiss='modal'>Yes
                </button>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' data-dismiss='modal'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id='cf_modal' style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 9999}} className='modal fade' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div style={{ transform: 'translate(0, 0)', marginLeft: '250px' }} className='modal-dialog' role='document'>
          <div className='modal-content' style={{ width: '900px', maxHeight: '530px', overflowY: 'auto', minHeight: '530px' }} >
            <div style={{ display: 'block', height: '70px' }} className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Custom Fields
            </h5>
              <button style={{ marginTop: '-46px', marginLeft: '126px', borderRadius: '500px' }} type='button' className='btn btn-primary btn-sm'
                data-toggle='modal' data-target='#create_modal'>
                  Create Custom Field
              </button>
              <button style={{ marginTop: '-10px', opacity: '0.5', float: 'right' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>
                  &times;
              </span>
              </button>
            </div>
            <div className='modal-body'>
              {this.props.customFields && this.props.customFields.length > 0
                ? <table className='m-datatable__table'
                  id='m-datatable--27866229129' style={{
                    display: 'block',
                    height: 'auto',
                    overflowX: 'auto'
                  }}>
                  <thead className='m-datatable__head' style={{ background: '#f2f2f2' }}>
                    <tr className='m-datatable__row'
                      style={{ height: '53px', textAlign: 'left' }}>
                      <th data-field='#' style={{ width: '30px', paddingLeft: '8px' }}
                        className='m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '30px', overflow: 'inherit' }}>#</span>
                      </th>
                      <th data-field='Name' style={{ width: '270px' }}
                        className='m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '270px', overflow: 'inherit' }}>Name</span>
                      </th>
                      <th data-field='Type' style={{ width: '100px' }}
                        className='m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '100px', overflow: 'inherit' }}>Type</span>
                      </th>
                      <th data-field='Description' style={{ width: '400px' }}
                        className='m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '400px', overflow: 'inherit' }}>Description</span>
                      </th>
                      <th data-field='Action' style={{ width: '120px', textAlign: 'center' }}
                        className='m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '100px', overflow: 'inherit' }}>Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='m-datatable__body' style={{ textAlign: 'left' }}>
                    {
                      this.props.customFields.map((field, i) => (
                        <tr data-row={i}
                          className='m-datatable__row m-datatable__row--even subscriberRow'
                          style={{ height: '55px' }} key={i}>
                          <td data-field='#'
                            className='m-datatable__cell'>
                            <span style={{ width: '30px', overflow: 'inherit', paddingLeft: '8px' }}>
                              {i + 1}
                            </span></td>
                          <td data-field='Name'
                            className='m-datatable__cell'>
                            <span style={{ width: '270px', overflow: 'inherit' }}>
                              <input type='text' id='name' className='form-control m-input'
                                value={(this.state.disabled === field._id && this.state.updateValueName)
                                ? this.state.updatedName
                                : field.name}
                                onChange={this.onNameChange} disabled={!(this.state.disabled === field._id)} />
                            </span></td>
                          <td data-field='Type'
                            className='m-datatable__cell'>
                            <span style={{ width: '100px', overflow: 'inherit' }}>
                              {field.type}
                            </span></td>
                          <td data-field='Description'
                            className='m-datatable__cell'>
                            <span style={{ width: '400px', overflow: 'inherit' }}>
                              <input type='text' id='description' className='form-control m-input'
                                value={this.state.updatevalueDescription && this.state.disabled === field._id
                                ? this.state.updatedDescription : field.description}
                                onChange={this.onDescriptionChange} disabled={!(this.state.disabled === field._id)} />
                            </span></td>
                          {this.state.disabled === field._id
                            ? <td data-field='Action' className='m-datatable__cell'>
                              <span style={{ width: '120px', overflow: 'inherit', display: 'inline-block' }}>
                                <button style={{ margin: '4px' }} className='btn btn-success btn-sm'
                                  onClick={() => {
                                    this.onUpdateSubmit()
                                  }} disabled={this.state.nameFieldEmpty}>
                                  <i style={{ color: 'white', fontSize: '22px' }} className='la la-check' />
                                </button>
                                <button style={{ margin: '4px' }} className='btn btn-danger btn-sm'
                                  onClick={() => {
                                    this.remove()
                                  }}>
                                  <i style={{ color: 'white', fontSize: '22px' }} className='la la-remove' />
                                </button>
                              </span>
                            </td>
                            : <td data-field='Action' className='m-datatable__cell'>
                              <span style={{ width: '120px', overflow: 'inherit', display: 'inline-block' }}>
                                <button style={{ margin: '4px' }}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => { this.editClick(field) }}>
                                  <i style={{ color: 'white', fontSize: '22px' }} className='la la-edit' />
                                </button>
                                <button style={{ margin: '4px' }} data-toggle='modal' data-target='#delete_confirmation_modal'
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.toBeDeletedId(field._id)
                                  }}>
                                  <i style={{ color: 'white', fontSize: '22px' }} className='la la-trash-o' />
                                </button>
                              </span>
                            </td>
                            }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                : <div className='table-responsive'>
                  <p> No data to display </p>
                </div>
              }
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    customFields: (state.customFieldInfo.customFields)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadCustomFields: loadCustomFields,
    deleteCustomField: deleteCustomField,
    updateCustomField: updateCustomField
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFields)
