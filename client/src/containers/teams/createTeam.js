/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
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
      agentIds: []
    }
    this.createTeam = this.createTeam.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
  }

  componentDidMount () {
    this.scrollToTop()
  }
  componentWillReceiveProps (nextProps) {

  }
  createTeam () {
    this.props.createTeam({name: this.state.name, description: this.state.description, agentIds: this.state.agentIds, pageIds: this.state.pageIds})
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                      <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                        <button className='btn btn-primary' onClick={this.createTeam}> Create Team
                        </button>
                        <Link
                          to='/poll'
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
    getuserdetails: getuserdetails,
    loadMyPagesList: loadMyPagesList,
    createTeam: createTeam,
    loadMembersList: loadMembersList
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam)
