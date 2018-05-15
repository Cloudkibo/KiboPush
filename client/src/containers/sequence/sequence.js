/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence, deleteSequence } from '../../redux/actions/sequence.action'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class Sequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sequencesData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      isShowingModalDelete: false,
      isShowingModal: false,
      deleteid: '',
      name: '',
      error: false,
      pageNumber: 0,
      filter: false
    }
    props.fetchAllSequence()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSequence = this.searchSequence.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.goToEdit = this.goToEdit.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.updateName = this.updateName.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.getSequenceStatus = this.getSequenceStatus.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  getSequenceStatus (messages) {
    var active = 'InActive'
    messages.map((msg, i) => {
      if (msg.isActive) {
        active = 'Active'
        return active
      }
    })
    return active
  }
  gotoCreate () {
    if (this.state.name === '') {
      this.setState({error: true})
    } else {
      this.props.createSequence({name: this.state.name})
      browserHistory.push({
        pathname: `/editSequence`,
        state: {name: this.state.name, module: 'create'}
      })
    }
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  componentDidMount () {
    this.scrollToTop()
    document.title = 'KiboPush | Sequence Messaging'
  }
  updateName (e) {
    this.setState({name: e.target.value, error: false})
  }
  displayData (n, sequences) {
    let offset = n * 5
    let data = []
    let limit
    let index = 0
    if ((offset + 5) > sequences.length) {
      limit = sequences.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = sequences[i]
      index++
    }
    this.setState({sequencesData: data})
  }

  handlePageClick (data) {
    // this.setState({pageNumber: data.selected})
    // if (data.selected === 0) {
    //   this.props.fetchAllSequenceNew({last_id: 'none', number_of_records: 10, first_page: true, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue}})
    // } else {
    //   this.props.fetchAllSequenceNew({last_id: this.props.sequences.length > 0 ? this.props.sequences[this.props.sequences.length - 1]._id : 'none', number_of_records: 10, first_page: false, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue}})
    // }
    this.displayData(data.selected, this.props.sequences)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sequences) {
      this.displayData(0, nextProps.sequences)
      this.setState({ totalLength: nextProps.sequences.length })
    }
  }

  searchSequence (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    if (event.target.value !== '') {
      // this.setState({filter: true})
      // this.props.fetchAllSequenceNew()
      for (let i = 0; i < this.props.sequences.length; i++) {
        if (this.props.sequences[i].sequence && this.props.sequences[i].sequence.name && this.props.sequences[i].sequence.name.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.sequences[i])
        }
      }
    // } else if (event.target.value !== '' && this.state.filterValue !== '') {
    //   for (let i = 0; i < this.props.sequences.length; i++) {
    //     if (this.props.sequences[i].sequence && this.props.sequences[i].sequence.name && this.props.sequences[i].sequence.name.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.sequences[i].teamPagesIds.indexOf(this.state.filterValue) !== -1) {
    //       filtered.push(this.props.sequences[i])
    //     }
    //   }
    // } else {
    //   // this.setState({filter: false})
    //   // this.props.fetchAllSequenceNew()
    // }
      this.displayData(0, filtered)
      this.setState({ totalLength: filtered.length })
    } else {
      this.displayData(0, this.props.sequences)
      this.setState({ totalLength: this.props.sequences })
    }
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '' && this.state.searchValue === '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].teamPagesIds.indexOf(e.target.value) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else if (e.target.value !== '' && this.state.searchValue !== '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].name && this.props.teams[i].name.toLowerCase().includes(this.state.searchValue.toLowerCase()) && this.props.teams[i].teamPagesIds.indexOf(e.target.value) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else {
      filtered = this.props.teams
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  goToEdit (sequence) {
    // var agents = []
    // var pages = []
    // for (var i = 0; i < this.props.teamUniqueAgents.length; i++) {
    //   if (team._id === this.props.teamUniqueAgents[i].teamId) {
    //     agents.push(this.props.teamUniqueAgents[i])
    //   }
    // }
    // for (var j = 0; j < this.props.teamUniquePages.length; j++) {
    //   if (team._id === this.props.teamUniquePages[j].teamId) {
    //     pages.push(this.props.teamUniquePages[j])
    //   }
    // }
    // console.log('agents', agents)
    // console.log('pages', pages)
    browserHistory.push({
      pathname: `/editSequence`,
      state: {module: 'edit', name: sequence.name, _id: sequence._id}
    })
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
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
            {
              this.state.isShowingModalDelete &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialogDelete}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialogDelete}>
                  <h3>Delete Sequence</h3>
                  <p>Are you sure you want to delete this Sequence?</p>
                  <button style={{float: 'right'}}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      this.props.deleteSequence(this.state.deleteid, this.msg)
                      this.closeDialogDelete()
                    }}>Delete
                  </button>
                </ModalDialog>
              </ModalContainer>
            }
            {
              this.state.isShowingModal &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialog}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialog}>
                  <h3>Create Sequence</h3>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Sequence Name:</label>
                    {this.state.error &&
                      <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>Please enter a name</bold></div>
                      }
                    <input className='form-control' placeholder='Enter sequence name here'
                      value={this.state.name} onChange={(e) => this.updateName(e)} />
                  </div>
                  <button style={{float: 'right'}}
                    className='btn btn-primary btn-sm'
                    onClick={() => this.gotoCreate()}>Create
                  </button>
                </ModalDialog>
              </ModalContainer>
            }
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Sequence Messaging</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding Sequence Messaging? Here is the <a href='#' target='_blank'>documentation</a>.
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            All Sequences
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <Link onClick={this.showDialog}>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                  Create New Sequence
                                </span>
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      {
                        this.props.sequences && this.props.sequences.length > 0
                        ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                          <div className='form-group m-form__group row align-items-center'>
                            <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                              <input type='text' placeholder='Search sequence by name ...' className='form-control m-input m-input--solid' onChange={this.searchSequence} />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                            </div>
                            <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />

                          </div>
                          {
                            this.state.sequencesData && this.state.sequencesData.length > 0
                            ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                              <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                                <thead className='m-datatable__head'>
                                  <tr className='m-datatable__row'
                                    style={{height: '53px'}}>
                                    <th data-field='name'
                                      className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                      <span style={{width: '100px'}}>Name</span>
                                    </th>
                                    <th data-field='pages'
                                      className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                      <span style={{width: '100px'}}>Subscribers</span>
                                    </th>
                                    <th data-field='created_by'
                                      className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                      <span style={{width: '100px'}}>Messages</span>
                                    </th>
                                    <th data-field='datetime'
                                      className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                      <span style={{width: '100px'}}>Status</span>
                                    </th>
                                    <th data-field='actions'
                                      className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                      <span style={{width: '175px'}}>Actions</span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                  {
                                    this.state.sequencesData.map((sequence, i) => (
                                      <tr key={i} data-row={i}
                                        className={((i % 2) === 0) ? 'm-datatable__row' : 'm-datatable__row m-datatable__row--even'}
                                        style={{height: '55px'}}>
                                        <td data-field='name' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}>{sequence.sequence.name}</span></td>
                                        <td data-field='pages' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}>{sequence.subscribers.length}</span></td>
                                        <td data-field='created_by' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}>{sequence.messages.length}</span></td>
                                        <td data-field='datetime' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}>{this.getSequenceStatus(sequence.messages)}</span></td>
                                        <td data-field='actions' className='m-datatable__cell'>
                                          <span style={{width: '175px'}}>
                                            <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.goToEdit(sequence.sequence)}>
                                                Edit
                                              </button>
                                            <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(sequence.sequence._id)}>
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
                                <ReactPaginate
                                  previousLabel={'previous'}
                                  nextLabel={'next'}
                                  breakLabel={<a>...</a>}
                                  breakClassName={'break-me'}
                                  pageCount={Math.ceil(this.state.totalLength / 5)}
                                  marginPagesDisplayed={2}
                                  pageRangeDisplayed={3}
                                  onPageChange={this.handlePageClick}
                                  containerClassName={'pagination'}
                                  subContainerClassName={'pages pagination'}
                                  activeClassName={'active'} />
                              </div>
                            </div>
                            : <p>No data to display</p>
                          }
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence,
    createSequence: createSequence,
    deleteSequence: deleteSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
