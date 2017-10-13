/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { loadsurveyresponses } from '../../redux/actions/surveys.actions'
import Response from './Response'

class SurveyResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    let addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)

    this.props.loadsurveyresponses(this.props.location.state)
  }

  componentDidMount () {
    console.log('Survey ID: ', this.props.location.state)
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h3 className='presentation-margin'>Survey Report</h3>
            <div className='container'>
              {this.props.survey &&
              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <h5 className='presentation-margin'>Title
                      : {this.props.survey.title}</h5>
                    <p>{this.props.survey.description}</p>
                  </div>
                </div>
              </div>
              }

              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Survey Questions</div>
                    </div>
                    <div className='ui-block-content'>
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
