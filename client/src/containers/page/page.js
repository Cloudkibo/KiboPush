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
import { loadMyPagesList } from '../../redux/actions/pages.actions';
import { bindActionCreators } from 'redux';

class Page extends React.Component {

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

		this.props.loadMyPagesList("", {});
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
				<h3>Pages</h3>
				<Link to="addPages" className="btn btn-primary btn-sm" style={{float: 'right'}}>Add Pages</Link>
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

							{ (this.props.pages) ?
								this.props.pages.map((page, i) => (
								<tr>
									<td>{page.pic}</td>
									<td>{page.pageName}</td>
									<td>{page.likes}</td>
									<td>{page.followers}</td>
									<td><button className="btn btn-primary btn-sm" style={{float: 'left'}}>Remove</button></td>
								</tr> 

								)) : <br/>
								
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
          pages:(state.pagesInfo.pages),
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadMyPagesList:loadMyPagesList}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Page);
