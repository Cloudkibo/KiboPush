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
import {getsurveyform,submitsurvey} from '../../redux/actions/surveys.actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
var handleDate = function(d){
		var c = new Date(d);
		return c.toDateString();
}

class SubmitSurvey extends React.Component {

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
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h2 className="presentation-margin">Thank you.</h2>
            <p>Response recorded successfully.</p>
          </div>
        </div>
      </div>
    );
  }
}



export default (SubmitSurvey);
