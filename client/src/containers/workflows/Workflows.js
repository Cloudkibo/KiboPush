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
    this.state = {
      workflowsData: [],
      totalLength: 0
    }
    this.disableWorkflow = this.disableWorkflow.bind(this)
    this.enableWorkflow = this.enableWorkflow.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentWillMount () {
    if (!this.props.workflows) {
      //  alert('calling workflows')
      this.props.loadWorkFlowList()
    }
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
                    this.state.workflowsData && this.state.workflowsData.length > 0
                    ? <div className='table-responsive'>
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
