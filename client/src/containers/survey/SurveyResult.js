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
      show: false
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
      q1: [],
      statement: []
    }
    for (var i = 0; i < this.props.responses.length; i++) {
      if (this.props.responses[i].subscriberId._id === subscriber) {
        console.log('this.props.responses[i].response', this.props.responses[i].response)
        temp.q1.push(this.props.responses[i].response)
        temp.statement.push(this.props.responses[i].questionId.statement)
      }
    }
    responseData.push(temp)
    return responseData
  }
  getFile () {
    console.log('this.props.pages', this.props.pages[0])
    console.log('this.props.responses', this.props.responses)
    console.log('this.props.questions', this.props.questions)
    let usersPayload = []
    for (let i = 0; i < this.props.responses.length; i++) {
      var jsonStructure = {}
      console.log('this.props.responses[i].subscriberId._id', this.props.responses[i].subscriberId.firstName)
      console.log('etes', this.exists(this.props.responses[i].subscriberId._id))
      if (this.exists(this.props.responses[i].subscriberId._id) === false) {
        var temp = this.sortData(this.props.responses[i].subscriberId._id)
        for (let l = 0; l < this.props.pages.length; l++) {
          if (this.props.responses[i].subscriberId.pageId === this.props.pages[l]._id) {
            jsonStructure.PageName = this.props.pages[l].pageName
          }
        }
        jsonStructure['SubscriberName'] = this.props.responses[i].subscriberId.firstName + ' ' + this.props.responses[i].subscriberId.lastName
        for (var k = 0; k < temp.q1.length; k++) {
          jsonStructure['Q' + (k + 1)] = temp.statement[k]
          jsonStructure['Response' + (k + 1)] = temp.q1[k]
        }
        jsonStructure['DateTime'] = this.props.responses[i].datetime
        jsonStructure['SurveyId'] = this.props.responses[i].surveyId._id
        jsonStructure['PageId'] = this.props.responses[i].subscriberId.pageId
        jsonStructure['SubscriberId'] = this.props.responses[i].subscriberId._id
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
    console.log('polls', this.props.survey)
    var data = json2csv({data: usersPayload, fields: keys})
    console.log('data', data)
    fileDownload(data, this.props.survey.title + '-report.csv')
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
                        {this.state.show &&
                        <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.getFile}>
                          <span>
                            <i className='fa fa-download' />
                            <span>
                              Download File
                            </span>
                          </span>
                        </button>
                      }
                        <h4>Survey Questions</h4>
                        <br /><br />
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
  const {pages} = state.pagesInfo
  return {
    responses, survey, questions, pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadsurveyresponses}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyResult)
