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
import {loadSurveysList,sendsurvey} from '../../redux/actions/surveys.actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
var handleDate = function(d){
		var c = new Date(d);
		return c.toDateString();
}

class Survey extends React.Component {
	constructor(props, context) {
		super(props, context);
   		props.loadSurveysList();
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

	gotoView(survey){
		 this.props.history.push({
			pathname: `/viewsurveydetail/${survey._id}`,
			state: survey
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
	 <br/><br/><br/><br/><br/><br/>
        <div className="row">
          <main className="col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12">
						<div className="ui-block">
        <div className="birthday-item inline-items badges">
				<h3>Surveys</h3>
				<Link to='addsurvey' className="pull-right">
						<button className="btn btn-primary btn-sm"> Create Survey</button>
				</Link>
        <div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Title</th>
									<th>Description</th>
									<th>Created At</th>
									<th>Actions</th>

								</tr>
							</thead>
							<tbody>
							 {
                      				  this.props.surveys.map((survey, i) => (
                      				  	<tr>
											<td>{survey.title}</td>
											<td>{survey.description}</td>
											<td>{handleDate(survey.datetime)}</td>
											<td>
												<button className="btn btn-primary btn-sm"  onClick={() => this.gotoView(survey)}>View</button>
												<Link to=`/surveyResult/${survey._id}` className="btn btn-primary btn-sm">
													Report 
												</Link>
												<button className="btn btn-primary btn-sm" onClick={() => this.props.sendsurvey(survey)}> Send </button>
												
											</td>
										</tr>



							))
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
          surveys:(state.surveysInfo.surveys),
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadSurveysList:loadSurveysList,sendsurvey:sendsurvey}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Survey);
