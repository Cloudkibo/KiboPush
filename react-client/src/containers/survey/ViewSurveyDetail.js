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

class ViewSurveyDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getsurveyform(props.location.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Survey Details`;  
  }

  gotoView () {
    this.props.browserHistory.push({
      pathname: `/surveys`
    })
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.props.survey &&
          <div className='m-subheader '>
            <div className='d-flex align-items-center' style={{marginLeft: '20px'}}>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>{this.props.survey.title}</h3><br />
                <p><b>Description: </b>{this.props.survey.description}</p>
              </div>
            </div>
          </div>
        }
        {
          this.props.questions &&
          <div className='m-content'>
            <div
              className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    {this.props.questions.map((question, i) => (
                    question.type === 'text'
                      ? <div className='form-group'>
                        <label >Q. {question.statement}</label>

                      </div>
                      : <div className='form-group'>
                        <label for='sel1'><b>Q. {question.statement}</b></label>
                        <ol className='table-bordered' id='sel1'
                          ref={question._id}>
                          <div className='container'>
                            {question.options.map((option, i) => (
                              <li>{option}</li>
                        ))

                        }
                          </div>

                        </ol>
                      </div>

                  ))
                  }
                    <div className='add-options-message'>
                      <button className='btn btn-primary btn-sm pull-right'
                        onClick={() => this.gotoView()}>Back
                      </button>
                    </div>
                    <br />
                  </div>

                </div>
              </div>

            </div>
          </div>
        }
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewSurveyDetail)
