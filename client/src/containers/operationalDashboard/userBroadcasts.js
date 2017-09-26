import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadBroadcastsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class BroadcastsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor', props.location.this.state)
    props.loadBroadcastsList(props.location.this.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
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
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Broadcasts</h4><br />
              { this.props.broadcasts
              ? <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Type</th>
                      <th>Text</th>
                      <th>Date Time</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.props.broadcasts.map((broadcast, i) => (
                      <tr>
                        <td>{broadcast.platform}</td>
                        <td>{broadcast.type}</td>
                        <td>{broadcast.text}</td>
                        <td>{broadcast.datetime}</td>
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
  console.log(state)
  return {
    broadcasts: (state.BroadcastsInfo.broadcasts)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadBroadcastsList: loadBroadcastsList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(BroadcastsInfo)
