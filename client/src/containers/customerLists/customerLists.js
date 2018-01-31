/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerLists
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class CustomerLists extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      customerLists: [{'_id': '1', name: 'List 1'},
                      {'_id': '2', name: 'List 2'},
                      {'_id': '3', name: 'List 3'}],
      isShowingModalDelete: false,
      deleteid: '',
      editid: '',
      editName: '',
      isShowingModalEdit: false,
      isShowingModalCreate: false
    }
    this.showDialogCreate = this.showDialogCreate.bind(this)
    this.closeDialogCreate = this.closeDialogCreate.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogEdit = this.showDialogEdit.bind(this)
    this.closeDialogEdit = this.closeDialogEdit.bind(this)
    this.updateListName = this.updateListName.bind(this)
    props.loadMyPagesList()
    props.loadCustomerLists()
  }

  showDialogCreate (id) {
    this.setState({isShowingModalCreate: true})
    //  this.setState({deleteid: id})
  }

  closeDialogCreate () {
    this.setState({isShowingModalCreate: false})
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  showDialogEdit (list) {
    this.setState({isShowingModalEdit: true})
    this.setState({editid: list._id, editName: list.name})
  }

  closeDialogEdit () {
    this.setState({isShowingModalEdit: false})
  }

  updateListName (e) {
    this.setState({editName: e.target.value})
  }
  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding Customer Lists? <a href='#' target='_blank'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Customer Lists
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialogCreate}>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Create List
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-xl-8 order-2 order-xl-1' />
                        <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                          { this.state.isShowingModalCreate &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialogCreate}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialogCreate}>
                                <h3>Create Customer List</h3>
                                <p>To create a new list, click on Create New List. To create a sublist from an exisiting list, click on Create SubList</p>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <Link style={{color: 'white'}} className='btn btn-primary'>
                                      Create New List
                                    </Link>
                                  </div>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <Link to='' className='btn btn-primary'>
                                      Create SubList
                                    </Link>
                                  </div>
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                          }
                          {
                            this.state.isShowingModalEdit &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialogEdit}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialogEdit}>
                                <h3>Edit List Name</h3>
                                <input className='form-control'
                                  value={this.state.editName} onChange={(e) => this.updateListName(e)} />
                                <br />
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.closeDialogEdit()
                                  }}>Save
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }
                          {
                            this.state.isShowingModalDelete &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialogDelete}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialogDelete}>
                                <h3>Delete List</h3>
                                <p>Are you sure you want to delete this List?</p>
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.closeDialogDelete()
                                  }}>Delete
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }
                        </div>
                      </div>
                      { this.props.customerLists && this.props.customerLists.length > 0
                      ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                        <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                          <table className='m-datatable__table'
                            id='m-datatable--27866229129' style={{
                              display: 'block',
                              height: 'auto',
                              overflowX: 'auto'
                            }}>
                            <thead className='m-datatable__head'>
                              <tr className='m-datatable__row'
                                style={{height: '53px'}}>
                                <th data-field='title'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>List Name</span>
                                </th>
                                <th data-field='options'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '250px'}} />
                                </th>
                              </tr>
                            </thead>
                            <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                              {
                                this.props.customerLists.map((list, i) => (
                                  <tr data-row={i}
                                    className='m-datatable__row m-datatable__row--even'
                                    style={{height: '55px'}} key={i}>
                                    <td data-field='title'
                                      className='m-datatable__cell'>
                                      <span style={{width: '150px'}}>{list.listName}</span>
                                    </td>
                                    <td data-field='seemore'
                                      className='m-datatable__cell'>
                                      <span className='pull-right'
                                        style={{width: '250px'}}>
                                        <Link to='/listDetails' className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}} >
                                          View
                                        </Link>
                                        <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}}
                                          onClick={() => this.showDialogEdit(list)}>
                                          Edit
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}}
                                          onClick={() => this.showDialogDelete(list._id)}>
                                          Delete
                                        </button>
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    : <div className='table-responsive'>
                      <p> No data to display </p>
                    </div>
                    }
                    </div>
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
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    customerLists: (state.listsInfo.customerLists)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadCustomerLists: loadCustomerLists
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerLists)
