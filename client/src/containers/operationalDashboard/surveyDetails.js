import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { loadSurveyDetails } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Response from '../survey/Response'

class SurveyDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    // const pageId = this.props.params.pageId
    // console.log('in construtor id: ', this.props.currentSurvey._id)
    // if (this.props.currentSurvey) {
    //   const id = this.props.currentSurvey._id
    //   this.props.loadSurveyDetails(id)
    // }
    this.state = {
      surveyDetailsData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
  }

  displayData (n, pageSubscribers) {
    console.log(n, pageSubscribers)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    this.setState({surveyDetailsData: data})
    console.log('in displayData', this.state.surveyDetailsData)
  }

  componentWillReceiveProps (nextProps) {
        // if (nextProps.surveyDetails) {
    //   console.log('Survey details Updated', nextProps.surveyDetails)
    //   this.displayData(0, nextProps.surveyDetails)
    //   this.setState({ totalLength: nextProps.surveyDetails.length })
    // }
  }

  backToUserDetails () {
    if (this.props.location.state) {
      this.props.history.push({
        pathname: `/operationalDashboard`
      })
    } else {
      const user = this.props.currentUser
      console.log('back to user details', user, this.props)
      this.props.history.push({
        pathname: `/userDetails`,
        state: user
      })
    }
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
    if (this.props.location.state) {
      this.props.loadSurveyDetails(this.props.location.state._id)
    } else if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      this.props.loadSurveyDetails(id)
    }
  }

  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                {this.props.survey &&
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
                          <h3 className='m-subheader__title' style={{marginTop: '15px'}}>{this.props.survey[0].title}</h3>
                          <p><b>Description: </b>{this.props.survey[0].description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>
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
                                {this.props.responses && this.props.responses.length > 0
                                ? <Response responses={this.props.responses.filter(
                                  (d) => d.questionId._id === c._id)}
                                  question={c} />
                                : <ol>
                                  {c.options.map((c) => (
                                    <li style={{marginLeft: '30px'}}
                                      key={c}
                                    >{c}
                                    </li>
                                      ))}
                                </ol>
                              }
                              </div>
                            ))
                          }
                        </ul>
                        <div style={{'overflow': 'auto'}}>
                          <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()} style={{ float: 'right', margin: '20px' }}>Back
                          </button>
                        </div>
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
  console.log('in mapStateToProps for surveyDetails', state)
  return {
    survey: (state.SurveyDetailsInfo.survey),
    responses: (state.SurveyDetailsInfo.responses),
    questions: (state.SurveyDetailsInfo.questions),
    currentUser: (state.getCurrentUser.currentUser),
    currentSurvey: (state.getCurrentSurvey.currentSurvey)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSurveyDetails: loadSurveyDetails},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetails)
