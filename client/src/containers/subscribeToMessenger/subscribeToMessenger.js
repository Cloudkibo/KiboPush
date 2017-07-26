/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Responsive from '../sidebar/responsive';
import Dashboard from '../dashboard/dashboard';
import Header from '../header/header';
import HeaderResponsive from '../header/headerResponsive';
import { connect } from 'react-redux';
import {addBroadcast, loadBroadcastsList} from '../../redux/actions/broadcast.actions';
import { bindActionCreators } from 'redux';

class SubscribeToMessenger extends React.Component {

		constructor(props, context) {
		super(props, context);
		this.subscribeToMessenger = this.subscribeToMessenger.bind(this);
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

	
	subscribeToMessenger(){
		//this.props.addBroadcast('', {platform: 'Facebook', type: 'message', created_at: '15th Aug 2017', sent: 41});
		//console.log("Broadcast added");
		alert('poll created');
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
						        <h2 className="presentation-margin">Subscribe to Messenger</h2>
						        <div className="ui-block">
						          <div className="news-feed-form">
						            
						            <div className="tab-content">
						              <div className="tab-pane active" id="home-1" role="tabpanel" aria-expanded="true">
						              
						                  <br/>
						                  <div className="col-xl-12">
					                          <div className="form-group">
										      	<label for="colorbtn"> Choose Color</label>
										       <select className="form-control" id="colorbtn" ref="colorbtn">
										        <option value="white">White</option>
										        <option value="blue">Blue</option>
										       
										      </select> 
										      </div>
										      <div className="form-group">
										        <label for="textbtn"> Button Text</label>
										        <input type="text" className="form-control" ref="textbtn" placeholder="Send on Messenger" id="textbtn"/>
										      </div>
										      <br/>
										      <br/>
										      <div className="form-group">
										        <label for="textbtn"> Button Preview</label>
										        <br/>
										        <a className="btn" href="#" style={{'backgroundColor':'blue'}}>
  														<i className="fa fa-facebook fa-lg"></i> Send to Messenger</a>
										      </div>
											</div>
						                  <div className="add-options-message">
						                    
						                   
											<button className="btn btn-primary btn-sm" onClick={this.subscribeToMessenger}> Generate Script</button>
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
         // broadcasts:(state.broadcastsInfo.broadcasts),
         };
}

function mapDispatchToProps(dispatch) {
 // return bindActionCreators({loadBroadcastsList:loadBroadcastsList, addBroadcast:addBroadcast}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(SubscribeToMessenger);



