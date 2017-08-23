/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { addPoll, loadPollsList } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
class CreatePoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
    this.state = {
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: ''
    }
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
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

  createPoll () {
    var options = []
    if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
    } else {
      if (this.state.option1 !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2 !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3 !== '') {
        options.push(this.state.option3)
      }
      this.props.addPoll('', {
        platform: 'Facebook',
        datetime: Date.now(),
        statement: this.state.statement,
        sent: 0,
        options: options
      })
      console.log('Poll added')
      this.props.history.push({
        pathname: '/poll'
      })
    }
  }

  updateStatment (e) {
    this.setState({statement: e.target.value})
  }

  updateOptions (e, opt) {
    switch (opt) {
      case 1:
        this.setState({option1: e.target.value})
        break
      case 2:
        this.setState({option2: e.target.value})
        break
      case 3:
        this.setState({option3: e.target.value})
        break

      default:
        break
    }
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Ask Facebook Subscribers a
              Question</h2>
            <div className='ui-block'>
              <div className='news-feed-form'>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel'
                    aria-expanded='true'>
                    <div className='form-group label-floating is-empty'>
                      <label className='control-label'>Ask something...</label>
                      <textarea className='form-control'
                        value={this.state.statement}
                        onChange={(e) => this.updateStatment(e)} />
                    </div>
                    <br />
                    <div
                      className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                      <label className='control-label'> Add 3 responses</label>
                      <fieldset className='input-group-vertical'>
                        <div className='form-group'>
                          <label className='sr-only'>Response1</label>
                          <input type='text' className='form-control'
                            value={this.state.option1}
                            onChange={(e) => this.updateOptions(e, 1)}
                            placeholder='Response 1' />
                        </div>
                        <div className='form-group'>
                          <label className='sr-only'>Response2</label>
                          <input type='text' className='form-control'
                            value={this.state.option2}
                            onChange={(e) => this.updateOptions(e, 2)}
                            placeholder='Response 2' />
                        </div>
                        <div className='form-group'>
                          <label className='sr-only'>Response3</label>
                          <input type='text' className='form-control'
                            value={this.state.option3}
                            onChange={(e) => this.updateOptions(e, 3)}
                            placeholder='Response 3' />
                        </div>

                      </fieldset>
                    </div>
                    <br />
                    { this.state.alert &&
                    <center><Alert type='danger'>
                      You have either left one or more responses empty or you
                      have not asked anything. Please ask something and fill all
                      three responses in order to create the poll.
                    </Alert></center>
                    }
                    <div className='add-options-message'>

                      <button className='btn btn-primary btn-sm'
                        onClick={this.createPoll}> Create Poll
                      </button>
                      <Link
                        to='/poll'
                        style={{float: 'right', margin: 2}}
                        className='btn btn-sm btn-border-think btn-transparent c-grey'>
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
  console.log(state)
  return {
    polls: (state.pollsInfo.polls)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPollsList: loadPollsList, addPoll: addPoll},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
