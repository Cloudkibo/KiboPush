/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerListsNew, saveCurrentList, deleteList, clearCurrentList
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import ReactPaginate from 'react-paginate'

class CustomerLists extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModalDelete: false,
      deleteid: '',
      customerLists: [],
      totalLength: 0,
      pageNumber: 0
    }
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.saveCurrentList = this.saveCurrentList.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    props.loadMyPagesList()
    props.loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: true})
    props.clearCurrentList()
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  updateListName (e) {
    this.setState({editName: e.target.value})
  }
  saveCurrentList (list) {
    browserHistory.push({
      pathname: `/customerListDetails`,
      state: {module: 'customerList'}
    })
    this.props.saveCurrentList(list)
  }
  componentDidMount () {
    this.scrollToTop()
  }
  displayData (n, lists) {
    console.log('in displayData', lists)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > lists.length) {
      limit = lists.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = lists[i]
      index++
    }
    this.setState({customerLists: data})
  }

  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    if (data.selected === 0) {
      this.props.loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: true})
    } else {
      this.props.loadCustomerListsNew({last_id: this.props.customerLists.length > 0 ? this.props.customerLists[this.props.customerLists.length - 1]._id : 'none', number_of_records: 10, first_page: false})
    }
    this.displayData(data.selected, this.props.customerLists)
  }
  componentWillReceiveProps (nextProps) {
    console.log('nextProps.customerLists', nextProps.customerLists)
    if (nextProps.customerLists && nextProps.count) {
      // this.setState({broadcasts: nextProps.broadcasts});
      this.displayData(0, nextProps.customerLists)
      this.setState({ totalLength: nextProps.count })
    }
    // var lists = []
    // for (var i = 0; i < nextProps.customerLists.length; i++) {
    //   if (nextProps.customerLists[i].initialList) {
    //     lists.push(nextProps.customerLists[i])
    //   }
    // }
    // this.setState({
    //   customerLists: lists
    // })
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
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
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
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
                                this.props.deleteList(this.state.deleteid, this.msg)
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
                                    <button to='/listDetails' className='btn btn-primary btn-sm'
                                      style={{float: 'left', margin: 2}} onClick={() => this.saveCurrentList(list)}>
                                      View
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
                      <div className='pagination'>
                        <ReactPaginate previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={<a>...</a>}
                          breakClassName={'break-me'}
                          pageCount={Math.ceil(this.state.totalLength / 10)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={this.handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                          forcePage={this.state.pageNumber} />
                      </div>
                    </div>
                  </div>
                : <div className='table-responsive'>
                  <p> No data to display </p>
                </div>
                }
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                    <Link to='/customerMatchingUsingPhNum' className='btn btn-primary'>
                      Back
                    </Link>
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
    customerLists: (state.listsInfo.customerLists),
    count: (state.listsInfo.count)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadCustomerListsNew: loadCustomerListsNew,
    saveCurrentList: saveCurrentList,
    deleteList: deleteList,
    clearCurrentList: clearCurrentList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerLists)
