/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence, deleteSequence, updateTrigger } from '../../redux/actions/sequence.action'
import { loadPollsList } from '../../redux/actions/poll.actions'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import { deleteFiles } from '../../utility/utils'

class Sequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sequencesData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      deleteid: '',
      name: '',
      error: false,
      pageNumber: 0,
      filter: false,
      isShowModalTrigger: false,
      seqTriggerVal: 'subscribes_to_sequence',
      selectedDropdownVal: '',
      unsubscribeToSequenceVal: '',
      pollValue: '',
      selectDropdownName: '',
      isShowSequenceDropDown: false,
      isShowSequenceDropDownUnsub: false,
      isShowPollsDropdown: false,
      setSelected: false,
      selectedDivId: '1',
      sequenceList: []

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
    this.updateName = this.updateName.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.getSequenceStatus = this.getSequenceStatus.bind(this)
    this.showDialogTrigger = this.showDialogTrigger.bind(this)
    this.closeDialogTrigger = this.closeDialogTrigger.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSaveTrigger = this.handleSaveTrigger.bind(this)
    this.handleSequenceDropdown1 = this.handleSequenceDropdown1.bind(this)
    this.handleSequenceDropdown2 = this.handleSequenceDropdown2.bind(this)
    this.handlePollsDropdown = this.handlePollsDropdown.bind(this)
    this.createSelectItems = this.createSelectItems.bind(this)
  }

  createSelectItems () {
    let items = []
    for(let a = 0; a < this.state.sequencesData.length; a++) {
      let sequence = this.state.sequencesData[a]
      if (this.state.selectedSequenceId !== sequence.sequence._id) {
        items.push(<option key={sequence.sequence._id} data-key={sequence.sequence._id} value={sequence.sequence.name}>{sequence.sequence.name}</option>)
      }
    }
    return items
  }

  scrollToTop () {
    this.top.scrollIntoView({ behavior: 'instant' })
  }
  getSequenceStatus (messages) {
    var active = 'InActive'
    for(let a = 0; a < messages.length; a++) {
      let msg = messages[a]
      if (msg.isActive) {
        active = 'Active'
        return active
      }
    }
    return active
  }
  gotoCreate () {
    if (this.state.name === '') {
      this.setState({ error: true })
    } else {
      this.props.createSequence({ name: this.state.name })
      this.props.history.push({
        pathname: `/editSequence`,
        state: { name: this.state.name, module: 'create' }
      })
    }
  }
  showDialogDelete (id) {
    this.setState({ deleteid: id })
  }

  componentDidMount () {
    this.scrollToTop()
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Sequence`;
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
    let sequenceList = []
    for(let a = 0; a < this.state.sequencesData.length; a++) {
      let sequence2 = this.state.sequencesData[a]
      if (sequence.sequence._id !== sequence2.sequence._id) {
        sequenceList.push(sequence2)
      }
    }
    if (sequenceList.length > 0) {
      this.setState({
        sequenceList: sequenceList,
        unsubscribeToSequenceVal: sequenceList[0].sequence._id
      })
    }
    let seqEvent = sequence.sequence.trigger.event
    // if (seqEvent === 'seen_all_sequence_messages') {
    //   this.state.sequencesData.map((sequence2) => {
    //     if (sequence.sequence.trigger.value === sequence2.sequence._id) {
    //       this.setState({selectDropdownName: sequence2.sequence.name})
    //     }
    //   })
    // } else if (seqEvent === 'unsubscribes_from_other_sequence') {
    //   this.state.sequencesData.map((sequence2) => {
    //     if (sequence.sequence.trigger.value === sequence2.sequence._id) {
    //       this.setState({selectDropdownName: sequence2.sequence.name})
    //     }
    //   })
    // }
    if (seqEvent === 'responds_to_poll') {
      this.setState({isShowPollsDropdown: true})
      for(let a = 0; a < this.props.polls.length; a++) {
        let poll = this.props.polls[a]
        if (sequence.sequence.trigger.value === poll._id) {
          this.setState({selectDropdownName: poll.statement})
        }
      }
    }
    this.setState({
      isShowModalTrigger: true,
      selectedSequenceId: sequence.sequence._id,
      seqTriggerVal: sequence.sequence.trigger.event
    })
  }

  closeDialogTrigger () {
    this.setState({ isShowModalTrigger: false })
  }

  handleChange (event) {
    let selectedTriggerValue = event.target.attributes.getNamedItem('data-val') ? event.target.attributes.getNamedItem('data-val').nodeValue : 'id'
    let id = event.target.id
    if (id) {
      if (this.state.selectedDivId !== id) {
        document.getElementById(id).style.background = 'rgb(194, 202, 214,0.7)'
        document.getElementById(this.state.selectedDivId).style.background = 'rgb(255, 255, 255)'
        this.setState({setSelected: true, selectedDivId: id})
      } else {
        document.getElementById(this.state.selectedDivId).style.background = 'rgb(194, 202, 214,0.7)'
        this.setState({setSelected: true, selectedDivId: id})
      }
      this.setState({
        seqTriggerVal: selectedTriggerValue
      })
    }
    if (selectedTriggerValue === 'seen_all_sequence_messages') {
      this.setState({
        isShowSequenceDropDown: true,
        isShowSequenceDropDownUnsub: false,
        isShowPollsDropdown: false

      })
    } else if (selectedTriggerValue === 'unsubscribes_from_other_sequence') {
      this.setState({
        isShowSequenceDropDownUnsub: true,
        isShowSequenceDropDown: false,
        isShowPollsDropdown: false
      })
    } else if (selectedTriggerValue === 'responds_to_poll') {
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false,
        isShowPollsDropdown: true
      })
    } else if (selectedTriggerValue === 'subscriber_joins') {
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false,
        isShowPollsDropdown: false
      })
    } else if (selectedTriggerValue === 'subscribes_to_sequence') {
      this.setState({
        isShowSequenceDropDownUnsub: false,
        isShowSequenceDropDown: false,
        isShowPollsDropdown: false
      })
    }
  }

  handleSequenceDropdown1 (event) {
    this.setState({ selectedDropdownVal: event.target.value })
  }
  handleSequenceDropdown2 (event) {
    this.setState({ unsubscribeToSequenceVal: event.target.value })
  }

  handlePollsDropdown (event) {
    this.setState({ pollValue: event.target.value })
  }

  handleSaveTrigger (event) {
    let value = ''
    if (this.state.seqTriggerVal === 'subscriber_joins') {
      value = null
    } else if (this.state.seqTriggerVal === 'subscribes_to_sequence') {
      value = this.state.selectedSequenceId
    } else if (this.state.seqTriggerVal === 'seen_all_sequence_messages') {
      value = this.state.selectedDropdownVal
    } else if (this.state.seqTriggerVal === 'unsubscribes_from_other_sequence') {
      value = this.state.unsubscribeToSequenceVal
    } else if (this.state.seqTriggerVal === 'responds_to_poll') {
      value = this.state.pollValue
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
    this.props.updateTrigger(data, this.msg)
    this.props.fetchAllSequence()
    this.closeDialogTrigger()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextprops in sequence', nextProps)
    if (nextProps.sequences && nextProps.sequences.length > 0) {
      this.displayData(0, nextProps.sequences)
      this.setState({ totalLength: nextProps.sequences.length })
    }
    if (nextProps.polls && nextProps.polls.length > 0) {
      this.setState({pollValue: nextProps.polls[0]._id})
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
    this.props.history.push({
      pathname: `/editSequence`,
      state: { module: 'edit', name: sequence.name, _id: sequence._id, trigger: sequence.trigger.event }
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
    console.log('in render', this.state.sequenceList)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Sequence
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this Sequence?</p>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  let sequence = this.state.sequencesData.find(s => s._id === this.state.deleteid)
                  for (let i = 0; i < sequence.messages.length; i++) {
                    deleteFiles(sequence.messages[i].payload)
                  }
                  this.props.deleteSequence(this.state.deleteid, this.msg)
                }} data-dismiss='modal'>Delete
              </button>
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create Sequence
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
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
                  onClick={() => this.gotoCreate()}
                  data-dismiss='modal'>Create
              </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="trigger" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Update Sequence Trigger
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='row'>
                <div className='col-sm-4 col-md-4 col-lg-4'>
                  <div style={{backgroundColor: this.state.seqTriggerVal === 'subscribes_to_sequence' ? 'rgb(194, 202, 214,0.7)' : 'rgb(255, 255, 255)'}}
                    id='1' data-val='subscribes_to_sequence' className='sequence-trigger-box' onClick={this.handleChange}>
                    When subscriber subscribes to sequence
                  </div>
                </div>
                <div className='col-sm-4 col-md-4 col-lg-4'>
                  <div id='2' data-val='subscriber_joins' className='sequence-trigger-box' onClick={this.handleChange}
                    style={{backgroundColor: this.state.seqTriggerVal === 'subscriber_joins' ? 'rgb(194, 202, 214,0.7)' : 'rgb(255, 255, 255)'}}>
                     When subscriber joins
                     <br /> <br />
                    <span style={{fontWeight: 'bold', fontSize: '11px'}}> Note: Messages of this sequence will be sent after welcome message</span>

                  </div>
                </div>
                <div className='col-sm-4 col-md-4 col-lg-4'>
                  <div className='sequence-trigger-box' id='3' data-val='seen_all_sequence_messages' onClick={this.handleChange}
                    style={{backgroundColor: this.state.seqTriggerVal === 'seen_all_sequence_messages' ? 'rgb(194, 202, 214,0.7)' : 'rgb(255, 255, 255)'}}>
                     When subscriber has seen all the messages of specific sequence
                    {
                      this.state.isShowSequenceDropDown && this.state.sequenceList.length > 0 &&
                      <select className='form-control m-input' onChange={this.handleSequenceDropdown1} value={this.state.selectedDropdownVal} >

                        {
                          this.state.sequenceList.map(function (sequence) {
                            return <option key={sequence.sequence._id} value={sequence.sequence._id}>{sequence.sequence.name}</option>
                          })
                        }
                      </select>
                    }
                  </div>
                </div>

              </div>
              <div className='row'>
                <div className='col-sm-4 col-md-4 col-lg-4'>
                  <div className='sequence-trigger-box' id='4' data-val='unsubscribes_from_other_sequence' onClick={this.handleChange}
                    style={{backgroundColor: this.state.seqTriggerVal === 'unsubscribes_from_other_sequence' ? 'rgb(194, 202, 214,0.7)' : 'rgb(255, 255, 255)'}}>
                     When subscriber unsubscribes from specific sequence
                    {
                      this.state.isShowSequenceDropDownUnsub && this.state.sequenceList.length > 0 &&
                      <select
                        className='form-control m-input'
                        onChange={this.handleSequenceDropdown2}
                        value={this.state.unsubscribeToSequence}
                      >
                        {
                          this.state.sequenceList.map(function (sequence) {
                            return <option key={sequence.sequence._id}
                              value={sequence.sequence._id}>{sequence.sequence.name}</option>
                          })
                        }
                      </select>
                    }
                  </div>
                </div>
                {/*<div className='col-sm-4 col-md-4 col-lg-4'>
                  <div className='sequence-trigger-box' id='5' data-val='responds_to_poll' onClick={this.handleChange}
                    style={{backgroundColor: this.state.seqTriggerVal === 'responds_to_poll' ? 'rgb(194, 202, 214,0.7)' : 'rgb(255, 255, 255)'}}>
                     When subscriber responds to specific poll
                    {
                      this.state.isShowPollsDropdown && this.props.polls.length > 0 &&
                      <select className='form-control m-input' onChange={this.handlePollsDropdown} value={this.state.pollValue} >
                        {
                          this.props.polls.map(function (poll) {
                            return <option key={poll._id}
                              value={poll._id}>{poll.statement}</option>
                          })
                        }
                      </select>
                    }
                  </div>
                </div>*/}
              </div>

              <button data-dismiss="modal" className='btn btn-primary btn-md pull-right' style={{ marginLeft: '20px' }} onClick={() => { this.handleSaveTrigger() }}> Save </button>
              <button data-dismiss="modal" style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc' }} className='btn pull-right' onClick={() => this.closeDialogTrigger()}> Cancel </button>
                </div>
              </div>
            </div>
          </div>
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
              Need help in understanding Sequence Messaging? Here is the <a href='https://kibopush.com/sequence-messaging/' target='_blank' rel='noopener noreferrer'>documentation</a>.
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
                  {
                    this.props.user.permissions['create_sequences'] &&
                    <div className='m-portlet__head-tools'>
                      <Link data-toggle="modal" data-target="#create">
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
                  }
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
                                <div key={i} className='sequence-box' style={{height: '10em'}}>
                                  {
                                    this.props.user.permissions['delete_sequences'] &&
                                    <div className='sequence-close-icon' data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(sequence.sequence._id)} />
                                  }
                                  <span>
                                    <span className='sequence-name'>
                                      {sequence.sequence.name}
                                    </span>
                                    <br />
                                    <span>
                                      <span>Trigger</span>:
                                    <span className='sequence-trigger' style={{ marginLeft: '10px', marginTop: '20px', marginBottom: '15px' }}>
                                      {
                                          sequence.sequence.trigger.event === 'subscribes_to_sequence' ? 'When subscriber subscribes to sequence'
                                          : sequence.sequence.trigger.event === 'subscriber_joins' ? 'When Subscriber joins'
                                          : sequence.sequence.trigger.event === 'seen_all_sequence_messages' ? 'When Subscriber has seen all messages of specific sequence'
                                          : sequence.sequence.trigger.event === 'unsubscribes_from_other_sequence' ? 'When Subscriber unsubscribes from specific sequence'
                                          : sequence.sequence.trigger.event === 'responds_to_poll' ? 'When Subscriber responds to specific poll' : 'None'

                                        }
                                    </span>
                                      <span className='sequence-link' data-toggle="modal" data-target="#trigger" onClick={() => this.showDialogTrigger(sequence)}>
                                        -- Edit
                                  </span>
                                    </span>
                                  </span>

                                  <span className='sequence-text sequence-centered-text' style={{position: 'absolute', left: '65%', top: '35%'}}>
                                    <span className='sequence-number'>{sequence.subscribers.length}</span>
                                    <br />
                                    <span>Subscribers</span>
                                  </span>

                                  <span className='sequence-text sequence-centered-text' style={{position: 'absolute', left: '77%', top: '35%'}}>
                                    <span className='sequence-number'>{sequence.messages.length}</span>
                                    <br />
                                    <span>Messages</span>
                                  </span>
                                  {
                                    this.props.user.permissions['update_sequences'] &&
                                    <span className='sequence-text sequence-centered-text' style={{ position: 'absolute', left: '90%', cursor: 'pointer', top: '40%' }} onClick={() => this.goToEdit(sequence.sequence)}>
                                      <i className='fa fa-edit' style={{ fontSize: '24px' }} />
                                      <br />
                                      <span>Edit</span>
                                    </span>
                                  }
                                </div>
                              ))
                            }
                              <div className='pagination'>
                                <ReactPaginate
                                  previousLabel={'previous'}
                                  nextLabel={'next'}
                                  breakLabel={<a href='#/'>...</a>}
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
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences),
    polls: (state.pollsInfo.polls),
    user: (state.basicInfo.user)
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
