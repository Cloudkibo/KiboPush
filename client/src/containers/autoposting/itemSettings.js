import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'

class ItemSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      page: {
        options: [{id: '1', name: 'WoxCut'},
                  {id: '2', name: 'KiboPush'},
                  {id: '3', name: 'Dayem Portfolio'},
                  {id: '4', name: 'United Broke My Guitar'}
        ]
      },
      addPageLabel: 'Add Page',
      target: [],
      segmentValue: '',
      buttonLabel: 'Add Segment',
      criteria: {
        Gender: {
          options: ['Male', 'Female'],
          isPicked: false
        },
        Locale: {
          options: ['en_US', 'af_ZA', 'ar_AR', 'az_AZ', 'pa_IN'],
          isPicked: false
        }
      }
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.updateSegmentValue = this.updateSegmentValue.bind(this)
    this.addNewTarget = this.addNewTarget.bind(this)
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

  componentWillMount () {
    // this.props.loadMyPagesList();
    var temp = []
    Object.keys(this.state.criteria).map((obj) => {
      temp.push(<option value={obj}>{obj}</option>)
    })

    this.setState({target: temp, segmentValue: Object.keys(this.state.criteria)[0]})
  }

  updateSegmentValue (event) {
    console.log('updateSegmentValue called', event.target.value)
    var label = 'Add Segment'
    if (this.state.criteria[event.target.value].isPicked === true) {
      label = 'Remove Segment'
    }
    this.setState({segmentValue: event.target.value, buttonLabel: label})
  }

  addNewTarget () {
    console.log('Add new target called', this.state.segmentValue)
    var temp = this.state.criteria
    temp[this.state.segmentValue].isPicked = !temp[this.state.segmentValue].isPicked
    var label = 'Add Segment'
    if (temp[this.state.segmentValue].isPicked === true) {
      label = 'Remove Segment'
    }
    this.setState({criteria: temp, buttonLabel: label})
  }

  handleSelectChange (value) {
    console.log('onChange function called')
  }

  render () {
    console.log(this.props.location.state)
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
              className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3><i style={{color: this.props.location.state.iconColor}} className={this.props.location.state.icon} aria-hidden='true' /> {this.props.location.state.title}</h3>
                  <br />
                  <div className='table-responsive'>
                    <form>
                      <div className='form-group'>
                        <label>Account Title</label>
                        <input type='text' className='form-control' placeholder={this.props.location.state.title} />
                      </div>
                      <div className='form-group'>
                        <label>Status</label>
                        <select value='Active' onChange={() => this.handleSelectChange}>
                          <option value='Active'>Active</option>
                          <option value='Disabled'>Disabled</option>
                        </select>
                      </div>
                      <fieldset className='form-group'>
                        <legend>Set Targetting</legend>
                        <div className='form-group'>
                          <div style={{width: '500px'}} className='input-group'>
                            <select className='form-control' style={{width: '50px', padding: '5px'}}>
                              {
                                this.state.page.options.map((page) => {
                                  return <option value={page.id}>{page.name}</option>
                                })
                              }
                            </select>
                            <button style={{margin: '5px'}} className='btn btn-primary btn-sm'> {this.state.addPageLabel}
                            </button>
                          </div>
                        </div>
                        <div className='form-group'>
                          <div style={{width: '500px'}} className='input-group'>
                            <select className='form-control' onChange={this.updateSegmentValue} value={this.state.segmentValue} style={{padding: 10}}>
                              {this.state.target}
                            </select>
                            <button style={{margin: '5px'}} className='btn btn-primary btn-sm'
                              onClick={this.addNewTarget}> {this.state.buttonLabel}
                            </button>
                          </div>
                        </div>
                        <div>
                          {
                          this.state.criteria.Gender.isPicked && <div className='form-group'>
                            <div className='input-group'>
                              <p>Gender is: </p>
                              <select style={{padding: 5}}>
                                <option selected='selected' value='Male'>Male</option>
                                <option value='Female'>Female</option>
                              </select>
                            </div>
                          </div>
                          }
                          {
                            this.state.criteria.Locale.isPicked && <div className='form-group'>
                              <div className='input-group'>
                                <p>Locale is: </p>
                                <select style={{padding: 5}}>
                                  <option selected='selected' value='en_US'>en_US</option>
                                  <option value='en_UK'>en_UK</option>
                                  <option value='en_IN'>en_IN</option>
                                </select>
                              </div>
                            </div>
                          }
                        </div>
                      </fieldset>
                    </form>
                    <button style={{float: 'left', margin: 2}} className='btn btn-primary btn-sm'>Save Changes</button>
                    <Link
                      style={{float: 'left', margin: 2}}
                      to='/autoposting'
                      className='btn btn-sm btn-border-think btn-transparent c-grey'
                    >
                      Cancel
                    </Link>
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

export default ItemSettings
