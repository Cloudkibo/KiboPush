/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  loadSurveysList,
  sendsurvey
} from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Alert } from 'react-bs-notifier'
import { handleDate } from '../../utility/utils'

class Survey extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (!props.surveys) {
    //  alert('calling')
      props.loadSurveysList()
    }
  }

  componentWillMount () {
    this.props.loadSubscribersList()
  }

  componentDidMount () {
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
    document.body.appendChild(addScript)
  }

  gotoView (survey) {
    // this.props.history.push({
    //   pathname: `/viewsurveydetail/${survey._id}`,
    //   state: survey,
    // })

    this.props.history.push({
      pathname: `/viewsurveydetail`,
      state: survey._id
    })

    // browserHistory.push(`/viewsurveydetail/${survey._id}`)
  }

  gotoResults (survey) {
    this.props.history.push({
      pathname: `/surveyResult`,
      state: survey._id
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
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>

                {
                this.props.subscribers && this.props.subscribers.length == 0 &&
                <div style={{padding: '10px'}}>
                  <center>
                    <Alert type='info' headline='0 Subscribers' >
                    Your connected pages have zero subscribers. Unless you do not have any subscriber, you will not be able to broadcast message, polls and surveys.
                    To invite subscribers click <Link to='/invitesubscribers' style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                    </Alert>
                  </center>
                </div>
              }
                <br />

                <div className='birthday-item inline-items badges'>
                  <h3>Surveys</h3>
                  <Link to='addsurvey' className='pull-right'>
                    <button className='btn btn-primary btn-sm'> Create Survey
                    </button>
                  </Link>
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Created At</th>
                          <th>Actions</th>

                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.props.surveys && this.props.surveys.map((survey, i) => (
                          <tr>
                            <td>{survey.title}</td>
                            <td>{survey.description}</td>
                            <td>{handleDate(survey.datetime)}</td>
                            <td>
                              <button className='btn btn-primary btn-sm'
                                onClick={() => this.gotoView(survey)}>View
                              </button>
                              <button className='btn btn-primary btn-sm'
                                onClick={() => this.gotoResults(survey)}>
                                Report
                              </button>

                              <button className='btn btn-primary btn-sm'
                                onClick={() => this.props.sendsurvey(
                                        survey)}> Send
                              </button>

                            </td>
                          </tr>

                        ))
                      }
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </main>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    surveys: (state.surveysInfo.surveys),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList, sendsurvey: sendsurvey, loadSubscribersList: loadSubscribersList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey)
