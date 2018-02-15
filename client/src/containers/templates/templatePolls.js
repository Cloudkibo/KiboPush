import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPollsList, loadCategoriesList, deletePoll } from '../../redux/actions/templates.actions'
import { saveCurrentPoll } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class templatePolls extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadPollsList()
    props.loadCategoriesList()
    this.state = {
      pollsData: [],
      pollsDataAll: [],
      totalLength: 0,
      filterValue: '',
      isShowingModalDelete: false,
      deleteid: '',
      filteredByCategory: [],
      searchValue: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchPoll = this.searchPoll.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onPollClick = this.onPollClick.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
  }
  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }
  onPollClick (e, poll) {
    console.log('Poll Click', poll)
    this.props.saveCurrentPoll(poll)
  }
  displayData (n, broadcasts) {
    console.log('one', broadcasts)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      console.log('b[i]', broadcasts[i])
      data[index] = broadcasts[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({pollsData: data, pollsDataAll: broadcasts})
    console.log('in displayData', this.state.pollsData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.pollsDataAll)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userbroadcasts componentWillReceiveProps is called')
    if (nextProps.polls) {
      console.log('polls Updated', nextProps.polls)
      this.displayData(0, nextProps.polls)
      this.setState({ totalLength: nextProps.polls.length })
    }
  }
  searchPoll (event) {
    var filtered = []
    this.setState({searchValue: event.target.value})
    if (event.target.value !== '') {
      if (this.state.filteredByCategory && this.state.filteredByCategory.length > 0) {
        for (let i = 0; i < this.state.filteredByCategory.length; i++) {
          if (this.state.filteredByCategory[i].title && this.state.filteredByCategory[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
            filtered.push(this.state.filteredByCategory[i])
          }
        }
      } else {
        for (let i = 0; i < this.props.polls.length; i++) {
          if (this.props.polls[i].title && this.props.polls[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
            filtered.push(this.props.polls[i])
          }
        }
      }
    } else {
      if (this.state.filteredByCategory && this.state.filteredByCategory.length > 0) {
        filtered = this.state.filteredByCategory
      } else {
        filtered = this.props.polls
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    console.log(e.target.value)
    this.setState({filterValue: e.target.value, searchValue: ''})
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.polls.length; i++) {
        if (e.target.value === 'all') {
          if (this.props.polls[i].category.length > 1) {
            filtered.push(this.props.polls[i])
          }
        } else {
          for (let j = 0; j < this.props.polls[i].category.length; j++) {
            if (this.props.polls[i].category[j] === e.target.value) {
              filtered.push(this.props.polls[i])
            }
          }
        }
      }
    } else {
      filtered = this.props.polls
    }
    this.setState({filteredByCategory: filtered})
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
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
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='template-polls row'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
                <Link to='/createTemplatePoll' >
                  <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Create Poll
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
                  {
                    this.state.isShowingModalDelete &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={this.closeDialogDelete}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={this.closeDialogDelete}>
                        <h3>Delete Poll</h3>
                        <p>Are you sure you want to delete this poll?</p>
                        <button style={{float: 'right'}}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.props.deletePoll(this.state.deleteid, this.msg)
                            this.closeDialogDelete()
                          }}>Delete
                        </button>
                      </ModalDialog>
                    </ModalContainer>
                  }
                </div>
              </div>
              { this.props.polls && this.props.polls.length > 0
              ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-group m-form__group row align-items-center'>
                  <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                    <input type='text' value={this.state.searchValue} placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={(event) => { this.searchPoll(event) }} />
                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                      <span><i className='la la-search' /></span>
                    </span>
                  </div>
                  <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                  <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                    <div className='m-form__label'>
                      <label>Category:&nbsp;&nbsp;</label>
                    </div>
                    <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                      <option value='' disabled>Filter by Category...</option>
                      <option value=''>All</option>
                      {
                        this.props.categories.map((category, i) => (
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
                        {console.log('pollsData', this.state.pollsData)}
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
                                    onClick={() => this.showDialogDelete(poll._id)}>
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
                      breakLabel={<a>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 4)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />
                  </div>
                  : <p> No search results found. </p>
                }
              </div>
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
    polls: state.templatesInfo.polls,
    categories: state.templatesInfo.categories
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPollsList: loadPollsList,
      loadCategoriesList: loadCategoriesList,
      deletePoll: deletePoll,
      saveCurrentPoll
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(templatePolls)
