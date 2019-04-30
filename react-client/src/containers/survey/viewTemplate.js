import React from 'react'
import { loadSurveyDetails } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class viewSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      surveyDetailsData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
  }

  displayData (n, pageSubscribers) {
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
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.questions) {
      this.displayData(0, nextProps.questions)
      this.setState({ totalLength: nextProps.questions.length })
    }
  }

  backToUserDetails () {
    this.props.history.push({
      pathname: `/showTemplateSurveys`
    })
  }

  componentDidMount () {
    if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      this.props.loadSurveyDetails(id)
    }
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Template`;
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>

            {this.props.survey &&
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
                      <h3 className='m-subheader__title' style={{marginTop: '15px'}}>{this.props.survey.title}</h3>
                      <p><b>Description: </b>{this.props.survey.description}</p>
                      <p><b>Category: </b>{this.props.survey.category.join(',')}</p>
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
                        this.props.questions.map((c, i) => (
                          <div className='card'>
                            <li
                              className='list-group-item'
                              style={{cursor: 'pointer'}}
                              key={c._id}
                            >
                              <strong>Q. {c.statement}</strong>
                              {c.options.map((d, j) => (
                                <div className='m-section__content'>
                                  <div data-code-preview='true' data-code-html='true' data-code-js='false'>
                                    <div className='m-demo__preview'>
                                      <div className='m-list-timeline' style={{marginTop: '10px', marginLeft: '30px'}}>
                                        <div className='m-list-timeline__items'>
                                          <div className='m-list-timeline__item'>
                                            <span className='m-list-timeline__badge m-list-timeline__badge--success' />
                                            <span className='m-list-timeline__text' key={j}>
                                              {d}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </li>
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
    )
  }
}
function mapStateToProps (state) {
  return {
    survey: (state.templatesInfo.survey),
    questions: (state.templatesInfo.questions),
    currentSurvey: (state.backdoorInfo.currentSurvey)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSurveyDetails: loadSurveyDetails},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(viewSurvey)
