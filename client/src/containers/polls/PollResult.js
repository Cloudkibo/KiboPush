/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Responsive from '../sidebar/responsive';
import Dashboard from '../dashboard/dashboard';
import Header from '../header/header';
import HeaderResponsive from '../header/headerResponsive';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {addPoll, loadPollsList} from '../../redux/actions/poll.actions';
import { bindActionCreators } from 'redux';

class PollResult extends React.Component {

		constructor(props, context) {
		super(props, context);
		this.createPoll = this.createPoll.bind(this);
  }

	 componentDidMount() {
		require('../../../public/js/jquery-3.2.0.min.js');
		require('../../../public/js/jquery.min.js');
		var addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/theme-plugins.js');
		document.body.appendChild(addScript);
		addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/material.min.js');
		document.body.appendChild(addScript);
		addScript = document.createElement('script');
		addScript.setAttribute('src', '../../../js/main.js');
		document.body.appendChild(addScript);
	}

	
	createPoll(){
		this.props.addPoll('', {platform: 'Facebook', type: 'message', created_at: '15th Aug 2017', sent: 41});
		console.log("Poll added");
		this.props.history.push({
			pathname: '/poll',
		});
	
	}

  render() {
    return (
	<div>
      <Header/>
      <HeaderResponsive />
      <Sidebar/>
      <Responsive/>
     

       <div className="container">
      						   	 <br/>
							     <br/>
							     <br/>
						      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        <h3 className="presentation-margin">Poll Report</h3>
										  <div className="container">
          <br />
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="ui-block">
                <div className="ui-block-content">
                  <ul className="statistics-list-count">
                    <li>
                      <div className="points">
                        <span>
                          Poll Sent
                        </span>
                      </div>
                      <div className="count-stat">28
                        <span className="indicator positive"> + 4</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="ui-block">
                <div className="ui-block-content">
                  <ul className="statistics-list-count">
                    <li>
                      <div className="points">
                        <span>
                          Poll Response
                        </span>
                      </div>
                      <div className="count-stat">450
                        <span className="indicator negative"> - 12</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
      
          </div>

					<div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <div className="ui-block responsive-flex">
                <div className="ui-block-title">
                  <div className="h6 title">Poll Response Chart</div>
                </div>
                <div className="ui-block-content">
                  <div className="chart-js chart-js-one-bar">
                    <canvas id="poll-bar-chart" width={1400} height={380} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
						      </div>
					
					</div>
					</div>

    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
          polls:(state.pollsInfo.polls),
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadPollsList:loadPollsList, addPoll:addPoll}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PollResult);