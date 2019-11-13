/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router-dom'
import { loadSurveysList, loadCategoriesList } from '../../redux/actions/templates.actions'
import { saveSurveyInformation } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class ShowTemplates extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: ''
    }
    props.loadCategoriesList()
    props.loadSurveysList()
    this.onSurveyClick = this.onSurveyClick.bind(this)
    this.displayData = this.displayData.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.gotoView = this.gotoView.bind(this)
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Show Templates`;
  }

  onSurveyClick(e, page) {
    this.props.saveSurveyInformation(page)
  }
  showDropDown() {
    this.setState({ showDropDown: true })
  }

  hideDropDown() {
    this.setState({ showDropDown: false })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.surveys) {
      this.displayData(0, nextProps.surveys)
      this.setState({ totalLength: nextProps.surveys.length })
    }
  }
  displayData(n, surveys) {
    this.setState({ surveysData: surveys })
  }
  onFilter(e) {
    this.setState({ filterValue: e.target.value })
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.surveys.length; i++) {
        if (e.target.value === 'all') {
          if (this.props.surveys[i].category.length > 1) {
            filtered.push(this.props.surveys[i])
          }
        } else {
          for (let j = 0; j < this.props.surveys[i].category.length; j++) {
            if (this.props.surveys[i].category[j] === e.target.value) {
              filtered.push(this.props.surveys[i])
            }
          }
        }
      }
    } else {
      filtered = this.props.surveys
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  gotoView() {
    this.props.history.push({
      pathname: `/surveys`
    })
  }

  render() {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12 col-md-12 col-sm-12'>
              <div className='m-portlet m-portlet--full-height '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>Template Surveys</h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        {this.props.categories && this.props.categories.length > 0 &&
                          <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                            <option value='' disabled>Filter by Category...</option>
                            <option value=''>All</option>
                            {
                              this.props.categories.map((category, i) => (
                                <option value={category.name}>{category.name}</option>
                              ))
                            }
                          </select>
                        }
                      </li>
                      <li className='nav-item m-tabs__item' style={{ marginLeft: '50px', marginTop: '5px' }}>
                        <Link to='/addsurvey' className='nav-link m-tabs__link active'>
                          Create New Survey
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='tab-content'>
                    <div className='tab-pane active m-scrollable' role='tabpanel'>
                      <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                        <div style={{ height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom' }} className='m-messenger__messages'>
                          <div style={{ position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr' }}>
                            <div style={{ position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto' }} >

                              <div className='tab-pane active' id='m_widget4_tab1_content'>
                                {
                                  this.state.surveysData && this.state.surveysData.length > 0
                                    ? <div className='m-widget4' >
                                      {
                                        this.state.surveysData.map((survey, i) => (
                                          <div className='m-widget4__item' key={i}>
                                            <div className='m-widget4__info'>
                                              <span className='m-widget4__title'>
                                                {survey.title}
                                              </span>
                                              <br />
                                              <span className='m-widget4__sub'>
                                                Category: {survey.category.join(', ')}
                                              </span>
                                              <br />
                                              <span className='m-widget4__sub'>
                                                Description: {survey.description}
                                              </span>
                                            </div>
                                            <div className='m-widget4__ext'>
                                              <Link onClick={(e) => { let surveySelected = survey; this.onSurveyClick(e, surveySelected) }} to={'/editTemplateSurvey'} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                                Edit Template
                                        </Link>
                                            </div>
                                            <div className='m-widget4__ext'>
                                              <Link onClick={(e) => { let surveySelected = survey; this.onSurveyClick(e, surveySelected) }} to={'/viewTemplateSurveyUser'} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                                View Template
                                        </Link>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                    : <div>No Data to display</div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='add-options-message'>
                      <button className='btn btn-primary pull-right'
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
function mapStateToProps(state) {
  return {
    surveys: state.templatesInfo.surveys,
    categories: state.templatesInfo.categories
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadSurveysList: loadSurveysList,
    saveSurveyInformation: saveSurveyInformation,
    loadCategoriesList: loadCategoriesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowTemplates)
