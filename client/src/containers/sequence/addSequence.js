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
import { fetchAllSequence } from '../../redux/actions/sequence.action'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class AddSequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sequencesData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      isShowingModalDelete: false,
      deleteid: ''
    }
    props.fetchAllSequence()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSequence = this.searchSequence.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.goToEdit = this.goToEdit.bind(this)
    this.goToView = this.goToView.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
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

  componentDidMount () {
    this.scrollToTop()
    document.title = 'KiboPush | Sequence Messaging'
  }

  displayData (n, sequences) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > sequences.length) {
      limit = sequences.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = sequences[i]
      index++
    }
    this.setState({sequencesData: data})
  }

  handlePageClick (data) {
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
    if (event.target.value !== '' && this.state.filterValue === '') {
      for (let i = 0; i < this.props.sequences.length; i++) {
        if (this.props.sequences[i].name && this.props.sequences[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.sequences[i])
        }
      }
    } else if (event.target.value !== '' && this.state.filterValue !== '') {
      for (let i = 0; i < this.props.sequences.length; i++) {
        if (this.props.sequences[i].name && this.props.sequences[i].name.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.sequences[i].teamPagesIds.indexOf(this.state.filterValue) !== -1) {
          filtered.push(this.props.sequences[i])
        }
      }
    } else {
      filtered = this.props.sequences
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
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
  goToView (sequence) {
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
    browserHistory.push({
      pathname: `/viewSequence`,
      state: {module: 'view', name: sequence.name, _id: sequence._id}
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
                        <Link to='/CreateMessage'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                  Add Message
                                </span>
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className='m-portlet__body' />
                    <div className='m-scrollable mCustomScrollbar _mCS_5 mCS-autoHide _mCS_4' data-scrollbar-shown='true' data-scrollable='true' data-max-height='380' style='overflow: visible; height: 380px; max-height: 380px; position: relative;'>
                      <div id='mCSB_4' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside' style='max-height: none;' tabindex='0'>
                        <div id='mCSB_4_container' className='mCSB_container' style='position:relative; top:0; left:0;' dir='ltr'>
                          <div className='m-timeline-2'>
                            <div className='m-timeline-2__items  m--padding-top-25 m--padding-bottom-30'>
                              <div className='m-timeline-2__item'>
                                <span className='m-timeline-2__item-time'>5 minutes</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-danger' />
                                </div>
                                <div className='m-timeline-2__item-text  m--padding-top-5'>
                                              Lorem ipsum dolor sit amit,consectetur eiusmdd tempor
                                               incididunt ut labore et dolore magna
                                          </div>
                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>2 hours</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-success' />
                                </div>
                                <div className='m-timeline-2__item-text m-timeline-2__item-text--bold'>
                                              PLACEHOLDER
                                          </div>

                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>12 hours</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-brand' />
                                </div>
                                <div className='m-timeline-2__item-text m--padding-top-5'>
                                              Make Deposit <a href='#' className='m-link m-link--brand m--font-bolder'>USD 700</a> To ESL.
                                          </div>
                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>3 day</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-warning' />
                                </div>
                                <div className='m-timeline-2__item-text m--padding-top-5'>
                                              Lorem ipsum dolor sit amit,consectetur eiusmdd tempor incididunt ut labore et dolore magna elit enim at minim <br /> veniam quis nostrud
                                          </div>
                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>1 week</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-info' />
                                </div>
                                <div className='m-timeline-2__item-text m--padding-top-5'>
                                              Placed a new order in <a href='#' className='m-link m-link--brand m--font-bolder'>SIGNATURE MOBILE</a> marketplace.
                                          </div>
                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>2 week</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-brand' />
                                </div>
                                <div className='m-timeline-2__item-text m--padding-top-5'>
                                              Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br /> incididunt ut labore et dolore magna elit enim at minim<br /> veniam quis nostrud
                                          </div>
                              </div>
                              <div className='m-timeline-2__item m--margin-top-30'>
                                <span className='m-timeline-2__item-time'>3 week</span>
                                <div className='m-timeline-2__item-cricle'>
                                  <i className='fa fa-genderless m--font-danger' />
                                </div>
                                <div className='m-timeline-2__item-text m--padding-top-5'>
                                              Received a new feedback on <a href='#' className='m-link m-link--brand m--font-bolder'>FinancePro App</a> product.
                                          </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id='mCSB_4_scrollbar_vertical' className='mCSB_scrollTools mCSB_4_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical' style='display: block;'>
                        <div className='mCSB_draggerContainer'>
                          <div id='mCSB_4_dragger_vertical' className='mCSB_dragger' style='position: absolute; min-height: 50px; display: block; height: 193px; max-height: 360px; top: 0px;'>
                            <div className='mCSB_dragger_bar' style='line-height: 50px;' />
                          </div>
                          <div className='mCSB_draggerRail' />
                        </div>
                      </div>
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
    fetchAllSequence: fetchAllSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSequence)
