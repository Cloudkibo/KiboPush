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
import json2csv from 'json2csv'
import fileDownload from 'js-file-download'

var responseData = []
class SurveyResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      show: false,
    }
    this.getFile = this.getFile.bind(this)
    this.sortData = this.sortData.bind(this)
    this.exists = this.exists.bind(this)
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
  exists (newSubscriber) {
    for (let i = 0; i < responseData.length; i++) {
      if (responseData[i].subscriberId === newSubscriber) {
        return true
      }
    }
    return false
  }
  sortData (subscriber) {
    var temp = {
      subscriberId: subscriber,
      q1: []
    }
    for (var i = 0; i < this.props.responses.length; i++) {
      if (this.props.responses[i].subscriberId._id === subscriber) {
        console.log('this.props.responses[i].response', this.props.responses[i].response)
        temp.q1.push(this.props.responses[i].response)
      }
    }
    responseData.push(temp)
    return temp
  }
  getFile () {
    var jsonStructure = {}
    var quesNo = 'Q'
    console.log('this.props.responses', this.props.responses)
    console.log('this.props.questions', this.props.questions)
    let usersPayload = []
    for (let i = 0; i < this.props.responses.length; i++) {
      console.log('etes', this.exists(this.props.responses[i].subscriberId._id))
      if (this.exists(this.props.responses[i].subscriberId._id) === false) {
        var temp = this.sortData(this.props.responses[i].subscriberId._id)
        jsonStructure = {
          SurveyId: this.props.responses[i].surveyId._id,
          PageId: this.props.responses[i].subscriberId.pageId,
          SubscriberId: this.props.responses[i].subscriberId._id,
          SubscriberName: this.props.responses[i].subscriberId.firstName + ' ' + this.props.responses[i].subscriberId.lastName,
          Q1: temp.q1[0],
          Q2: temp.q1[1]
        }
        if (temp.q1.length > 2) {
          for (var k = 2; k < temp.q1.length; k++) {
            quesNo = quesNo + (k + 1)
            console.log('quesNo', quesNo)
            jsonStructure['Q' + (k + 1)] = temp.q1[k]
            quesNo = 'Q'
          }
        }
        jsonStructure['DateTime'] = this.props.responses[i].datetime
        usersPayload.push(jsonStructure)
        console.log('this.sortData', usersPayload)
      }
    }
    var info = usersPayload
    var keys = []
    var val = info[0]

    for (var j in val) {
      var subKey = j
      keys.push(subKey)
    }
    var data = json2csv({data: usersPayload, fields: keys})
    console.log('data', data)
    fileDownload(data, 'surveyReport.csv')
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
                          <div className='pull-left' style={{display: 'inline-block', marginLeft: '15px'}} onClick={this.getFile}>
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
