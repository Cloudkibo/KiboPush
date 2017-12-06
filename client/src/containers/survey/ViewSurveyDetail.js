/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import {
  getsurveyform,
  submitsurvey
} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'

// var handleDate = function (d) {
//   var c = new Date(d)
//   return c.toDateString()
// }

class ViewSurveyDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getsurveyform(props.location.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
  }

  componentDidMount () {
    console.log('componentDidMount called in ViewSurveyDetail Finished')
  }

  // submitSurvey (e) {
  //   e.preventDefault()
  //   var responses = []
  //   for (var j = 0; j < this.props.questions.length; j++) {
  //     responses.push({
  //       qid: this.props.questions[j]._id,
  //       response: this.refs[this.props.questions[j]._id].value,
  //     })
  //   }
  //   console.log('submited responses')
  //   console.log(responses)
  //   this.props.submitsurvey({
  //     'responses': responses,
  //     surveyId: this.props.params.id,
  //     subscriberId: this.props.params.subscriberid,
  //   })
  // }
  //
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
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          {this.props.survey && this.props.questions &&
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>

            <div className='m-subheader '>
              <div className='d-flex align-items-center' style={{marginLeft: '20px'}}>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>{this.props.survey.title}</h3><br />
                  <p><b>Description: </b>{this.props.survey.description}</p>
                </div>
              </div>
            </div>

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
  return bindActionCreators(
    {getsurveyform: getsurveyform, submitsurvey: submitsurvey}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewSurveyDetail)
