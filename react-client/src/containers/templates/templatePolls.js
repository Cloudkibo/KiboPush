import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsListNew, loadCategoriesList, deletePoll } from '../../redux/actions/templates.actions'
import { saveCurrentPoll } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'

class templatePolls extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadPollsListNew({last_id: 'none', number_of_records: 5, first_page: 'first', filter: false, filter_criteria: {search_value: '', category_value: ''}})
    props.loadCategoriesList()
    this.state = {
      pollsData: [],
      pollsDataAll: [],
      totalLength: 0,
      filterValue: '',
      isShowingModalDelete: false,
      deleteid: '',
      filteredByCategory: [],
      searchValue: '',
      filter: false,
      pageNumber: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPoll = this.searchPoll.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onPollClick = this.onPollClick.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
  }

  goToCreate () {
    if (this.props.totalCount < this.props.kiboPushTemplates) {
      this.props.history.push({
        pathname: `/createTemplatePoll`
      })
    } else {
      this.msg.error(`Cannot create more than ${this.props.kiboPushTemplates} Poll Templates!`)
    }
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Template Polls`;
  }

  onPollClick (e, poll) {
    this.props.saveCurrentPoll(poll)
  }
  displayData (n, broadcasts) {
    let offset = n * 5
    let data = []
    let limit
    let index = 0
    if ((offset + 5) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    this.setState({pollsData: data, pollsDataAll: broadcasts})
  }
  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadPollsListNew({last_id: 'none', number_of_records: 5, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, category_value: this.state.filterValue}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadPollsListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 5, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, category_value: this.state.filterValue}})
    } else {
      this.props.loadPollsListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.polls.length > 0 ? this.props.polls[0]._id : 'none', number_of_records: 5, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, category_value: this.state.filterValue}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.state.pollsDataAll)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.polls && nextProps.count) {
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({pollsData: [], pollsDataAll: [], totalLength: 0})
    }
  }
  searchPoll (event) {
    //  var filtered = []
    this.setState({searchValue: event.target.value})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 5, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value, category_value: this.state.filterValue}})
    } else {
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 5, first_page: 'first', filter: true, filter_criteria: {search_value: '', category_value: this.state.filterValue}})
    }
    //   if (this.state.filteredByCategory && this.state.filteredByCategory.length > 0) {
    //     for (let i = 0; i < this.state.filteredByCategory.length; i++) {
    //       if (this.state.filteredByCategory[i].title && this.state.filteredByCategory[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
    //         filtered.push(this.state.filteredByCategory[i])
    //       }
    //     }
    //   } else {
    //     for (let i = 0; i < this.props.polls.length; i++) {
    //       if (this.props.polls[i].title && this.props.polls[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
    //         filtered.push(this.props.polls[i])
    //       }
    //     }
    //   }
    // } else {
    //   if (this.state.filteredByCategory && this.state.filteredByCategory.length > 0) {
    //     filtered = this.state.filteredByCategory
    //   } else {
    //     filtered = this.props.polls
    //   }
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    //  var filtered = []
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true})
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 5, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, category_value: e.target.value}})
    } else {
      this.props.loadPollsListNew({last_id: this.props.polls.length > 0 ? this.props.polls[this.props.polls.length - 1]._id : 'none', number_of_records: 5, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, category_value: ''}})
    }
    //   for (let i = 0; i < this.props.polls.length; i++) {
    //     if (e.target.value === 'all') {
    //       if (this.props.polls[i].category.length > 1) {
    //         filtered.push(this.props.polls[i])
    //       }
    //     } else {
    //       for (let j = 0; j < this.props.polls[i].category.length; j++) {
    //         if (this.props.polls[i].category[j] === e.target.value) {
    //           filtered.push(this.props.polls[i])
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   filtered = this.props.polls
    // }
    // this.setState({filteredByCategory: filtered})
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
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
      <div className='template-polls row'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deletePoll" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Poll
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this poll?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deletePoll(this.state.deleteid, this.msg, { last_id: 'none', number_of_records: 5, first_page: 'first', filter: false, filter_criteria: { search_value: '', category_value: '' } })
                    this.closeDialogDelete()
                  }} data-dismiss='modal'>Delete
                        </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Polls
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <Link onClick={this.goToCreate} >
                  <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Create New
                      </span>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-xl-8 order-2 order-xl-1' />
                <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                </div>
              </div>
              <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-group m-form__group row align-items-center'>
                  <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4'>
                    <input type='text' value={this.state.searchValue} placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={(event) => { this.searchPoll(event) }} />
                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                      <span><i className='la la-search' /></span>
                    </span>
                  </div>
                  <div style={{margin: '5px'}} className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                  <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                    <div className='m-form__label'>
                      <label>Category:&nbsp;&nbsp;</label>
                    </div>
                    <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                      <option value='' disabled>Filter by Category...</option>
                      <option value='all'>All</option>
                      {
                        this.props.categories && this.props.categories.length > 0 && this.props.categories.map((category, i) => (
                          <option value={category.name}>{category.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                {
                  this.state.pollsData && this.state.pollsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
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
                            <span style={{width: '150px'}}>Title</span>
                          </th>
                          <th data-field='category'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Category</span>
                          </th>
                          <th data-field='created'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Created At</span>
                          </th>
                          <th data-field='seemore'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '170px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.state.pollsData.map((poll, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='title'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{poll.title}</span></td>
                              <td data-field='category' className='m-datatable__cell'>
                                <span style={{width: '150px'}}>{poll.category.join(
                            ',')}</span>
                              </td>
                              <td data-field='created'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '150px'}}>{handleDate(poll.datetime)}</span></td>
                              <td data-field='seemore'
                                className='m-datatable__cell'>
                                <span style={{width: '170px'}}>
                                  <Link onClick={(e) => { let pollSelected = poll; this.onPollClick(e, pollSelected) }} to={'/viewPoll'} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                    View
                                  </Link>
                                  <Link onClick={(e) => { let pollSelected = poll; this.onPollClick(e, pollSelected) }} to={'/editPoll'} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                    Edit
                                  </Link>
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.showDialogDelete(poll._id)}
                                    data-toggle="modal" data-target="#deletePoll">
                                  Delete
                                </button>
                                </span></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href='#/'>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 5)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      forcePage={this.state.pageNumber} />
                  </div>
                  : <p> No data to display </p>
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
    polls: state.templatesInfo.polls,
    count: state.templatesInfo.pollsCount,
    categories: state.templatesInfo.categories,
    totalCount: state.templatesInfo.totalPollsCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPollsListNew: loadPollsListNew,
      loadCategoriesList: loadCategoriesList,
      deletePoll: deletePoll,
      saveCurrentPoll: saveCurrentPoll
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(templatePolls)
