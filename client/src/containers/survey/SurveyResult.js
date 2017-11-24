/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { loadsurveyresponses } from '../../redux/actions/surveys.actions'
import Response from './Response'

class SurveyResult extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    console.log('Survey ID: ', this.props.location.state)
    this.props.loadsurveyresponses(this.props.location.state)
  }

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
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            {this.props.survey &&
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>{this.props.survey.title}</h3>
                  <p><b>Description: </b>{this.props.survey.description}</p>
                </div>
              </div>
            </div>
          }
            <div className='m-content'>
              <div className='row'>
                <div
                  className='col-xl-12 col-lg-12 col-md-12 col-sm-8 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__body'>
                      <div className='col-xl-12'>
                        <h4>Survey Questions</h4>
                        <ul className='list-group'>
                          {
                          this.props.questions &&
                          this.props.questions.map((c) => (
                            <div className='card'>
                              <li
                                className='list-group-item'
                                style={{cursor: 'pointer'}}
                                key={c._id}
                              >
                                <strong>Q. {c.statement}</strong>
                              </li>
                              {this.props.responses &&
                              <Response responses={this.props.responses.filter(
                                (d) => d.questionId._id === c._id)}
                                question={c} />
                              }
                            </div>
                          ))
                        }
                        </ul>
                        <br />
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
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  const {responses, survey, questions} = state.surveysInfo
  return {
    responses, survey, questions
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadsurveyresponses}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyResult)
