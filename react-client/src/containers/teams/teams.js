/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { loadTeamsList, deleteTeam } from '../../redux/actions/teams.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'

class Teams extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      teamsData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      isShowingModalDelete: false,
      deleteid: '',
      showVideo: false
    }
    props.loadTeamsList()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchTeams = this.searchTeams.bind(this)
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
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Teams`
  }

  displayData (n, teams) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > teams.length) {
      limit = teams.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = teams[i]
      index++
    }
    this.setState({teamsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.teams)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.teams) {
      this.displayData(0, nextProps.teams)
      this.setState({ totalLength: nextProps.teams.length })
    }
  }

  searchTeams (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    if (event.target.value !== '' && this.state.filterValue === '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].name && this.props.teams[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.teams[i])
        }
      }
    } else if (event.target.value !== '' && this.state.filterValue !== '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].name && this.props.teams[i].name.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.teams[i].teamPagesIds.indexOf(this.state.filterValue) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else {
      filtered = this.props.teams
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '' && e.target.value !== 'all' && this.state.searchValue === '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].teamPagesIds.indexOf(e.target.value) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else if (e.target.value !== '' && e.target.value !== 'all' && this.state.searchValue !== '') {
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
  goToEdit (team) {
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
      pathname: `/editTeam`,
      state: {module: 'edit', name: team.name, description: team.description, _id: team._id}
    })
  }
  goToView (team) {
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
      pathname: `/editTeam`,
      state: {module: 'view', name: team.name, description: team.description, _id: team._id}
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false, top: 100}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false, top: 100}) }}>
              <div>
                <YouTube
                  videoId='U4x9QA8zNhQ'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
              />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.isShowingModalDelete &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialogDelete}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialogDelete}>
              <h3>Delete Team</h3>
              <p>Are you sure you want to delete this team?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deleteTeam(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Teams</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding broadcasts? Here is the <a href='http://kibopush.com/teams/' target='_blank'>documentation</a>. Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Teams
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {
                      this.props.user.role !== 'agent' &&
                      <Link to='/createTeam'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Create New Team
                            </span>
                          </span>
                        </button>
                      </Link>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {
                    this.props.teams && this.props.teams.length > 0
                    ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                      <div className='form-group m-form__group row align-items-center'>
                        <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                          <input type='text' placeholder='Search teams by name ...' className='form-control m-input m-input--solid' onChange={this.searchTeams} />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                        <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                        <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                          <div className='m-form__label'>
                            <label>Pages:&nbsp;&nbsp;</label>
                          </div>
                          <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                            <option value='' disabled>Filter by Pages...</option>
                            {
                              this.props.teamUniquePages && this.props.teamUniquePages.length > 0 &&
                              this.props.teamUniquePages.map((page, i) => (
                                <option key={i} value={page._id}>{page.pageName}</option>
                              ))
                            }
                            <option value='all'>All</option>
                          </select>
                        </div>
                      </div>
                      {
                        this.state.teamsData && this.state.teamsData.length > 0
                        ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                          <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                            <thead className='m-datatable__head'>
                              <tr className='m-datatable__row'
                                style={{height: '53px'}}>
                                <th data-field='name' style={{width: '100px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Name</span>
                                </th>
                                <th data-field='description' style={{width: '100px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Description</span>
                                </th>
                                <th data-field='pages' style={{width: '100px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Pages</span>
                                </th>
                                <th data-field='created_by' style={{width: '125px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Created By</span>
                                </th>
                                <th data-field='datetime' style={{width: '100px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Created At</span>
                                </th>
                                <th data-field='actions' style={{width: '175px'}}
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span>Actions</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                              {
                                this.state.teamsData.map((team, i) => (
                                  <tr key={i} data-row={i}
                                    className={((i % 2) === 0) ? 'm-datatable__row' : 'm-datatable__row m-datatable__row--even'}
                                    style={{height: '55px'}}>
                                    <td data-field='name' className='m-datatable__cell'><span style={{width: '100px'}}>{team.name}</span></td>
                                    <td data-field='description' className='m-datatable__cell'><span style={{width: '100px'}}>{team.description}</span></td>
                                    <td data-field='pages' className='m-datatable__cell'><span style={{width: '100px'}}>{team.teamPages.join(', ')}</span></td>
                                    <td data-field='created_by' className='m-datatable__cell'><span style={{width: '125px'}}>{team.created_by.name}</span></td>
                                    <td data-field='datetime' className='m-datatable__cell'><span style={{width: '100px'}}>{handleDate(team.creation_date)}</span></td>
                                    <td data-field='actions' className='m-datatable__cell'>
                                      <span style={{width: '175px'}}>
                                        <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.goToView(team)}>
                                          View
                                        </button>
                                        {
                                          this.props.user.role !== 'agent' &&
                                          <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.goToEdit(team)}>
                                            Edit
                                          </button>
                                        }
                                        {/* {
                                          this.props.user.role !== 'agent' &&
                                          <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}} onClick={() => this.showDialogDelete(team._id)}>
                                            Delete
                                          </button>
                                        } */}
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
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    teams: (state.teamsInfo.teams),
    teamUniquePages: (state.teamsInfo.teamUniquePages),
    teamUniqueAgents: (state.teamsInfo.teamUniqueAgents),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadTeamsList: loadTeamsList,
    deleteTeam: deleteTeam
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Teams)
