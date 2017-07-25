/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Responsive from '../sidebar/responsive';
import Dashboard from '../dashboard/dashboard';
import Header from '../header/header';
import HeaderResponsive from '../header/headerResponsive';

class AddPage extends React.Component {

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
          <div className="ui-block">
				<div className="birthday-item inline-items">
					<div className="author-thumb">
						<img src="img/avatar7-sm.jpg" alt="author" />
					</div>
					<div className="birthday-author-name">
						<a href="#" className="h6 author-name">Marina Valentine </a>
						<div className="birthday-date">January 16th, 1989</div>
					</div>
					<a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Add</a>
				</div>
			</div>

              <div className="ui-block">
				<div className="birthday-item inline-items">
					<div className="author-thumb">
						<img src="img/avatar7-sm.jpg" alt="author" />
					</div>
					<div className="birthday-author-name">
						<a href="#" className="h6 author-name">Marina Valentine </a>
						<div className="birthday-date">January 16th, 1989</div>
					</div>
					<a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Add</a>
				</div>
			</div>

              <div className="ui-block">
				<div className="birthday-item inline-items">
					<div className="author-thumb">
						<img src="img/avatar7-sm.jpg" alt="author" />
					</div>
					<div className="birthday-author-name">
						<a href="#" className="h6 author-name">Marina Valentine </a>
						<div className="birthday-date">January 16th, 1989</div>
					</div>
					<a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Add</a>
				</div>
			</div>

              <div className="ui-block">
				<div className="birthday-item inline-items">
					<div className="author-thumb">
						<img src="img/avatar7-sm.jpg" alt="author" />
					</div>
					<div className="birthday-author-name">
						<a href="#" className="h6 author-name">Marina Valentine </a>
						<div className="birthday-date">January 16th, 1989</div>
					</div>
					<a href="20-CalendarAndEvents-MonthlyCalendar.html" className="btn btn-sm bg-blue">Add</a>
				</div>
			</div>

        
          </main>
      
   
        </div>
      </div>
			</div>

    );
  }
}

export default AddPage;
