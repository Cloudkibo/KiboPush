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
import {addWorkFlow, loadWorkFlowList} from '../../redux/actions/workflows.actions';
import { bindActionCreators } from 'redux';

class Workflows extends React.Component {

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

  render() {
		console.log("Workflows", this.props.workflows)
    return (
	   <div>
      <Header/>
      <HeaderResponsive />
      <Sidebar/>
      <Responsive/>
     <div className="container">
	 <br/><br/><br/><br/><br/><br/>
        <div className="row">
          <main className="col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12">
						<div className="ui-block">
        <div className="birthday-item inline-items badges">
				<h3>Workflows</h3>
				<Link to='createworkflow' className="pull-right">
						<button className="btn btn-primary btn-sm"> Create Workflow</button>
				</Link>
        <div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Name</th>
									<th>Condition</th>
									<th>Key Words</th>
									<th>Message</th>
									<th>Active</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
							{

								(this.props.workflows) ?
								this.props.workflows.map((workflow,i)=>(
								<tr>
								
									<td>{workflow.name}</td>
									<td>{workflow.condition}</td>
									<td>{workflow.keyWords}</td>
									<td>{workflow.message}</td>
									<td>{workflow.isActive}</td>
									<td>
										<button className="btn btn-primary btn-sm" style={{float: 'left'}}>Edit</button>
										<button className="btn btn-primary btn-sm" style={{float: 'left'}}>Disable</button>
									</td>
								</tr>

								)):<br/>
							}
								
							</tbody>
						</table>
					</div>
     
        </div>
      </div>

        
          </main>
      
   
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
export default connect(mapStateToProps,mapDispatchToProps)(Workflows);
