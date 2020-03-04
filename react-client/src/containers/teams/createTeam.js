/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { createTeam } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import AlertContainer from 'react-alert'
class CreateTeam extends React.Component {
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
      showDropDown1: false
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
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Team`;
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)
  }
  createTeam () {
    if (this.state.name === '') {
      this.msg.error('Please write a name')
    } else if (this.state.description === '') {
      this.msg.error('Please write a description')
    } else if (this.state.agentIds.length === 0) {
      this.msg.error('Please select one agent atleast')
    } else if (this.props.user.platform === 'messenger' && this.state.pageIds.length === 0) {
      this.msg.error('Please select one page atleast')
    } else {
      var agents = []
      for (var i = 0; i < this.state.agentIds.length; i++) {
        agents.push(this.state.agentIds[i].userId._id)
      }
      let pageIds = []
      let pageNames = []
      for (var j = 0; j < this.state.pageIds.length; j++) {
        pageIds.push(this.state.pageIds[j]._id)
        pageNames.push(this.state.pageIds[j].pageName)
      }
      if (this.props.user.platform === 'messenger') {
        this.props.createTeam({name: this.state.name, description: this.state.description, teamPages: pageNames, agentIds: agents, pageIds: pageIds, platform: 'messenger'})
      } else if (this.props.user.platform === 'whatsApp') {
        this.props.createTeam({name: this.state.name, description: this.state.description, agentIds: agents, platform: 'whatsApp'})
      }
      this.props.history.push({
        pathname: `/teams`
      })
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
        if (this.exists(this.props.members[i].userId.name) === false) {
          temp.push(this.props.members[i])
        }
      }
    } else {
      for (var j = 0; j < this.props.members.length; j++) {
        if (agent === this.props.members[j].userId.name) {
          if (this.exists(this.props.members[j].userId.name) === false) {
            temp.push(this.props.members[j])
          }
        }
      }
    }
    this.setState({agentIds: temp})
  }
  removeAgent (agent) {
    var index = -1
    var temp = this.state.agentIds
    for (var i = 0; i < this.state.agentIds.length; i++) {
      if (agent === this.state.agentIds[i].userId.name) {
        index = i
      }
    }
    if (index > -1) {
      temp.splice(index, 1)
    }
    this.setState({agentIds: temp})
  }
  changePage (page) {
    var temp = this.state.pageIds
    console.log('page', page)
    console.log('this.props.pages', this.props.pages)
    if (page === 'All') {
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.existsPage(this.props.pages[i].pageName) === false) {
          temp.push(this.props.pages[i])
        }
      }
    } else {
      for (var j = 0; j < this.props.pages.length; j++) {
        if (page === this.props.pages[j].pageName) {
          if (this.existsPage(this.props.pages[j].pageName) === false) {
            temp.push(this.props.pages[j])
          }
        }
      }
    }
    this.setState({pageIds: temp})
  }
  removePage (page) {
    var index = -1
    var temp = this.state.pageIds
    for (var i = 0; i < this.state.pageIds.length; i++) {
      if (page === this.state.pageIds[i].pageName) {
        index = i
      }
    }
    if (index > -1) {
      temp.splice(index, 1)
    }
    this.setState({pageIds: temp})
  }
  exists (agent) {
    for (var i = 0; i < this.state.agentIds.length; i++) {
      if (this.state.agentIds[i].userId.name === agent) {
        return true
      }
    }
    return false
  }
  existsPage (page) {
    for (var i = 0; i < this.state.pageIds.length; i++) {
      if (this.state.pageIds[i].pageName === page) {
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
              <h3 className='m-subheader__title'>Create Team</h3>
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
                      <input className='form-control'
                        placeholder='Enter name here' value={this.state.name} onChange={(e) => this.updateName(e)}
                         />
                    </div>
                    <div id='description' className='form-group m-form__group'>
                      <label className='control-label'>Team Description:</label>
                      <textarea className='form-control'
                        placeholder='Enter description here' value={this.state.description} onChange={(e) => this.updateDescription(e)}
                         />
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
                                  <img alt='pic' style={{height: '30px'}} src={(agent.userId.facebookInfo) ? agent.userId.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                                  <span>{agent.userId.name}</span>&nbsp;&nbsp;&nbsp;
                                  <i style={{cursor: 'pointer'}} className='fa fa-times' onClick={() => this.removeAgent(agent.userId.name)} />
                                </span>
                              </li>
                              ))
                            }
                          </ul>
                        </div>
                      }
                      <br />
                      <div className='m-dropdown m-dropdown--inline m-dropdown--arrow' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown}>
                        <a href='#/' className='m-dropdown__toggle btn btn-success dropdown-toggle'>
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
                                            <a href='#/' onClick={() => this.changeAgent(member.userId.name)} className='m-nav__link' style={{cursor: 'pointer'}}>
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
                                        <a href='#/' onClick={() => this.changeAgent('All')} className='m-nav__link' style={{cursor: 'pointer'}}>
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
                                  <i style={{cursor: 'pointer'}} className='fa fa-times' onClick={() => this.removePage(page.pageName)} />
                                </span>
                              </li>
                              ))
                            }
                          </ul>
                        </div>
                      }
                      <br />
                      <div className='m-dropdown m-dropdown--inline m-dropdown--arrow' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown1}>
                        <a href='#/' className='m-dropdown__toggle btn btn-success dropdown-toggle'>
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
                                            <a href='#/' onClick={() => this.changePage(page.pageName)} className='m-nav__link' style={{cursor: 'pointer'}}>
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
                                        <a href='#/' onClick={() => this.changePage('All')} className='m-nav__link' style={{cursor: 'pointer'}}>
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
                    </div>
                  }
                  </div>
                  <br /><br />
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                    <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                      <button className='btn btn-primary' onClick={this.createTeam}> Create Team
                      </button>
                      <Link
                        to='/teams'
                        className='btn btn-secondary' style={{'marginLeft': '10px'}}>
                        Cancel
                      </Link>
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
    user: (state.basicInfo.user),
    pages: (state.pagesInfo.pages),
    members: (state.membersInfo.members)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    createTeam: createTeam,
    loadMembersList: loadMembersList
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam)
