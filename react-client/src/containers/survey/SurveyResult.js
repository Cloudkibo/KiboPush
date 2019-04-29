/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadsurveyresponses } from '../../redux/actions/surveys.actions'
import Response from './Response'
import json2csv from 'json2csv'
import fileDownload from 'js-file-download'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { browserHistory } from 'react-router'

var responseData = []
class SurveyResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
     // totalSent: this.props.location.state.sent,
      totalResponses: 0,
      show: false,
      isShowingModalPro: false
    }
    this.getFile = this.getFile.bind(this)
    this.sortData = this.sortData.bind(this)
    this.exists = this.exists.bind(this)
    this.showProDialog = this.showProDialog.bind(this)
    this.closeProDialog = this.closeProDialog.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
  }
  showProDialog () {
    this.setState({isShowingModalPro: true})
  }

  closeProDialog () {
    this.setState({isShowingModalPro: false})
  }
  goToSettings () {
    browserHistory.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }
  componentDidMount () {
    this.props.loadsurveyresponses(this.props.location.state._id)
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Survey Results`;
  }

  gotoView () {
    this.props.history.push({
      pathname: `/surveys`
    })
  }
  componentWillReceiveProps (nextprops) {
  //  var survey = this.props.location.state
   // this.setState({totalSent: survey.sent})
    if (nextprops.responses) {
      if (nextprops.responses.length > 0) {
        let totalResponses = 0
        for (let i = 0; i < nextprops.responses.length; i++) {
          totalResponses += nextprops.responses[i].count
        }
        this.setState({totalResponses: totalResponses})
      }
    this.setState({show: true})
  }
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
        temp.q1.push(this.props.responses[i].response)
        temp.statement.push(this.props.responses[i].questionId.statement)
      }
    }
    responseData.push(temp)
    return temp
  }
  getFile () {
    let usersPayload = []
    for (let i = 0; i < this.props.responses.length; i++) {
      var jsonStructure = {}
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
    fileDownload(data, this.props.survey.title + '-report.csv')
  }
  render () {
    console.log('SurveyResult props', this.props)
    return (
      /*<div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
        */
       <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.isShowingModalPro &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeProDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeProDialog}>
              <h3>Upgrade to Pro</h3>
              <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Survey Report</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
        <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Title: {this.props.location.state.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body' style={{'display': 'flex'}}>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12' style={{'textAlign': 'center', 'fontSize': 'x-large'}}>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        { this.props.location.state.sent}
                        <h5>
                          Survey Sent So Far
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12' style={{'textAlign': 'center'}}>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        { this.props.responses
                        ? <div className='count-stat'>{this.props.location.state.responses}
                        </div>
                        : <div className='count-stat'>{this.props.location.state.responses}
                        </div>
                        }
                        <h5>
                          Survey Respones
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12 col-md-12 col-sm-8 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    {this.state.show && (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C')
                    ? <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.getFile}>
                      <span>
                        <i className='fa fa-download' />
                        <span>
                          Download File
                        </span>
                      </span>
                    </button>
                    : this.state.show &&
                    <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.showProDialog}>
                      <span>
                        <i className='fa fa-download' />
                        <span>
                          Download File
                        </span>&nbsp;&nbsp;
                        <span style={{border: '1px solid #f4516c', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                          <span style={{color: '#f4516c'}}>PRO</span>
                        </span>
                      </span>
                    </button>
                  }
                    <h4>Survey Questions</h4>
                    <br /><br />
                   { this.props.location.state.responses ?
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
                            (d) => d.questionId === c._id)}
                            question={c} />
                          }
                        
                        </div>
                      ))
                    }
                    
                    </ul>
                    : <div className='col-xl-12 col-lg-12 col-md-30 col-sm-30 col-xs-12' style={{'textAlign': 'center', 'fontSize': 'x-large'}}>

                    <h5> Currently there are no responses for this Survey.</h5>
                    </div>
                   }
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
    )
  }
}

function mapStateToProps (state) {
  console.log('surveyResults state', state)
  const {responses, survey, questions} = state.surveysInfo
  const {pages} = state.pagesInfo
  return {
    responses, survey, questions, pages, user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadsurveyresponses}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyResult)
