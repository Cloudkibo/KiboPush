import React from 'react'
import { loadCustomFields } from '../../redux/actions/customFields.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class CustomFields extends React.Component {
  componentDidMount () {
    this.props.loadCustomFields()
  }
  render () {
    console.log(this.props.customFields)
    return (
      <div style={{ transform: 'translate(0, 0)', marginLeft: '250px' }} className='modal-dialog' role='document'>
        <div className='modal-content' style={{ width: '900px' }} >
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
                <thead className='m-datatable__head' style={{background: '#f2f2f2'}}>
                  <tr className='m-datatable__row'
                    style={{ height: '53px', textAlign: 'left' }}>
                    <th data-field='#' style={{width: '30px', paddingLeft: '8px'}}
                      className='m-datatable__cell m-datatable__cell--sort'>
                      <span style={{ width: '30px', overflow: 'inherit' }}>#</span>
                    </th>
                    <th data-field='Name' style={{width: '270px'}}
                      className='m-datatable__cell m-datatable__cell--sort'>
                      <span style={{ width: '270px', overflow: 'inherit' }}>Name</span>
                    </th>
                    <th data-field='Type' style={{width: '100px'}}
                      className='m-datatable__cell m-datatable__cell--sort'>
                      <span style={{ width: '100px', overflow: 'inherit' }}>Type</span>
                    </th>
                    <th data-field='Description' style={{width: '400px'}}
                      className='m-datatable__cell m-datatable__cell--sort'>
                      <span style={{ width: '400px', overflow: 'inherit' }}>Description</span>
                    </th>
                    <th data-field='Action' style={{width: '120px', textAlign: 'center'}}
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
                        style={{height: '55px'}} key={i}>
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
                            <button style={{margin: '4px'}}
                              className='btn btn-primary btn-sm'>
                              <i style={{color: 'white', fontSize: '22px'}} className='la la-edit' />
                            </button>
                            <button style={{margin: '4px'}}
                              className='btn btn-primary btn-sm'>
                              <i style={{color: 'white', fontSize: '22px'}} className='la la-trash-o' />
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
    loadCustomFields: loadCustomFields
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFields)
