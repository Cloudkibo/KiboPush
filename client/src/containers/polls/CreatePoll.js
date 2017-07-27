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

class CreatePoll extends React.Component {

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
						        <h2 className="presentation-margin">Ask Facebook Subscribers a Question</h2>
						        <div className="ui-block">
						          <div className="news-feed-form">
						            
						            <div className="tab-content">
						              <div className="tab-pane active" id="home-1" role="tabpanel" aria-expanded="true">
						              
						                  
						                  <div className="form-group label-floating is-empty">
						                    <label className="control-label">Ask something...</label>
						                    <textarea className="form-control"/>
						                  </div>
						                  <br/>
						                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						                  <label className="control-label"> Add 3 responses</label> 
						                  <fieldset className="input-group-vertical">
											      <div className="form-group">
											        <label className="sr-only">Response1</label>
											        <input type="text" className="form-control" placeholder="Response 1"/>
											      </div>
											      <div className="form-group">
											        <label className="sr-only">Response2</label>
											        <input type="text" className="form-control" placeholder="Response 2"/>
											      </div>
											      <div className="form-group">
											        <label className="sr-only">Response3</label>
											        <input type="text" className="form-control" placeholder="Response 3"/>
											      </div>
											      
											</fieldset>
											</div>
						                  <div className="add-options-message">
						                    
						                   
											<button className="btn btn-primary btn-sm" onClick={this.createPoll}> Create Poll</button>
						                    <button className="btn btn-sm btn-border-think btn-transparent c-grey">Cancel</button>
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
export default connect(mapStateToProps,mapDispatchToProps)(CreatePoll);