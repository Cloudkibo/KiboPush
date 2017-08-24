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
class ViewPoll extends React.Component {
  constructor (props, context) {
    super(props, context);
    console.log("Poll View", this.props.location.state);
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
              <div className='news-feed-form'>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel'
                    aria-expanded='true'>
                    <div className='form-group h5-floating is-empty'>
                      <h5 className='control-h5'>Question: </h5>
                        <div>{this.props.location.state.statement}</div>
                    </div>
                    <br />
                    <div
                      className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                      <fieldset className='input-group-vertical'>
                        <div >
                          <h5 >Response 1</h5>
                          <div>{this.props.location.state.options[0]}</div>
                        </div>
                        <div >
                          <h5 >Response 2</h5>
                          <div>{this.props.location.state.options[1]}</div>
                        </div>
                        <div>
                          <h5>Response 3</h5>
                          <div>{this.props.location.state.options[2]}</div>
                        </div>

                      </fieldset>
                    </div>
                    <br />
           
                    <div className='add-options-message'>
                      <Link
                        to='/poll'
                        style={{float: 'right', margin: 2}}
                        className='btn btn-sm btn-border-think btn-transparent c-grey'>
                        Back
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewPoll)
