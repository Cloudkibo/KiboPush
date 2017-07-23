/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Responsive from '../sidebar/responsive';
import Dashboard from '../dashboard/dashboard';
import Header from '../header/header';
import HeaderResponsive from '../header/headerResponsive';

class Page extends React.Component {
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
				<h3>Pages</h3>
        <div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Page Pic</th>
									<th>Page Name</th>
									<th>Likes</th>
									<th>Followers</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Image</td>
									<td>Test Page</td>
									<td>157</td>
									<td>17</td>
									<td><button className="btn btn-primary btn-sm" style={{float: 'left'}}>Remove</button></td>
								</tr>
								<tr>
									<td>Image</td>
									<td>Test Page</td>
									<td>157</td>
									<td>17</td>
									<td><button className="btn btn-primary btn-sm" style={{float: 'left'}}>Remove</button></td>
								</tr>
								<tr>
									<td>Image</td>
									<td>Test Page</td>
									<td>157</td>
									<td>17</td>
									<td><button className="btn btn-primary btn-sm" style={{float: 'left'}}>Remove</button></td>
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

export default Page;
