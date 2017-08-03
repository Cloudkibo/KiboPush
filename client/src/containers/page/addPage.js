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
import { loadOtherPagesList,enablePage,addPages } from '../../redux/actions/pages.actions';
import { bindActionCreators } from 'redux';

class AddPage extends React.Component {

	componentWillMount(){
		this.props.addPages();
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
          <main className="col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12">
          <h3>Add Pages</h3>
		  {
			  (this.props.otherPages)?this.props.otherPages.map((page, i) => (
				<div className="ui-block">
				<div className="birthday-item inline-items">
					{/*
						<div className="author-thumb">
						<img src="img/avatar7-sm.jpg" alt="author" />
					</div>
				*/}
					<div className="birthday-author-name">
						<a href="#" className="h6 author-name">{page.pageName} </a>
						
					</div>
					<button onClick={() => this.props.enablePage(page)} className="btn btn-sm bg-blue">Connect</button>
					
				</div>
			</div>       
			  )):<br/>
		  }
          
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
          otherPages:(state.pagesInfo.otherPages),
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadOtherPagesList:loadOtherPagesList,enablePage:enablePage,addPages:addPages}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(AddPage);
