/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Responsive from '../sidebar/responsive';
import Dashboard from '../dashboard/dashboard';
import Header from '../header/header';
import HeaderResponsive from '../header/headerResponsive';

class CreateWorkflow extends React.Component {
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
              <form>
              			 <label>Rule</label>

				       	<div className="form-group form-inline">
						     
						      <select className="form-control input-lg">
						        <option value="message_is">Message is</option>
						        <option value="message_contains">Message Contains</option>
						        <option value="message_begins">Message Begins with</option>
						       
						      </select>
						      <input type="text" className="form-control input-lg" id="keywords" placeholder="Enter keywords separated by comma" />
						   
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
				       
				        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
          </div>
        </div>
      </div>

					
		</div>
		</div>

    );
  }
}

export default CreateWorkflow;
