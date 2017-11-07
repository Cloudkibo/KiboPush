/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { getCurrentPoll } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'

class ViewPollDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('Poll Detail', props.currentPoll)
    this.backToUserDetails = this.backToUserDetails.bind(this)
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

  backToUserDetails () {
    const user = this.props.currentUser
    console.log('back to user details', user, this.props)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
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
            <h2 className='presentation-margin'>View Poll</h2>
            <div className='ui-block'>
              <div className='container'>
                <div className='news-feed-form'>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true'>
                      <br />

                      <div className='form-group'>
                        <label>Q. {this.props.currentPoll.statement}</label>
                        <ol className='table-bordered'>
                          <div className='container'>
                            <li>{this.props.currentPoll.options[0]}</li>
                            <li>{this.props.currentPoll.options[1]}</li>
                            <li>{this.props.currentPoll.options[2]}</li>
                          </div>
                        </ol>
                      </div>
                      <div className='back-button' style={{float: 'right', margin: 2}}>
                        <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()}>Back
                        </button>
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
    currentPoll: (state.getCurrentPoll.currentPoll),
    currentUser: (state.getCurrentUser.currentUser)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ getCurrentPoll: getCurrentPoll },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewPollDetail)
