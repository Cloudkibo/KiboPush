/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Dashboard from '../dashboard/dashboard'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import {getsurveyform, submitsurvey} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import {browserHistory} from 'react-router'

var handleDate = function (d) {
  var c = new Date(d)
  return c.toDateString()
}

class ViewSurveyDetail extends React.Component {
  constructor (props, context) {
    super(props, context);
   		props.getsurveyform(props.location.state)
   		// this.submitSurvey = this.submitSurvey.bind(this);
  }

   componentDidMount () {
    console.log('componentDidMount called in ViewSurveyDetail');
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
    document.body.appendChild(addScript);
    console.log('componentDidMount called in ViewSurveyDetail Finished');
  }
  
  // submitSurvey (e) {
  // 	e.preventDefault()
  // 	var responses = []
  // 	for (var j = 0; j < this.props.questions.length; j++) {
  // 		responses.push({qid: this.props.questions[j]._id, response: this.refs[this.props.questions[j]._id].value})
  // 	}
  // 	console.log('submited responses')
  // 	console.log(responses)
  //   this.props.submitsurvey({'responses': responses, surveyId: this.props.params.id, subscriberId: this.props.params.subscriberid})
  // }

  // componentDidMount () {
  //   browserHistory.push(`/viewsurveydetail/${this.props.params.id}`)
  // }
  gotoView () {
    this.props.history.push({
      pathname: `/surveys`
    })
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
          {this.props.survey && this.props.questions &&
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>

            <h2 className='presentation-margin'>{this.props.survey.title}</h2>
            <p>{this.props.survey.description}</p>
            <div className='ui-block'>
              <div className='ui-block-content'>
                <div className='row'>
                  <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    {this.props.questions.map((question, i) => (
                          	question.type == 'text'
                            ? <div className='form-group'>
                              <label >Q. {question.statement}</label>

                            </div>
                            : <div className='form-group'>
                              <label for='sel1'>Q. {question.statement}</label>
                              <ol className='form-control' id='sel1' ref={question._id}>
                                {question.options.map((option, i) => (
                                  <li>{option}</li>
              					    ))
                      					}

                              </ol>
                            </div>

                            ))
                      	 }

                    <div className='add-options-message'>
                      <button className='btn btn-primary btn-sm' onClick={() => this.gotoView()}>Back</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    survey: (state.surveysInfo.survey),
    questions: (state.surveysInfo.questions),
    response: (state.surveysInfo.response)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({getsurveyform: getsurveyform, submitsurvey: submitsurvey}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewSurveyDetail)
