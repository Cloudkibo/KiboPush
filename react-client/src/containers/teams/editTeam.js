/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { update, addAgent, addPage, removePage, removeAgent, loadTeamsList, fetchPages, fetchAgents } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import AlertContainer from 'react-alert'
class EditTeam extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMembersList()
    props.loadMyPagesList()
    this.state = {
      name: '',
      description: '',
      pageIds: [],
      agentIds: [],
      showDropDown: false,
      showDropDown1: false,
      removedPages: [],
      removedAgents: [],
      inCancel: true
    }
    this.createTeam = this.createTeam.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.showDropDown1 = this.showDropDown1.bind(this)
    this.hideDropDown1 = this.hideDropDown1.bind(this)
    this.changeAgent = this.changeAgent.bind(this)
    this.changePage = this.changePage.bind(this)
    this.removeAgent = this.removeAgent.bind(this)
    this.removePage = this.removePage.bind(this)
    this.exists = this.exists.bind(this)
    this.existsPage = this.existsPage.bind(this)
    this.existsValue = this.existsValue.bind(this)
    this.cancel = this.cancel.bind(this)
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }
  showDropDown1 () {
    this.setState({showDropDown1: true})
  }

  hideDropDown1 () {
    this.setState({showDropDown1: false})
  }
  componentDidMount () {
    this.scrollToTop()
    if (this.props.location.state) {
    //   var agents = []
    //   var pages = []
    //   console.log('this.props.location.state', this.props.location.state)
    //   for (var i = 0; i < this.props.location.state.agents.length; i++) {
    //     if (this.props.location.state.agents[i].teamId === this.props.location.state._id) {
    //       agents.push(this.props.location.state.agents[i].agentId)
    //     }
    //   }
    //   console.log('agents', agents)
    //   for (var a = 0; a < this.props.location.state.pages.length; a++) {
    //     if (this.props.location.state.pages[a].teamId === this.props.location.state._id) {
    //       pages.push(this.props.location.state.pages[a].pageId)
    //     }
    //   }
    //   console.log('pages', pages)
    //   this.setState({ agentIds: agents, pageIds: pages, name: this.props.location.state.name, description: this.props.location.state.description })
    // }
      this.props.fetchPages(this.props.location.state._id)
      this.props.fetchAgents(this.props.location.state._id)
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Edit Team`
  }
  existsValue (id, array) {
    console.log('array in exists', array)
    console.log('id in exists', id)
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === id) {
        return true
      }
    }
    return false
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)
    console.log('this.props.location.state', this.props.location.state)
    if (nextProps.teamAgents && nextProps.teamAgents.length > 0) {
      var agents = []
      for (var i = 0; i < nextProps.teamAgents.length; i++) {
        if (nextProps.teamAgents[i].teamId._id === this.props.location.state._id) {
          if (this.existsValue(nextProps.teamAgents[i].agentId._id, agents) === false) {
            agents.push(nextProps.teamAgents[i].agentId)
          }
        }
      }
      this.setState({ agentIds: agents, name: this.props.location.state.name, description: this.props.location.state.description })
    }
    if (nextProps.teamPages && nextProps.teamPages.length > 0) {
      var pages = []
      for (var a = 0; a < nextProps.teamPages.length; a++) {
        if (nextProps.teamPages[a].teamId._id === this.props.location.state._id) {
          if (this.existsValue(nextProps.teamPages[a].pageId._id, pages) === false) {
            console.log('Push Page')
            pages.push(nextProps.teamPages[a].pageId)
          }
        }
      }
      this.setState({ pageIds: pages})
    }
  }
  cancel () {
    console.log('removedAgents', this.state.removedAgents)
    console.log('removedAgents', this.state.removedPages)
    if (this.state.inCancel) {
      for (var i = 0; i < this.state.removedAgents.length; i++) {
        this.props.addAgent({ teamId: this.props.location.state._id, agentId: this.state.removedAgents[i]._id })
      }
      for (var j = 0; j < this.state.removedPages.length; j++) {
        this.props.addPage({ teamId: this.props.location.state._id, pageId: this.state.removedPages[j]._id })
      }
    }
    this.props.browserHistory.push({
      pathname: `/teams`
    })
  }
  createTeam () {
  //   this.props.fetchAgents(this.props.location.state._id)
  //   this.props.fetchPages(this.props.location.state._id)
   //
  //   if (this.state.name === '') {
  //     this.msg.error('Please write a name')
  //   } else if (this.state.description === '') {
  //     this.msg.error('Please write a description')
  //   } else if (this.state.agentIds.length === 0) {
  //     this.msg.error('Please select one agent atleast')
  //   } else if (this.state.pageIds.length === 0) {
  //     this.msg.error('Please select one page atleast')
  //   } else {
  //     console.log('this.state.agentIds', this.state.agentIds)
  //     console.log('this.state.pageIds', this.state.pageIds)
  //     console.log('this.props.teamPages', this.props.teamPages)
  //    // console.log('this.props.members', this.props.members)
  //    // console.log('this.props.teamAgents', this.props.teamAgents)
  //     let pageIds = []
  //     let pageNames = []
  //     console.log('this.state.agentIds.length', this.state.agentIds.length)
  //     console.log('this.props.teamAgents.length', this.props.teamAgents.length)
  //     for (var i = 0; i < this.state.agentIds.length; i++) {
  //       var flag = true
  //       for (var j = 0; j < this.props.teamAgents.length; j++) {
  //         console.log('this.state.agentIds._id', this.state.agentIds._id)
  //         console.log('this.props.teamAgents[j].agentId._id', this.props.teamAgents[j].agentId._id)
  //         if (this.state.agentIds[i]._id === this.props.teamAgents[j].agentId._id) {
  //           flag = false
  //           break
  //         }
  //       }
  //       if (flag) {
  //         this.props.addAgent({ teamId: this.props.location.state._id, agentId: this.state.agentIds[i]._id })
  //       }
  //     }
   //
  //  //   console.log('this.state.pageIds.length', this.state.pageIds.length)
  //   //  console.log('this.props.teamPages.length', this.props.teamPages.length)
   //
  //     for (var a = 0; a < this.state.pageIds.length; a++) {
  //      // console.log('j for loop')
  //       var flag1 = true
  //       for (var b = 0; b < this.props.teamPages.length; b++) {
  //        // console.log('i for loop')
  //         if (this.state.pageIds[a]._id === this.props.teamPages[b].pageId._id) {
  //           flag1 = false
  //           break
  //         }
  //       }
  //      // console.log('flag', flag)
  //       if (flag1) {
  //      //   console.log('add page')
  //         this.props.addPage({ teamId: this.props.location.state._id, pageId: this.state.pageIds[j]._id })
  //         pageIds.push(this.state.pageIds[j]._id)
  //         pageNames.push(this.state.pageIds[j].pageName)
  //       }
  //     }
  //     console.log('pageIds', pageIds)
  //     if (pageIds.length !== 0) {
  //       console.log('pageIds in if condition')
  //       this.props.update({_id: this.props.location.state._id, name: this.state.name, description: this.state.description, teamPages: pageNames, teamPagesIds: pageIds})
  //     }
  //     this.setState({inCancel: false})
  //     this.msg.success('Changes saved successfully')
  //   }
    if (this.state.name === '') {
      this.msg.error('Please write a name')
    } else if (this.state.description === '') {
      this.msg.error('Please write a description')
    } else if (this.state.agentIds.length === 0) {
      this.msg.error('Please select one agent atleast')
    } else if (this.props.user.platform === 'messenger' && this.state.pageIds.length === 0) {
      this.msg.error('Please select one page atleast')
    } else {
      let pageIds = []
      let pageNames = []
      for (var i = 0; i < this.state.agentIds.length; i++) {
        this.props.addAgent({ teamId: this.props.location.state._id, agentId: this.state.agentIds[i]._id })
      }
      for (var j = 0; j < this.state.pageIds.length; j++) {
        this.props.addPage({ teamId: this.props.location.state._id, pageId: this.state.pageIds[j]._id })
        pageIds.push(this.state.pageIds[j]._id)
        pageNames.push(this.state.pageIds[j].pageName)
      }
      let updatePayload = {_id: this.props.location.state._id, name: this.state.name, description: this.state.description}
      if (this.props.user.platform === 'messenger') {
        updatePayload.teamPages = pageNames
        updatePayload.teamPagesIds = pageIds
      }
      this.props.update(updatePayload)
      this.setState({inCancel: false})
      this.msg.success('Changes saved successfully')
    }
  }
  updateDescription (e) {
    this.setState({description: e.target.value})
  }
  updateName (e) {
    this.setState({name: e.target.value})
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  changeAgent (agent) {
    var temp = this.state.agentIds
    if (agent === 'All') {
      for (var i = 0; i < this.props.members.length; i++) {
        if (this.exists(this.props.members[i].userId._id) === false) {
          temp.push(this.props.members[i].userId)
          //  this.props.addAgent({ teamId: this.props.location.state._id, agentId: this.props.members[i].userId._id })
        }
      }
    } else {
      for (var j = 0; j < this.props.members.length; j++) {
        if (agent._id === this.props.members[j].userId._id) {
          if (this.exists(this.props.members[j].userId._id) === false) {
            temp.push(this.props.members[j].userId)
            //  this.props.addAgent({ teamId: this.props.location.state._id, agentId: this.props.members[j].userId._id })
          }
        }
      }
    }
    console.log('temp', temp)
    this.setState({agentIds: temp})
  }
  removeAgent (agent) {
    var removed = this.state.removedAgents
    removed.push(agent)
    this.setState({removedAgents: removed})
    var index = -1
    var temp = this.state.agentIds
    for (var i = 0; i < this.state.agentIds.length; i++) {
      if (agent._id === this.state.agentIds[i]._id) {
        index = i
      }
    }
    if (index > -1) {
      temp.splice(index, 1)
    }
    this.setState({agentIds: temp})
    this.props.removeAgent({ agentId: agent._id, teamId: this.props.location.state._id })
    this.props.fetchAgents(this.props.location.state._id)
  }
  changePage (page) {
    console.log('this.props.teamAgents.length', this.props.teamAgents.length)
    var temp = this.state.pageIds
    if (page === 'All') {
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.existsPage(this.props.pages[i]._id) === false) {
          temp.push(this.props.pages[i])
          //  this.props.addPage({ teamId: this.props.location.state._id, pageId: this.props.pages[i]._id })
        }
      }
    } else {
      for (var j = 0; j < this.props.pages.length; j++) {
        if (page._id === this.props.pages[j]._id) {
          if (this.existsPage(this.props.pages[j]._id) === false) {
            temp.push(this.props.pages[j])
            //  this.props.addPage({ teamId: this.props.location.state._id, pageId: this.props.pages[j]._id })
          }
        }
      }
    }
    this.setState({pageIds: temp})
    console.log('this.props.teamAgents.length', this.props.teamAgents.length)
  }
  removePage (page) {
    var removed = this.state.removedPages
    removed.push(page)
    this.setState({removedPages: removed})
    var index = -1
    var temp = this.state.pageIds
    for (var i = 0; i < this.state.pageIds.length; i++) {
      if (page._id === this.state.pageIds[i]._id) {
        index = i
      }
    }
    if (index > -1) {
      temp.splice(index, 1)
    }
    this.setState({pageIds: temp})
    this.props.removePage({ pageId: page._id, teamId: this.props.location.state._id })
    this.props.fetchPages(this.props.location.state._id)
    //  this.props.loadTeamsList()
  }
  exists (agent) {
    for (var i = 0; i < this.state.agentIds.length; i++) {
      if (this.state.agentIds[i]._id === agent) {
        return true
      }
    }
    return false
  }
  existsPage (page) {
    for (var i = 0; i < this.state.pageIds.length; i++) {
      if (this.state.pageIds[i]._id === page) {
        return true
      }
    }
    return false
  }
  render () {
    // const { disabled, stayOpen } = this.state
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              {this.props.location.state.module === 'edit'
              ? <h3 className='m-subheader__title'>Edit Team</h3>
              : <h3 className='m-subheader__title'>View Team</h3>
              }
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet' style={{height: '100%'}}>
                <div className='m-portlet__body'>
                  <div className='m-form'>
                    <div id='name' className='form-group m-form__group'>
                      <label className='control-label'>Team Name:</label>
                      {this.props.location.state.module === 'edit'
                      ? <input className='form-control'
                        placeholder='Enter name here' value={this.state.name} onChange={(e) => this.updateName(e)}
                         />
                       : <input className='form-control'
                         placeholder='Enter name here' value={this.state.name} disabled
                          />
                     }
                    </div>
                    <div id='description' className='form-group m-form__group'>
                      <label className='control-label'>Team Description:</label>
                      {this.props.location.state.module === 'edit'
                      ? <textarea className='form-control'
                        placeholder='Enter description here' value={this.state.description} onChange={(e) => this.updateDescription(e)}
                         />
                       : <textarea className='form-control'
                         placeholder='Enter description here' value={this.state.description} disabled
                          />
                      }
                    </div>
                  </div>
                  <br />
                  <div className='row'>
                    <div className='col-lg-8 col-md-8 col-sm-8'>
                      <label>Agents:</label>
                      {this.state.agentIds && this.state.agentIds.length > 0 &&
                        <div>
                          <ul className='list-unstyled'>
                            {
                            this.state.agentIds.map((agent, i) => (
                              <li className='m-nav__item'>
                                <span>
                                  <img alt='pic' style={{height: '30px'}} src={(agent.facebookInfo) ? agent.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                                  <span>{agent.name}</span>&nbsp;&nbsp;&nbsp;
                                  {this.props.location.state.module === 'edit' &&
                                  <i style={{cursor: 'pointer'}} className='fa fa-times' onClick={() => this.removeAgent(agent)} />
                                  }
                                </span>
                              </li>
                              ))
                            }
                          </ul>
                        </div>
                      }
                      <br />
                      {this.props.location.state.module === 'edit' &&
                      <div className='m-dropdown m-dropdown--inline m-dropdown--arrow' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown}>
                        <a href='#' className='m-dropdown__toggle btn btn-success dropdown-toggle'>
                        Add Agents
                        </a>
                        {
                            this.state.showDropDown &&
                            <div className='m-dropdown__wrapper'>
                              <span className='m-dropdown__arrow m-dropdown__arrow--left m-dropdown__arrow--adjust' />
                              <div className='m-dropdown__inner'>
                                <div className='m-dropdown__body'>
                                  <div className='m-dropdown__content'>
                                    <ul className='m-nav'>
                                      <li className='m-nav__section m-nav__section--first'>
                                        <span className='m-nav__section-text'>
                                          Agents
                                        </span>
                                      </li>
                                      {
                                        this.props.members.map((member, i) => (
                                          <li className='m-nav__item'>
                                            <a onClick={() => this.changeAgent(member.userId)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                              { this.exists(member.userId.name) === true
                                              ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                <i className='la la-check' /> {member.userId.name}
                                              </span>
                                              : <span className='m-nav__link-text'>
                                                {member.userId.name}
                                              </span>}
                                            </a>
                                          </li>
                                        ))
                                      }
                                      <li className='m-nav__item'>
                                        <a onClick={() => this.changeAgent('All')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                          { this.state.agentIds.length === this.props.members.length
                                          ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                            <i className='la la-check' />All
                                          </span>
                                          : <span className='m-nav__link-text'>
                                            All
                                          </span>}
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                      </div>
                    }
                    </div>
                    {this.props.user && this.props.user.platform === 'messenger' &&
                      <div className='col-lg-4 col-md-4 col-sm-4'>
                      <label>Assigned to Pages:</label>
                      {this.state.pageIds && this.state.pageIds.length > 0 &&
                        <div>
                          <ul className='list-unstyled'>
                            {
                            this.state.pageIds.map((page, i) => (
                              <li className='m-nav__item'>
                                <span>
                                  <img alt='pic' style={{height: '30px'}} src={(page.pagePic) ? page.pagePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                                  <span>{page.pageName}</span>&nbsp;&nbsp;&nbsp;
                                  {this.props.location.state.module === 'edit' &&
                                  <i style={{cursor: 'pointer'}} className='fa fa-times' onClick={() => this.removePage(page)} />
                                  }
                                </span>
                              </li>
                              ))
                            }
                          </ul>
                        </div>
                      }
                      <br />
                      {this.props.location.state.module === 'edit' &&
                      <div className='m-dropdown m-dropdown--inline m-dropdown--arrow' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown1}>
                        <a href='#' className='m-dropdown__toggle btn btn-success dropdown-toggle'>
                        Add Pages
                        </a>
                        {
                            this.state.showDropDown1 &&
                            <div className='m-dropdown__wrapper'>
                              <span className='m-dropdown__arrow m-dropdown__arrow--left m-dropdown__arrow--adjust' />
                              <div className='m-dropdown__inner'>
                                <div className='m-dropdown__body'>
                                  <div className='m-dropdown__content'>
                                    <ul className='m-nav'>
                                      <li className='m-nav__section m-nav__section--first'>
                                        <span className='m-nav__section-text'>
                                          Pages
                                        </span>
                                      </li>
                                      {
                                        this.props.pages.map((page, i) => (
                                          <li className='m-nav__item'>
                                            <a onClick={() => this.changePage(page)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                              { this.existsPage(page.pageName) === true
                                              ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                <i className='la la-check' /> {page.pageName}
                                              </span>
                                              : <span className='m-nav__link-text'>
                                                {page.pageName}
                                              </span>}
                                            </a>
                                          </li>
                                        ))
                                      }
                                      <li className='m-nav__item'>
                                        <a onClick={() => this.changePage('All')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                          { this.state.pageIds.length === this.props.pages.length
                                          ? <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                            <i className='la la-check' /> All
                                          </span>
                                          : <span className='m-nav__link-text'>
                                            All
                                          </span>}
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                      </div>
                    }
                    </div>
                  }
                  </div>
                  <br /><br />
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                    {this.props.location.state.module === 'edit'
                    ? <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                      <button className='btn btn-primary' onClick={this.createTeam}> Save
                      </button>
                      <Link onClick={this.cancel}
                        className='btn btn-secondary' style={{'marginLeft': '10px'}}>
                        Cancel
                      </Link>
                    </div>
                    : <div className='m-form__actions' style={{'float': 'left', 'marginTop': '25px', 'marginRight': '20px'}}>
                      <Link
                        to='/teams'
                        className='btn btn-primary' style={{'marginLeft': '10px'}}>
                        Back
                      </Link>
                    </div>
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
  return {
    user: (state.basicInfo.user),
    pages: (state.pagesInfo.pages),
    members: (state.membersInfo.members),
    teams: (state.teamsInfo.teams),
    teamPages: (state.teamsInfo.teamPages),
    teamAgents: (state.teamsInfo.teamAgents)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    loadMyPagesList: loadMyPagesList,
    loadMembersList: loadMembersList,
    addPage: addPage,
    addAgent: addAgent,
    removePage: removePage,
    removeAgent: removeAgent,
    update: update,
    loadTeamsList: loadTeamsList,
    fetchAgents: fetchAgents,
    fetchPages: fetchPages
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTeam)
