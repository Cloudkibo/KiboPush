/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence, deleteSequence, updateTrigger } from '../../redux/actions/sequence.action'
import { loadPollsList } from '../../redux/actions/poll.actions'
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
      filter: false,
      isShowModalTrigger: false,
      seqTriggerVal: 'subscribes_to_sequence',
      value: '',
      selectedSequenceName: '',
      isShowSequenceDropDown: false,
      isShowSequenceDropDownUnsub: false

    }
    props.fetchAllSequence()
    props.loadPollsList()
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
    this.showDialogTrigger = this.showDialogTrigger.bind(this)
    this.closeDialogTrigger = this.closeDialogTrigger.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSaveTrigger = this.handleSaveTrigger.bind(this)
    this.handleSequenceDropdown = this.handleSequenceDropdown.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({ behavior: 'instant' })
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
      this.setState({ error: true })
    } else {
      this.props.createSequence({ name: this.state.name })
      browserHistory.push({
        pathname: `/editSequence`,
        state: { name: this.state.name, module: 'create' }
      })
    }
  }
  showDialogDelete (id) {
    this.setState({ isShowingModalDelete: true })
    this.setState({ deleteid: id })
  }

  closeDialogDelete () {
    this.setState({ isShowingModalDelete: false })
  }

  showDialog () {
    this.setState({ isShowingModal: true })
  }

  closeDialog () {
    this.setState({ isShowingModal: false })
  }

  componentDidMount () {
    this.scrollToTop()
    document.title = 'KiboPush | Sequence Messaging'
  }
  updateName (e) {
    this.setState({ name: e.target.value, error: false })
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
    this.setState({ sequencesData: data })
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

  showDialogTrigger (sequence) {
    console.log('sequence' + JSON.stringify(sequence))
    if (sequence.sequence.trigger.event === 'seen_all_sequence_messages') {
      this.setState({isShowSequenceDropDown: true})
    } else if (sequence.sequence.trigger.event === 'unsubscribes_from_other_sequence') {
      this.setState({isShowSequenceDropDownUnsub: true})
    }
    this.setState({
      isShowModalTrigger: true,
      selectedSequenceId: sequence.sequence._id,
      seqTriggerVal: sequence.sequence.trigger.event,
      value: sequence.sequence.trigger.value
    })
  }

  closeDialogTrigger () {
    this.setState({ isShowModalTrigger: false })
  }

  handleChange (event) {
    this.setState({
      seqTriggerVal: event.target.value
    })
    if (event.target.value === 'seen_all_sequence_messages') {
      this.setState({
        isShowSequenceDropDown: true,
        isShowSequenceDropDownUnsub: false
      })
    } else if (event.target.value === 'unsubscribes_from_other_sequence') {
      this.setState({
        isShowSequenceDropDownUnsub: true,
        isShowSequenceDropDown: false
      })
    } else if (event.target.value === 'responds_to_poll') {
      console.log('res' + JSON.stringify(this.props.polls))
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false
      })
    } else if (event.target.value === 'subscriber_joins') {
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false
      })
    } else if (event.target.value === 'subscribes_to_sequence') {
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false
      })
    }
  }

  handleSequenceDropdown (event) {
    const selectedIndex = event.target.options.selectedIndex
    let selectSequenceId = event.target.options[selectedIndex].getAttribute('data-key')
    this.setState({ isShowModalTrigger: true, value: selectSequenceId, selectedSequenceName: event.target.value })
  }

  handleSaveTrigger (event) {
    let value = ''
    if (this.state.seqTriggerVal === 'subscriber_joins') {
      value = null
    } else if (this.state.seqTriggerVal === 'subscribes_to_sequence') {
      value = this.state.selectedSequenceId
    } else if (this.state.seqTriggerVal === 'seen_all_sequence_messages') {
      value = this.state.value
    } else if (this.state.seqTriggerVal === 'unsubscribes_from_other_sequence') {
      value = this.state.value
    } else if (this.state.seqTriggerVal === 'responds_to_poll') {
      value = null
    }

    var data = {
      trigger: {
        event: this.state.seqTriggerVal,
        value: value
      },
      type: 'sequence',
      sequenceId: this.state.selectedSequenceId
    }
    console.log('data' + JSON.stringify(data))
    this.props.updateTrigger(data)
    this.closeDialogTrigger()
    this.props.fetchAllSequence()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sequences) {
      this.displayData(0, nextProps.sequences)
      this.setState({ totalLength: nextProps.sequences.length })
    }
  }

  searchSequence (event) {
    this.setState({ searchValue: event.target.value })
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
    this.setState({ filterValue: e.target.value })
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
      state: { module: 'edit', name: sequence.name, _id: sequence._id }
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
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
          {
            this.state.isShowingModalDelete &&
            <ModalContainer style={{ width: '500px' }}
              onClose={this.closeDialogDelete}>
              <ModalDialog style={{ width: '500px' }}
                onClose={this.closeDialogDelete}>
                <h3>Delete Sequence</h3>
                <p>Are you sure you want to delete this Sequence?</p>
                <button style={{ float: 'right' }}
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
            <ModalContainer style={{ width: '500px' }}
              onClose={this.closeDialog}>
              <ModalDialog style={{ width: '500px' }}
                onClose={this.closeDialog}>
                <h3>Create Sequence</h3>
                <div id='question' className='form-group m-form__group'>
                  <label className='control-label'>Sequence Name:</label>
                  {this.state.error &&
                    <div id='email-error' style={{ color: 'red', fontWeight: 'bold' }}><bold>Please enter a name</bold></div>
                  }
                  <input className='form-control' placeholder='Enter sequence name here'
                    value={this.state.name} onChange={(e) => this.updateName(e)} />
                </div>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => this.gotoCreate()}>Create
                </button>
              </ModalDialog>
            </ModalContainer>
          }
          {
            this.state.isShowModalTrigger &&
            <ModalContainer style={{ width: '700px', paddingLeft: '33px', paddingRight: '33px' }}
              onClose={this.closeDialogTrigger}>
              <ModalDialog style={{ width: '700px', paddingLeft: '33px', paddingRight: '33px' }}
                onClose={this.closeDialogTrigger}>
                <h3 style={{ marginBottom: '20px' }}>Update Sequence Trigger</h3>
                <div className='row'>
                  <div className='col-sm-4 col-md-4 col-lg-4'>
                    <div className='sequence-trigger-box'>
                      <label>
                        <input
                          type='radio'
                          value='subscribes_to_sequence'
                          defaultChecked
                          checked={this.state.seqTriggerVal === 'subscribes_to_sequence'}
                          onChange={this.handleChange}
                        />
                        When subscriber subscribes to sequence
                     </label>
                    </div>
                  </div>
                  <div className='col-sm-4 col-md-4 col-lg-4' >
                    <div className='sequence-trigger-box'>
                      <label>
                        <input
                          type='radio'
                          value='subscriber_joins'
                          checked={this.state.seqTriggerVal === 'subscriber_joins'}
                          onChange={this.handleChange}
                        />
                        When subscriber joins
                     </label>
                    </div>
                  </div>
                  <div className='col-sm-4 col-md-4 col-lg-4'>
                    <div className='sequence-trigger-box'>
                      <label>
                        <input
                          type='radio'
                          value='seen_all_sequence_messages'
                          checked={this.state.seqTriggerVal === 'seen_all_sequence_messages'}
                          onChange={this.handleChange}
                              />
                        When subscriber has seen all the messages of specific sequence
                     </label>
                      {
                        this.state.isShowSequenceDropDown &&
                        <select className='form-control m-input' onChange={this.handleSequenceDropdown} selected={this.state.value} >
                          <option value={this.state.value}>sequence</option>{
                            this.state.sequencesData.map(function (sequence) {
                              return <option key={sequence.sequence._id} data-key={sequence.sequence._id}
                                value={sequence.sequence.name}>{sequence.sequence.name}</option>
                            })
                          }
                        </select>
                      }
                    </div>
                  </div>

                </div>
                <div className='row'>
                  <div className='col-sm-4 col-md-4 col-lg-4'>
                    <div className='sequence-trigger-box'>
                      <label>
                        <input
                          type='radio'
                          value='unsubscribes_from_other_sequence'
                          checked={this.state.seqTriggerVal === 'unsubscribes_from_other_sequence'}
                          onChange={this.handleChange}
                        />
                       When subscriber unsubscribes from specific sequence
                     </label>
                      {
                        this.state.isShowSequenceDropDownUnsub &&
                        <select className='form-control m-input' onChange={this.handleSequenceDropdown} selected={this.state.value}>
                          <option value=''>sequence</option>{
                            this.state.sequencesData.map(function (sequence) {
                              return <option key={sequence.sequence._id} data-key={sequence.sequence._id}
                                value={sequence.sequence.name}>{sequence.sequence.name}</option>
                            })
                          }
                        </select>
                      }
                    </div>
                  </div>
                  <div className='col-sm-4 col-md-4 col-lg-4'>
                    <div className='sequence-trigger-box'>
                      <label>
                        <input
                          type='radio'
                          value='responds_to_poll'
                          checked={this.state.seqTriggerVal === 'responds_to_poll'}
                          onChange={this.handleChange}
                        />
                       When subscriber responds to specific poll
                     </label>
                    </div>
                  </div>
                </div>

                <button className='btn btn-primary btn-md pull-right' style={{ marginLeft: '20px' }} onClick={() => { this.handleSaveTrigger() }}> Save </button>
                <button style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc' }} className='btn pull-right' onClick={() => this.closeDialogTrigger()}> Cancel </button>
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
                            <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{ marginLeft: '15px' }}>
                              <input type='text' placeholder='Search sequence by name ...' className='form-control m-input m-input--solid' onChange={this.searchSequence} />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                            </div>
                            <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                          </div>
                          {
                            this.state.sequencesData && this.state.sequencesData.length > 0
                              ? <div>{
                                this.state.sequencesData.map((sequence, i) => (
                                  <div key={i} className='sequence-box'>
                                    <div className='sequence-close-icon' onClick={() => this.showDialogDelete(sequence.sequence._id)} />

                                    <span>
                                      <span className='sequence-name'>
                                        {sequence.sequence.name}
                                      </span>
                                      <br />
                                      <span>
                                        <span>Trigger</span>:
                                      <span className='sequence-trigger' style={{ marginLeft: '10px' }}>
                                        {
                                            sequence.sequence.trigger.event === 'subscribes_to_sequence' ? 'When subscriber subscribes to sequence'
                                            : sequence.sequence.trigger.event === 'subscriber_joins' ? 'When Subscriber joins'
                                            : sequence.sequence.trigger.event === 'seen_all_sequence_messages' ? 'When Subscriber has seen all messages of specific sequence'
                                            : sequence.sequence.trigger.event === 'unsubscribes_from_other_sequence' ? 'When Subscriber unsubscribes from specific sequence'
                                            : sequence.sequence.trigger.event === 'responds_to_poll' ? 'When Subscriber responds to specific poll' : 'When subscriber subscribes to sequence'

                                          }
                                      </span>
                                        <span className='sequence-link' onClick={() => this.showDialogTrigger(sequence)}>
                                          -- Edit
                                    </span>
                                      </span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{ marginLeft: '15%' }}>
                                      <span className='sequence-number'>{sequence.subscribers.length}</span>
                                      <br />
                                      <span>Subscribers</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{ marginLeft: '5%' }}>
                                      <span className='sequence-number'>{sequence.messages.length}</span>
                                      <br />
                                      <span>Messages</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{ marginLeft: '10%', cursor: 'pointer' }} onClick={() => this.goToEdit(sequence.sequence)}>
                                      <i className='fa fa-edit' style={{ fontSize: '24px' }} />
                                      <br />
                                      <span>Edit</span>
                                    </span>
                                  </div>
                                ))
                              }
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
    deleteSequence: deleteSequence,
    updateTrigger: updateTrigger,
    loadPollsList: loadPollsList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
