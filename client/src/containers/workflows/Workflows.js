/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  addWorkFlow,
  loadWorkFlowList,
  disableworkflow,
  enableworkflow
} from '../../redux/actions/workflows.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class Workflows extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadWorkFlowList()
    this.state = {
      workflowsData: [],
      totalLength: 0,
      filterByCondition: '',
      filterByStatus: ''
    }
    this.disableWorkflow = this.disableWorkflow.bind(this)
    this.enableWorkflow = this.enableWorkflow.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleFilterByCondition = this.handleFilterByCondition.bind(this)
    this.handleFilterByStatus = this.handleFilterByStatus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps in workflows is called')
    if (nextProps.workflows) {
      this.displayData(0, nextProps.workflows)
      this.setState({ totalLength: nextProps.workflows.length })
    }
  }

  displayData (n, workflows) {
    console.log(workflows)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > workflows.length) {
      limit = workflows.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = workflows[i]
      index++
    }
    this.setState({workflowsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.workflows)
  }

  disableWorkflow (workflow) {
    this.props.disableworkflow(workflow)
  }
  enableWorkflow (workflow) {
    this.props.enableworkflow(workflow)
  }
  gotoEdit (workflow) {
    this.props.history.push({
      pathname: `/editworkflow`,
      state: workflow
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
  }

  handleFilterByCondition (e) {
    var filtered = []
    var active = this.state.filterByStatus === 'yes'
    this.setState({filterByCondition: e.target.value})
    if (this.state.filterByStatus !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.workflows.length; k++) {
          if (this.props.workflows[k].isActive === active) {
            filtered.push(this.props.workflows[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.workflows.length; i++) {
          if (this.props.workflows[i].isActive === active && this.props.workflows[i].condition === e.target.value) {
            filtered.push(this.props.workflows[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.workflows
      } else {
        for (var j = 0; j < this.props.workflows.length; j++) {
          if (this.props.workflows[j].condition === e.target.value) {
            filtered.push(this.props.workflows[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  handleFilterByStatus (e) {
    var filtered = []
    var active = e.target.value === 'yes'
    this.setState({filterByStatus: e.target.value})
    if (this.state.filterByCondition !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.workflows.length; k++) {
          if (this.props.workflows[k].condition === this.state.filterByCondition) {
            filtered.push(this.props.workflows[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.workflows.length; i++) {
          if (this.props.workflows[i].isActive === active && this.props.workflows[i].condition === this.state.filterByCondition) {
            filtered.push(this.props.workflows[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.workflows
      } else {
        for (var j = 0; j < this.props.workflows.length; j++) {
          if (this.props.workflows[j].isActive === active) {
            filtered.push(this.props.workflows[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    console.log('Workflows', this.props.workflows)
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
                <div className='birthday-item inline-items badges'>
                  <h3>Workflows</h3>
                  <Link to='createworkflow' className='pull-right'>
                    <button className='btn btn-primary btn-sm'> Create
                      Workflow
                    </button>
                  </Link>
                  {
                    this.props.workflows && this.props.workflows.length > 0
                    ? <div className='table-responsive'>
                      <form>
                        <div className='form-row'>
                          <div style={{display: 'inline-block'}} className='form-group col-md-6'>
                            <label> Condition </label>
                            <select className='input-sm' value={this.state.filterByCondition} onChange={this.handleFilterByCondition} >
                              <option value='' disabled>Filter by Condition...</option>
                              <option value='message_is'>message_is</option>
                              <option value='message_contains'>message_contains</option>
                              <option value='message_begins'>message_begins</option>
                              <option value=''>all</option>
                            </select>
                          </div>
                          <div style={{display: 'inline-block'}} className='form-group col-md-6'>
                            <label> Active </label>
                            <select className='input-sm' value={this.state.filterByStatus} onChange={this.handleFilterByStatus} >
                              <option value='' disabled>Filter by Status...</option>
                              <option value='yes'>yes</option>
                              <option value='no'>no</option>
                              <option value=''>all</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      {
                        this.state.workflowsData && this.state.workflowsData.length > 0
                        ? <div>
                          <table className='table table-striped'>
                            <thead>
                              <tr>
                                <th>Condition</th>
                                <th>Key Words</th>
                                <th>Message</th>
                                <th>Active</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.workflowsData.map((workflow, i) => (
                                  <tr>
                                    <td>{workflow.condition}</td>
                                    <td>{workflow.keywords.join(',')}</td>
                                    <td>{workflow.reply}</td>
                                    <td>{workflow.isActive ? 'Yes' : 'No'}</td>
                                    <td>
                                      <button className='btn btn-primary btn-sm'
                                        style={{float: 'left', margin: 2}}
                                        onClick={() => this.gotoEdit(workflow)}>Edit
                                      </button>
                                      {
                                        workflow.isActive === true
                                        ? <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}} onClick={() => this.disableWorkflow(workflow)}>Disable
                                        </button>
                                        : <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}} onClick={() => this.enableWorkflow(workflow)}>Enable
                                        </button>
                                      }
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                          <ReactPaginate previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 4)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />
                        </div>
                        : <p> No search results found. </p>
                      }
                    </div>
                    : <div className='table-responsive'>
                      <p> No data to display </p>
                    </div>
                  }
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
    workflows: (state.workflowsInfo.workflows)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadWorkFlowList: loadWorkFlowList, addWorkFlow: addWorkFlow, enableworkflow, disableworkflow}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Workflows)
