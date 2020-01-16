import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import YouTube from 'react-youtube'
import { loadCustomFields, deleteCustomField } from '../../redux/actions/customFields.actions'
import CreateCustomField from './createCustomField'
import AlertContainer from 'react-alert'

class CustomFields extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCustomField: null,
      displayVideo: true,
      totalLength: 0,
      filter: false,
      search_value: '',
      pageNumber: 0,
      showingSearchResult: true
    }
    props.loadCustomFields()
    this.createCustomField = this.createCustomField.bind(this)
    this.updateCustomField = this.updateCustomField.bind(this)
    this.deleteCustomField = this.deleteCustomField.bind(this)
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Custom Fields`;
  }

  deleteCustomField (customField) {
    this.setState({
        currentCustomField: customField
    }, () => { 
        this.refs.DeleteModal.click()
    })
  }

  createCustomField () {
      this.setState({
        currentCustomField: null
      }, () => {
        this.refs.CustomFieldModal.click()
      })
  }

  updateCustomField (customField) {
      this.setState({
        currentCustomField: customField
      }, () => {
        this.refs.CustomFieldModal.click()
      })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in customFields', nextProps)
  }

  render() {
    console.log('showingSearchResult', this.state.showingSearchResult)
    let alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='CustomFieldModal' data-toggle='modal' data-target='#create_modal'>CustomFieldModal</a>
        <a href='#/' style={{ display: 'none' }} ref='DeleteModal' data-toggle='modal' data-target='#delete_confirmation_modal'>DeleteModal</a>
        <CreateCustomField customField={this.state.currentCustomField} />
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
                <p>Are you sure you want to delete this custom field? It will be removed and unassigned from all subscribers.</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteCustomField(this.state.currentCustomField._id, this.msg)
                  }} data-dismiss='modal'>Yes
                </button>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' data-dismiss='modal'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Custom Fields Video Tutorial
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                        &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <YouTube
                  videoId='XZRjUDSZDWo'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Custom Fields</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {/* {
            this.props.pages && this.props.pages.length === 0 && !this.state.showingSearchResult
            ? <AlertMessage type='page' />
          : this.props.subscribers && this.props.subscribers.length === 0 &&
            <AlertMessage type='subscriber' />
          } */}
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding custom fields? Here is the <a href='http://kibopush.com/custom-fields/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        {/* <span className='m-portlet__head-icon'>
                          <i className='flaticon-interface-9' />
                        </span> */}
                        <h3 className='m-portlet__head-text m--font-primary'>
                          Default Fields
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      {/* <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.goToAddPages}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                New Field
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul> */}
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    {/* <div className='row align-items-center'>
                      <div className='col-xl-4 col-lg-4 col-md-4'>
                        <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' onChange={this.searchPages} placeholder='Search...' id='generalSearch' />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                      </div>
                    </div> */}
                    {this.props.customFields && this.props.customFields.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='name'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Name</span>
                              </th>
                              <th data-field='type'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Type</span>
                              </th>
                              <th data-field='description'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '200px' }}>Description</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.props.customFields.filter((cf) => cf.default).map((field, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{field.name}</span></td>
                                  <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{field.type}</span></td>
                                  <td data-field='description' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '200px' }}>{field.description}</span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                        <button className='btn btn-primary btn-sm'
                                            style={{ float: 'right', margin: 2 }}>
                                            Delete
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                            style={{ float: 'right', margin: 2 }}>
                                            Edit
                                        </button>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        {/* <div className='pagination'>
                          <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a href='#/'>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            forcePage={this.state.pageNumber} />
                        </div> */}
                      </div>
                      : <span>
                        <p> No data to display </p>
                      </span>
                    }
                  </div>

                </div>
              </div>
            </div>

          </div>


          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        {/* <span className='m-portlet__head-icon'>
                          <i className='flaticon-interface-9' />
                        </span> */}
                        <h3 className='m-portlet__head-text m--font-primary'>
                          User Fields
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.createCustomField}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                New Field
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    {/* <div className='row align-items-center'>
                      <div className='col-xl-4 col-lg-4 col-md-4'>
                        <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' onChange={this.searchPages} placeholder='Search...' id='generalSearch' />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                      </div>
                    </div> */}
                    {this.props.customFields && this.props.customFields.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='name'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Name</span>
                              </th>
                              <th data-field='type'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Type</span>
                              </th>
                              <th data-field='description'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '200px' }}>Description</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.props.customFields.filter((cf) => !cf.default).map((field, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{field.name}</span></td>
                                  <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{field.type}</span></td>
                                  <td data-field='description' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '200px' }}>{field.description}</span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                        <button className='btn btn-primary btn-sm'
                                            style={{ float: 'right', margin: 2 }}
                                            onClick={() => this.deleteCustomField(field)}>
                                            Delete
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                            onClick={() => this.updateCustomField(field)}
                                            style={{ float: 'right', margin: 2 }}>
                                            Edit
                                        </button>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        {/* <div className='pagination'>
                          <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a href='#/'>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            forcePage={this.state.pageNumber} />
                        </div> */}
                      </div>
                      : <span>
                        <p> No data to display </p>
                      </span>
                    }
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customFields: (state.customFieldInfo.customFields)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadCustomFields,
    deleteCustomField
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFields)
