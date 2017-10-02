import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadSurveysList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SurveysInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor surveyinfo', props.userID)
    props.loadSurveysList(props.userID)
    this.state = {
      SurveyData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentDidMount () {
    console.log('componentDidMount called in ViewSurveyDetail')
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
    console.log('componentDidMount called in ViewSurveyDetail Finished')
  }

  displayData (n, surveys) {
    console.log('surveys:', surveys)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > surveys.length) {
      limit = surveys.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = surveys[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({SurveyData: surveys})
    console.log('in displayData', this.state.SurveyData)
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.surveys)
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Surveys</h4><br />
              { this.state.SurveyData && this.state.SurveyData.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Survey' className='form-control' onChange={this.searchBroadcast} />
                </div>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Descripton</th>
                      <th> Text </th>
                      <th>Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.state.SurveyData.map((survey, i) => (
                      <tr>
                        <td>{survey.title}</td>
                        <td>{survey.description}</td>
                        <td>{survey.text}</td>
                        <td>{handleDate(survey.datetime)}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
                <ReactPaginate previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a href=''>...</a>}
                  breakClassName={'break-me'}
                  pageCount={5}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'} />
              </div>
              : <div className='table-responsive'>
                <p> No data to display </p>
              </div>
              }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('user survey', state)
  return {
    surveys: state.SurveysInfo.surveys
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadSurveysList: loadSurveysList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveysInfo)
