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
    this.state = {
      show: false
    }
    this.getFile = this.getFile.bind(this)
  }

  componentDidMount () {
    console.log('Survey ID: ', this.props.location.state)
    this.props.loadsurveyresponses(this.props.location.state)
  }

  gotoView () {
    this.props.history.push({
      pathname: `/surveys`
    })
  }
  componentWillReceiveProps (nextprops) {
    this.setState({show: true})
  }
  getFile () {
    console.log('this.props.responses', this.props.responses)
    let usersPayload = []
    for (let i = 0; i < this.props.responses.length; i++) {
      usersPayload.push({
        SurveyId: this.props.responses[i].surveyId._id,
        PageId: this.props.responses[i].subscriberId.pageId,
        SubscriberId: this.props.responses[i].subscriberId._id,
        SubscriberName: this.props.responses[i].subscriberId.firstName + ' ' + this.props.responsesfull[i].subscriberId.lastName,
        Q1: this.props.responsesfull[i].response,
        DateTime: this.props.responsesfull[i].datetime
      })
    }
    // var info = usersPayload
    // var keys = []
    // var val = info[0]
    //
    // for (var j in val) {
    //   var subKey = j
    //   keys.push(subKey)
    // }
    // var data = json2csv({data: usersPayload, fields: keys})
    // console.log('data', data)
    // fileDownload(data, 'pollReport.csv')
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
                          {this.state.show &&
                          <div className='pull-left' style={{display: 'inline-block', paddingTop: '40px', marginLeft: '15px'}} onClick={this.getFile}>
                            <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                              <label>Get data in CSV file: </label>
                            </div>
                            <div style={{display: 'inline-block', marginLeft: '10px'}}>
                              <i style={{cursor: 'pointer'}} className='fa fa-download fa-2x' />
                            </div>
                          </div>
                        }
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
