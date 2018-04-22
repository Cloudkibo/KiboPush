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
        <div style={{float: 'left', clear: 'both'}} ref={(el) => { this.top = el }} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            { this.state.isShowingModalDelete &&
            <ModalContainer style={{width: '500px'}} onClose={this.closeDialogDelete}>
              <ModalDialog style={{width: '500px'}} onClose={this.closeDialogDelete}>
                <h3>Delete Sequence</h3>
                <p>Are you sure you want to delete this Sequence?</p>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' onClick={() => {
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
                                                    Add Message
                                              </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <div className='tab-pane active' id='m_widget2_tab1_content'>
                          <div className='m-timeline-3'>
                            <div className='m-timeline-3__items'>
                              <div className='m-timeline-3__item m-timeline-3__item--info'>
                                <span className='m-timeline-3__item-time'>09:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit amit,consectetur eiusmdd tempor
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Bob
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--warning'>
                                <span className='m-timeline-3__item-time'>10:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit amit
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Sean
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--brand'>
                                <span className='m-timeline-3__item-time'>11:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit amit eiusmdd tempor
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By James
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--success'>
                                <span className='m-timeline-3__item-time'>12:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By James
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--danger'>
                                <span className='m-timeline-3__item-time'>14:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit amit,consectetur eiusmdd
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Derrick
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--info'>
                                <span className='m-timeline-3__item-time'>15:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit amit,consectetur
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Iman
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--brand'>
                                <span className='m-timeline-3__item-time'>17:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem ipsum dolor sit consectetur eiusmdd tempor
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Aziko
                </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='tab-pane' id='m_widget2_tab2_content'>
                          <div className='m-timeline-3'>
                            <div className='m-timeline-3__items'>
                              <div className='m-timeline-3__item m-timeline-3__item--info'>
                                <span className='m-timeline-3__item-time m--font-focus'>09:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Contrary to popular belief, Lorem Ipsum is not simply random text.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Bob
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--warning'>
                                <span className='m-timeline-3__item-time m--font-warning'>10:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                There are many variations of passages of Lorem Ipsum available.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Sean
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--brand'>
                                <span className='m-timeline-3__item-time m--font-primary'>11:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Contrary to popular belief, Lorem Ipsum is not simply random text.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By James
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--success'>
                                <span className='m-timeline-3__item-time m--font-success'>12:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                The standard chunk of Lorem Ipsum used since the 1500s is reproduced.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By James
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--danger'>
                                <span className='m-timeline-3__item-time m--font-warning'>14:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Latin words, combined with a handful of model sentence structures.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Derrick
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--info'>
                                <span className='m-timeline-3__item-time m--font-info'>15:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Contrary to popular belief, Lorem Ipsum is not simply random text.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Iman
                </a>
                                  </span>
                                </div>
                              </div>
                              <div className='m-timeline-3__item m-timeline-3__item--brand'>
                                <span className='m-timeline-3__item-time m--font-danger'>17:00</span>
                                <div className='m-timeline-3__item-desc'>
                                  <span className='m-timeline-3__item-text'>
                Lorem Ipsum is therefore always free from repetition, injected humour.
              </span><br />
                                  <span className='m-timeline-3__item-user-name'>
                                    <a href='#' className='m-link m-link--metal m-timeline-3__item-link'>
                  By Aziko
                </a>
                                  </span>
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
            </div>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {
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
