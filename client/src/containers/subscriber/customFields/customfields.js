import React from 'react'
import { loadCustomFields, deleteCustomField } from '../../redux/actions/customFields.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class CustomFields extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      deleteCustomFieldId: ''
    }
    this.deleteCustomField = this.deleteCustomField.bind(this)
    this.toBeDeletedId = this.toBeDeletedId.bind(this)
    this.closeDeleteConfirmation = this.closeDeleteConfirmation.bind(this)
  }
  componentDidMount () {
    this.props.loadCustomFields()
  }
  closeDeleteConfirmation () {
    const modal = document.getElementById('delete_confirmation_modal')
    modal.classList.remove('show')
    modal.classList.add('hide')
  }
  deleteCustomField () {
    this.props.deleteCustomField(this.state.deleteCustomFieldId, this.msg)
    this.setState({
      deleteCustomFieldId: ''
    })
  }
  toBeDeletedId (id) {
    const modal = document.getElementById('delete_confirmation_modal')
    modal.classList.add('show')
    this.setState({
      deleteCustomFieldId: id
    })
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
      <div style={{width: '1px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 1000}} className='modal fade' id='delete_confirmation_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', marginLeft: '500px', marginTop: '150px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '400px' }} >
              <div style={{ display: 'block' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Are You Sure ?
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
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
                    this.deleteCustomField()
                    this.closeDeleteConfirmation()
                  }}>Yes
                </button>
                <button style={{float: 'right'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.closeDeleteConfirmation()
                  }}>Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ transform: 'translate(0, 0)', marginLeft: '250px' }} className='modal-dialog' role='document'>
          <div className='modal-content' style={{ width: '900px', maxHeight: '530px', overflowY: 'auto', minHeight: '530px' }} >
            <div style={{ display: 'block' }} className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Custom Fields
            </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
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
                              {field.name}
                            </span></td>
                          <td data-field='Type'
                            className='m-datatable__cell'>
                            <span style={{ width: '100px', overflow: 'inherit' }}>
                              {field.type}
                            </span></td>
                          <td data-field='Description'
                            className='m-datatable__cell'>
                            <span style={{ width: '400px', overflow: 'inherit' }}>
                              {field.description}
                            </span></td>
                          <td data-field='Action'
                            className='m-datatable__cell'>
                            <span style={{ width: '120px', overflow: 'inherit', display: 'inline-block' }}>
                              <button style={{ margin: '4px' }}
                                className='btn btn-primary btn-sm'>
                                <i style={{ color: 'white', fontSize: '22px' }} className='la la-edit' />
                              </button>
                              <button style={{ margin: '4px' }} data-toggle='modal' data-target='#delete_confirmation_modal'
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                  this.toBeDeletedId(field._id)
                                }}>
                                <i style={{ color: 'white', fontSize: '22px' }} className='la la-trash-o' />
                              </button>
                            </span></td>
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
    deleteCustomField: deleteCustomField
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFields)
