/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerListsNew, saveCurrentList, deleteList, clearCurrentList
} from '../../redux/actions/customerLists.actions'
import ReactPaginate from 'react-paginate'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import AlertContainer from 'react-alert'

class SegmentedList extends React.Component {
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
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    props.loadMyPagesList()
    props.loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: 'first'})
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
      pathname: `/listDetails`,
      state: {module: 'customerList'}
    })
    this.props.saveCurrentList(list)
  }
  componentDidMount () {
    this.scrollToTop()
  }
  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: 'first'})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadCustomerListsNew({last_id: this.props.customerLists.length > 0 ? this.props.customerLists[this.props.customerLists.length - 1]._id : 'none', number_of_records: 10, first_page: 'next'})
    } else {
      this.props.loadCustomerListsNew({last_id: this.props.customerLists.length > 0 ? this.props.customerLists[0]._id : 'none', number_of_records: 10, first_page: 'previous'})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.customerLists)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.customerLists && nextProps.count) {
      var lists = []
      for (var i = 0; i < nextProps.customerLists.length; i++) {
        if (!(nextProps.customerLists[i].initialList)) {
          lists.push(nextProps.customerLists[i])
        } else {
          if (nextProps.customerLists[i].content && nextProps.customerLists[i].content.length > 0) {
            lists.push(nextProps.customerLists[i])
          }
        }
      }
      this.displayData(0, lists)
      this.setState({ totalLength: nextProps.count })
    }
  }

  displayData (n, lists) {
    if (lists) {
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
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
                  Need help in understanding Segmented Subscribers Lists? <a href='http://kibopush.com/segment-subscribers/' target='_blank'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Subscribers Segmentation Lists
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <Link to='createSubList' className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Create Segmented Subscribers List
                            </span>
                          </span>
                        </Link>
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
                      { this.state.customerLists && this.state.customerLists.length > 0
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
                                this.state.customerLists.map((list, i) => (
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
                                        {list.initialList
                                        ? <div>
                                          <Link to='/createSubList' className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}} disabled>
                                            Edit
                                          </Link>
                                        </div>
                                        : <div>
                                          <Link to='/createSubList' className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}} onClick={() => this.saveCurrentList(list)}>
                                            Edit
                                          </Link>
                                        </div>
                                      }
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
export default connect(mapStateToProps, mapDispatchToProps)(SegmentedList)
