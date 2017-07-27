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
import {addBroadcast, loadBroadcastsList} from '../../redux/actions/broadcast.actions';
import { bindActionCreators } from 'redux';

class AddSurvey extends React.Component {

		constructor(props, context) {
		super(props, context);
		this.state = {value: [], count: 1,questionType:'text'};
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

	 addClick(){
	    this.setState({count: this.state.count+1})
	  }
  
  	removeClick(i){

     let value = this.state.value.slice();
     value.splice(i,1);
     this.setState({
        count: this.state.count - 1,
        value
     })
  }
    handleChange(i, event) {
     let value = this.state.value.slice();
     value[i] = event.target.value;
     this.setState({value});
  }
  handleQuestionType(e){
	      this.setState({
	    	'questionType':e.target.value
	    	
	    });
	  }
  
  createUI(){
     let uiItems = [];
     for(let i = 0; i < this.state.count; i++){
               uiItems.push(
               	<fieldset className="col-md-6">    	
					<legend className="pull-left">Question {i} </legend>
					<a className='remove' onClick={this.removeClick.bind(this,i)}>
      			    	<span className='fa fa-times'/>
          			</a>
						                   
				
					<div className="panel panel-default">
						<div className="panel-body">
							<div className="form-group">
				              <input className="form-control" placeholder="Enter question here..."/>
				         	</div>
						</div>
					</div>
					
				</fieldset>				
				
            )
     }
     return uiItems || null;
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
						        <h2 className="presentation-margin">Create Survey Form</h2>
						        <div className="ui-block">
						          <div className="news-feed-form">
						            
						            <div className="tab-content">
						              <div className="tab-pane active" id="home-1" role="tabpanel" aria-expanded="true">
						              
						                  <div className="col-xl-12">
					                      <div className="form-group">
						                    <label className="control-label">Title</label>
						                    <input className="form-control" placeholder="Enter form title here"/>
						                  </div>
						                  </div>
						                  <br/>
						                  <div className="col-xl-12">
							                  <div className="form-group">
							                    <label className="control-label">Description</label>
							                    <textarea className="form-control" placeholder="Enter form description here" rows="3"/>
							                  </div>
							              </div>
							              <br/>
							              <div className="col-xl-12">
							              <h5> Add Questions </h5>
							               {this.createUI()}
							               </div>      
						                  <div className="col-xl-12">
						                  		<label className="control-label col-sm-offset-2 col-sm-2">Question Type</label>
      											<div className="col-sm-6 col-md-4">
											    <select className="form-control" onChange={this.handleQuestionType.bind(this)}>
												        <option value="text">Text</option>
												        <option value="multichoice">Multi Choice Question</option>
												       
										          </select>
										          <br/>
										          <div className="col-sm-6 col-md-4">
										         	<button className="btn btn-primary btn-sm" onClick={this.addClick.bind(this)}> Add Questions</button>
												  </div>
										        </div>
										          
										         
										 </div>
						                 
						                  <div className="add-options-message">
						                    
						                   
											<button className="btn btn-primary btn-sm" onClick={this.createPoll}> Create Poll</button>
						                    <button className="btn btn-sm btn-border-think btn-transparent c-grey">Cancel</button>
						                  </div>
						                
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

function mapStateToProps(state) {
  console.log(state);
  return {
         // broadcasts:(state.broadcastsInfo.broadcasts),
         };
}

function mapDispatchToProps(dispatch) {
 // return bindActionCreators({loadBroadcastsList:loadBroadcastsList, addBroadcast:addBroadcast}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(AddSurvey);



