/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { addPoll, loadPollsList } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
class ViewPoll extends React.Component {
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Poll`;
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>View Poll</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Q. {this.props.location.state.statement}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='container'>
                    <li>{this.props.location.state.options[0]}</li>
                    <li>{this.props.location.state.options[1]}</li>
                    <li>{this.props.location.state.options[2]}</li>
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <Link
                    to='/poll'
                    style={{ float: 'right', margin: '20px' }}
                    className='btn btn-secondary'>
                    Back
                  </Link>
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
    polls: (state.pollsInfo.polls)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ loadPollsList: loadPollsList, addPoll: addPoll },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewPoll)
