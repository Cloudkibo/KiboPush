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
import {addWorkFlow, loadWorkFlowList} from '../../redux/actions/workflows.actions';
import { bindActionCreators } from 'redux';

class CreateWorkflow extends React.Component {

	constructor(props){
		super(props);
		this.gotoWorkflow = this.gotoWorkflow.bind(this);
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

	gotoWorkflow(){
		this.props.addWorkFlow("", {});
		this.props.history.push({
			pathname: '/workflows',
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
        <h2 className="presentation-margin">Create a CreateWorkflow</h2>
        <div className="ui-block">
          <div className="ui-block-content">
              			 <label>Rule</label>

				       	<div className="form-group form-inline">
						     
						      <select className="form-control input-lg">
						        <option value="message_is">Message is</option>
						        <option value="message_contains">Message Contains</option>
						        <option value="message_begins">Message Begins with</option>
						      </select>
									<br/>
						      <input type="text" className="form-control input-lg" style={{width: 100 + '%'}} id="keywords" placeholder="Enter keywords separated by comma" />
						   
						 </div>
						   	      
				        <div className="form-group">
				          <label htmlFor="exampleInputReply">Reply</label>
				          <textarea className="form-control" rows="5" id="exampleInputReply"/>
				        </div>
				        <div className="form-group">
				          <label htmlFor="isActive">Is Active</label>
				          <select className="form-control" id="isActive">
				            <option>Yes</option>
				            <option>No</option>
				          
				          </select>
				        </div>
				       
				        <button onClick={this.gotoWorkflow} className="btn btn-primary">Submit</button>
    
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
          workflows:(state.workflowsInfo.workflows),
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadWorkFlowList:loadWorkFlowList, addWorkFlow:addWorkFlow}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CreateWorkflow);
