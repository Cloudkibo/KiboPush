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


class EditBroadcast extends React.Component {

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
      						 <br/>
							     <br/>
							     <br/>
						      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        <h2 className="presentation-margin">Edit Broadcast</h2>
						        <div className="ui-block">
						          <div className="news-feed-form">
						            
						            <div className="tab-content">
						              <div className="tab-pane active" id="home-1" role="tabpanel" aria-expanded="true">
						                <form>
						                  
						                  <div className="form-group with-icon label-floating is-empty">
						                    <label className="control-label">Say something...</label>
						                    <textarea className="form-control"/>
						                  </div>
						                  <div className="add-options-message">
						                    <a href="#" className="options-message" data-toggle="modal" data-target="#update-header-photo" data-placement="top" title data-original-title="ADD PHOTOS">
						                   		<i className="fa fa-image"></i>
						                   		<span>Add Image</span>
						                    </a>
						                    <a href="#" className="options-message" data-toggle="tooltip" data-placement="top" title data-original-title="TAG YOUR FRIENDS">
						                    <i className="fa fa-video-camera"></i>
						                   		<span>Add Video</span>
						                    </a>
						                    <a href="#" className="options-message" data-toggle="tooltip" data-placement="top" title data-original-title="ADD LOCATION">
						                    <i className="fa fa-link"></i>
						                   		<span>Add Link</span>
						                    </a>
						                    <a href="#" className="options-message" data-toggle="tooltip" data-placement="top" title data-original-title="ADD LOCATION">
						                    <i className="fa fa-volume-up"></i>
						                   		<span>Add Audio</span>
						                    </a>
						                    <button className="btn btn-primary btn-md-2"> Save Broadcast</button>
																<Link to="broadcasts" className="btn btn-md-2 btn-border-think btn-transparent c-grey" style={{float: 'right', margin: 2}}>Back</Link>
						                  </div>
						                </form>
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

export default EditBroadcast;
