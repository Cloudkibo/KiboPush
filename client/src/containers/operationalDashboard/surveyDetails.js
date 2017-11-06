import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
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
    const user = this.props.currentUser
    console.log('back to user details', user, this.props)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
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

    if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      this.props.loadSurveyDetails(id)
    }
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
            <div className='container'>
              {this.props.survey && this.props.survey.length > 0 &&
              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <h5 className='presentation-margin' style={{marginLeft: '15px'}}>Title
                      : {this.props.survey[0].title}</h5>
                    <p style={{marginLeft: '15px'}}><b>Description: </b>{this.props.survey[0].description}</p>
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
                    <div className='back-button' style={{float: 'right', margin: 2}}>
                      <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()}>Back
                      </button>
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
