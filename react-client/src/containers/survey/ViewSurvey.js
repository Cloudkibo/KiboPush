/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  getsurveyform,
  submitsurvey
} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'

class ViewSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getsurveyform(props.params.id)
    this.submitSurvey = this.submitSurvey.bind(this)
  }

  submitSurvey (e) {
    e.preventDefault()
    var responses = []
    for (var j = 0; j < this.props.questions.length; j++) {
      responses.push({
        qid: this.props.questions[j]._id,
        response: this.refs[this.props.questions[j]._id].value
      })
    }
    this.props.submitsurvey({
      'responses': responses,
      surveyId: this.props.params.id,
      subscriberId: this.props.params.subscriberid
    })
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Survey`;
  }

  gotoresp () {
    this.props.browserHistory.push({
      pathname: `/submitsurveyresponse`,
      state: this.props.response
    })
  }

  render () {
    // eslint-disable-next-line no-lone-blocks
    {
      this.props.response &&
      this.gotoresp()
    }
    return (
      <div className='container'>
        <div className='row'>
          {this.props.survey && this.props.questions &&

          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>{this.props.survey.title}</h2>
            <p>{this.props.survey.description}</p>
            <div className='ui-block'>
              <div className='ui-block-content'>
                <div className='row'>
                  <div
                    className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    {this.props.questions.map((question, i) => (
                      question.type === 'text'
                        ? <div className='form-group'>
                          <label >Q. {question.statement}</label>
                          <input className='form-control' type='text' placeholder
                            ref={question._id} />

                        </div>
                        : <div className='form-group'>
                          <label for='sel1'>Q. {question.statement}</label>
                          <select className='form-control' id='sel1'
                            ref={question._id}>
                            {question.options.map((option, i) => (
                              <option>{option}</option>
                          ))
                          }

                          </select>
                        </div>

                    ))
                    }

                    <div className='add-options-message'>

                      <button className='btn btn-secondary'
                        onClick={this.submitSurvey}> Submit
                      </button>
                      <button
                        className='btn btn-border-think btn-transparent c-grey'>
                        Cancel
                      </button>
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
  return {
    survey: (state.surveysInfo.survey),
    questions: (state.surveysInfo.questions),
    response: (state.surveysInfo.response)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {getsurveyform: getsurveyform, submitsurvey: submitsurvey}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewSurvey)
