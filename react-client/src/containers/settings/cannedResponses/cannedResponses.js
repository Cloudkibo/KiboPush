import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { loadcannedResponses, deleteCannedResponse } from '../../../redux/actions/settings.actions'
import CreateCannedResponse from './createCannedResponse'

class cannedResponses extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      cannedResponses: [],
      searchValue: '',
      dataForSearch: [],
      currentcannedResponse: null
    }
    this.props.loadcannedResponses()
    this.expendRowToggle = this.expendRowToggle.bind(this)
    this.search = this.search.bind(this)
    this.createCannedResponse = this.createCannedResponse.bind(this)
    this.updateCannedResponse = this.updateCannedResponse.bind(this)
    this.deleteCannedResponse = this.deleteCannedResponse.bind(this)
  }

  deleteCannedResponse (cannedResponse) {
    this.setState({
      currentcannedResponse: cannedResponse
    }, () => {
      this.refs.DeleteModal.click()
    })
  }

  createCannedResponse (cannedResponse) {
    this.setState({
      currentcannedResponse: null
    }, () => {
      this.refs.cannedReponseModal.click()
    })
}

  updateCannedResponse (cannedResponse) {
    console.log('cannedResponse', cannedResponse)
    this.setState({
      currentcannedResponse: cannedResponse
    }, () => {
      this.refs.cannedReponseModal.click()
    })
  }

UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.cannedResponses !== this.props.cannedResponses) {
      this.setState({ cannedResponses: nextProps.cannedResponses, dataForSearch: nextProps.cannedResponses })
    }
  }

  search (event) {
    if (this.state.dataForSearch.length > 0) {
      let searchArray = []
      if (event.target.value !== '') {
        this.state.dataForSearch.forEach(element => {
          if (element.responseCode.toLowerCase().includes(event.target.value.toLowerCase())) searchArray.push(element)
        })
        this.setState({ cannedResponses: searchArray, searchValue: event.target.value })
      } else {
        let dataForSearch = this.state.dataForSearch
        this.setState({ cannedResponses: dataForSearch, searchValue: event.target.value })
      }
    }
  }

  expendRowToggle (cannedResponse, row) {
    let currentDisplay = document.getElementById(`child-table-${row}`).style.display
    if (currentDisplay === 'block') {
      document.getElementById(`child-table-${row}`).style.display = 'none'
    } else {
      document.getElementById(`child-table-${row}`).style.display = 'block'
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='DeleteModal' data-toggle='modal' data-target='#delete_confirmation_modal'>DeleteModal</a>
        <a href='#/' style={{ display: 'none' }} ref='cannedReponseModal' data-toggle='modal' data-target='#create_modal'>CustomFieldModal</a>
        <CreateCannedResponse cannedResponse={this.state.currentcannedResponse ? { ...this.state.currentcannedResponse } : null} />
        <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 99991}} className='modal fade' id='delete_confirmation_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', paddingLeft: '70px', marginTop: '150px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '400px' }} >
              <div style={{ display: 'block' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Are You Sure?
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close'
                  data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>
                    &times;
                  </span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Are you sure you want to delete this Canned Response?</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteCannedResponse({ responseId: this.state.currentcannedResponse._id }, this.msg)
                  }} data-dismiss='modal'>Yes
                </button>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' data-dismiss='modal'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    canned Responses
                  </span>
                </li>
              </ul>
              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle='modal' data-target='#endpoint' style={{marginTop: '15px'}} onClick={this.createCannedResponse}>
                <span>
                  <i className='la la-plus' />
                  <span>
                    Create
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-7 input-group'>
                  <input className='form-control m-input m-input--solid' type='text' placeholder='Search Scanned Responses...' aria-label='Search' value={this.state.searchValue} onChange={this.search} />
                </div>
              </div>
              {this.state.cannedResponses && this.state.cannedResponses.length > 0 ?
                <div
                  className='m_datatable m-datatable m-datatable--default m-datatable--brand m-datatable--subtable m-datatable--loaded'
                  id='child_data_local'
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  <table
                    className='m-datatable__table'
                    id='m-datatable-urls'
                    style={{ display: 'block', height: 'auto', overflowX: 'auto' } }
                  >
                    <thead className='m-datatable__head'> 
                      <tr className='m-datatable__row' style={{ height: '53px' }}>
                        <th 
                          data-field='RecordID'
                          className='m-datatable__cell--center m-datatable__cell'
                        >
                          <span style={{ width: '20px' }} />
                        </th>
                        <th 
                          data-field='code'
                          className='m-datatable__cell m-datatable__cell--center'
                        >
                          <span style={{ width: '150px' }}>
                            Canned Response Code
                          </span>
                        </th>
                        <th 
                          data-field='Action'
                          className='m-datatable__cell m-datatable__cell--center'
                        >
                          <span style={{ width: '150px' }}>
                            Action
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='m-datatable__body' style={{ maxHeight: '500px', overflow: 'auto' }}>
                      {
                        this.state.cannedResponses && this.state.cannedResponses.map((cannedResponse, i) =>
                          (
                            <span key={i}>
                              <tr
                                data-row={i}
                                id={`row-${i}`}
                                className='m-datatable__row m-datatable__row--even'
                                style={{ height: 55 }}
                              >
                                <td
                                  data-field='RecordID'
                                  className='m-datatable__cell--center m-datatable__cell'
                                >
                                  <span style={{ width: '20px' }}>
                                    <div
                                      className='m-datatable__toggle-subtable'
                                      href='javascript:void(0)'
                                      data-value={i}
                                      onClick={() => this.expendRowToggle(cannedResponse, i)}
                                      title='Canned Response Message'
                                    >
                                      <i className='fa fa-caret-right' id={`icon-${i}`} />
                                    </div>
                                  </span>
                                </td>
                                <td
                                  data-field='code'
                                  className='m-datatable__cell m-datatable__cell--center'
                                >
                                  <span style={{ width: '150px' }}>{cannedResponse.responseCode}</span>
                                </td>
                                <td data-field='Actions' className='m-datatable__cell m-datatable__cell--center'>
                                  <span style={{ overflow: 'visible', width: '150px' }}>
                                    <a
                                      href='/#'
                                      data-toggle='modal'
                                      data-target='#edit'
                                      data-placement='bottom'
                                      onClick={() => { this.updateCannedResponse(cannedResponse) }}
                                      className='m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill'
                                      title='Edit details'
                                    >
                                      <i className='la la-edit' />
                                    </a>
                                    <a
                                      href='/#'
                                      onClick={() => this.deleteCannedResponse(cannedResponse)}
                                      data-toggle='modal'
                                      data-target='#delete'
                                      data-placement='bottom'
                                      title='Delete url'
                                      className='m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill'
                                    >
                                      <i className='la la-trash' />
                                    </a>
                                  </span>
                                </td>
                              </tr>
                              <tr className='m-datatable__row-detail' id={`child-table-${i}`} style={{display: 'none'}}>
                                <p style={{ marginLeft: '35px', wordBreak: 'break-all' }}>{cannedResponse.responseMessage}</p>
                              </tr>
                            </span>
                          ))
                      }
                    </tbody>
                  </table>
                </div>
                : <p style={{ marginTop: '20px' }}>No Data to display</p>
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
    cannedResponses: state.settingsInfo.cannedResponses
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadcannedResponses: loadcannedResponses,
    deleteCannedResponse: deleteCannedResponse
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(cannedResponses)