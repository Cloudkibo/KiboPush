/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Responsive from '../sidebar/responsive'
import Dashboard from '../dashboard/dashboard'
import Header from '../header/header'
import HeaderResponsive from '../header/headerResponsive'
import { connect } from 'react-redux'
import {addBroadcast, loadBroadcastsList} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'

class SubscribeToMessenger extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.subscribeToMessenger = this.subscribeToMessenger.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {'buttonText': 'Send to Messenger', 'buttonColor': 'blue', 'fontColor': 'white'}
  }

  	onChange (event) {
	    this.setState({
	    	'buttonText': event.target.value
	    })
	  }
	 handleChange (e) {
	      this.setState({
	    	'buttonColor': e.target.value,
	    	'fontColor': e.target.value == 'blue' ? 'white' : 'black'
	    })
	    }
	 componentDidMount () {
   require('../../../public/js/jquery-3.2.0.min.js')
   require('../../../public/js/jquery.min.js')
   var addScript = document.createElement('script')
   addScript.setAttribute('src', '../../../js/theme-plugins.js')
   document.body.appendChild(addScript)
   addScript = document.createElement('script')
   addScript.setAttribute('src', '../../../js/material.min.js')
   document.body.appendChild(addScript)
   addScript = document.createElement('script')
   addScript.setAttribute('src', '../../../js/main.js')
   document.body.appendChild(addScript)
 }

  subscribeToMessenger () {
		// this.props.addBroadcast('', {platform: 'Facebook', type: 'message', created_at: '15th Aug 2017', sent: 41});
		// console.log("Broadcast added");
    alert('poll created')
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Subscribe to Messenger</h2>
            <div className='ui-block'>
              <div className='news-feed-form'>

                <div className='alert alert-success'>
                  <h4 className='block'>Code for Send To Messenger Button</h4>
						                        To embed the facebook messenger button on your website, you need to put this line inside &lt;body&gt; tag of HTML of your website's each page.
						                        <br /><br />
                  <center>
                    <code className='codeBox'>

						                          &lt;a class='btn' href='https://m.me/fbPageID' style='{'background:' + this.state.buttonColor + ';color: ' + this.state.fontColor + '; border-color: white;'}' &gt;&lt;i class="fa fa-facebook fa-lg" &gt; &lt;/i&gt;{this.state.buttonText} &lt;/a&gt;
						                          </code>
                  </center><br />
						                        Note: For css, we are using Bootstrap library. The class btn is defined in Bootrap css file.<br />
                </div>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel' aria-expanded='true'>

                    <br />
                    <div className='col-xl-12'>
                      <div className='form-group'>
                        <label for='colorbtn'> Choose Color</label>
                        <select className='form-control' id='colorbtn' ref='colorbtn' onChange={this.handleChange.bind(this)}>
                          <option value='blue'>Blue</option>
                          <option value='white'>White</option>

                        </select>
                      </div>
                      <div className='form-group'>
                        <label for='textbtn'> Button Text</label>
                        <input type='text' className='form-control' ref='textbtn' placeholder='Send on Messenger' id='textbtn' onChange={this.onChange} />
                      </div>
                      <br />
                      <br />
                      <div className='form-group'>
                        <label for='textbtn'> Button Preview</label>
                        <br />
                        <a className='btn' href='#' style={{'backgroundColor': this.state.buttonColor, 'color': this.state.fontColor, 'borderColor': this.state.fontColor}}>
                          <i className='fa fa-facebook fa-lg' /> {this.state.buttonText}</a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
         // broadcasts:(state.broadcastsInfo.broadcasts),
  }
}

function mapDispatchToProps (dispatch) {
 // return bindActionCreators({loadBroadcastsList:loadBroadcastsList, addBroadcast:addBroadcast}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SubscribeToMessenger)
