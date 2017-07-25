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

class Broadcast extends React.Component {

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
				<h3>Broadcasts</h3>
				<Link to='createbroadcast' className="pull-right">
						<button className="btn btn-primary btn-sm"> Create Broadcast</button>
				</Link>
        <div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Platform</th>
									<th>Type</th>
									<th>Created At</th>
									<th>Sent</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Facebook</td>
									<td>Survey</td>
									<td>24th Aug 2017</td>
									<td>17</td>
									<td>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left', margin: 2}}>Edit</Link>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left' , margin: 2}}>Send</Link>
									</td>
								</tr>
								<tr>
									<td>Facebook</td>
									<td>Poll</td>
									<td>24th Aug 2017</td>
									<td>174</td>
									<td>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left', margin: 2}}>Edit</Link>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left' , margin: 2}}>Send</Link>
									</td>
								</tr>
								<tr>
									<td>Facebook</td>
									<td>Message</td>
									<td>24th Aug 2017</td>
									<td>26</td>
									<td>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left', margin: 2}}>Edit</Link>
									<Link to="editbroadcast" className="btn btn-primary btn-sm" style={{float: 'left' , margin: 2}}>Send</Link>
									</td>
								</tr>
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

export default Broadcast;
