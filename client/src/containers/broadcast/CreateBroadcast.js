/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

class CreateBroadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createBroadcast = this.createBroadcast.bind(this)
    this.state = {
      userfile: '',
      userfilename: '',
      alertMessage: '',
      alertType: '',
      targeting: [],
      criteria: {
        Gender: {
          options: ['Male', 'Female'],
          isPicked: false
        },
        Locale: {
          options: ['en_US', 'af_ZA', 'ar_AR', 'az_AZ', 'pa_IN'],
          isPicked: false
        },
        Page: {
          options: ['en_US', 'af_ZA', 'ar_AR', 'az_AZ', 'pa_IN'],
          isPicked: false
        }
      },
      target: [],
      segmentValue: '',
      buttonLabel: 'Add Segment'
    }
    this._onChange = this._onChange.bind(this)
    this.onFileSubmit = this.onFileSubmit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.addNewTarget = this.addNewTarget.bind(this)
    this.updateSegmentValue = this.updateSegmentValue.bind(this)
  }

  componentWillMount () {
    var temp = []
    Object.keys(this.state.criteria).map((obj) => {
      temp.push(<option value={obj}>{obj}</option>)
    })

    this.setState({target: temp, segmentValue: Object.keys(this.state.criteria)[0]})
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
    }
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

  createBroadcast () {
    let msgBody = this.refs.message.value
    if ((msgBody === '' || msgBody === undefined) &&
      (this.state.userfile === '' || this.state.userfile === null)) {
      this.setState({
        alertMessage: 'Cannot send empty broadcast!',
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
      if (this.state.userfile && this.state.userfile !== '') {
        this.onFileSubmit()
      } else {
        this.props.createbroadcast(
          {platform: 'Facebook', type: 'text', text: this.refs.message.value})
      }
      this.props.history.push({
        pathname: '/broadcasts'
      })
      this.setState({
        alertMessage: 'Broadcast sent successfully!',
        alertType: 'success'
      })
    }
  }

  _onChange (e) {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }

    console.log(e.target.files[0])

    this.setState({
      userfile: e.target.files[0],
      userfilename: e.target.files[0].name
    })

    // eslint-disable-next-line no-undef
    const reader = new FileReader()
    reader.onload = () => {
      this.setState({
        src: reader.result
      })
    }
    reader.readAsDataURL(files[0])
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/broadcasts`

    })
  }

  onFileSubmit () {
    // var sendmessage = true
    // eslint-disable-next-line no-undef
    var fileData = new FormData()
    this.refs.selectFile.value = null
    if (this.state.userfile && this.state.userfile !== '') {
      this.props.updatefileuploadStatus(true)
      var ftype = ''
      if (this.state.userfile.type.split('/')[0] === 'image' ||
        this.state.userfile.type.split('/')[0] === 'audio' ||
        this.state.userfile.type.split('/')[0] === 'video') {
        ftype = this.state.userfile.type.split('/')[0]
      } else {
        ftype = 'file'
      }
      var broadcast = {
        platform: 'Facebook',
        type: 'attachment',
        text: this.refs.message.value,
        attachmentType: ftype
      }

      fileData.append('file', this.state.userfile)
      fileData.append('filename', this.state.userfile.name)
      fileData.append('filetype', this.state.userfile.type)
      fileData.append('filesize', this.state.userfile.size)
      fileData.append('broadcast', JSON.stringify(broadcast))
      console.log(fileData)
      console.log(this.state.userfile)
      this.props.uploadBroadcastfile(fileData)
      this.setState({userfile: ''})
      this.props.history.push({
        pathname: '/broadcasts'
      })
    } else {
      // todo Imran please use soft alert here
      // eslint-disable-next-line no-undef
      alert('Please choose a file to upload.')
    }
    // this.forceUpdate();
    //     event.preventDefault();
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
              <h2 className='presentation-margin'>Send broadcast to
                subscribers</h2>
              <div className='ui-block'>
                <div className='news-feed-form'>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true'>

                      <div
                        className='form-group with-icon label-floating is-empty'>
                        <label className='control-label'>Say
                          something...</label>
                        <textarea className='form-control' ref='message' />
                      </div>
                      <div className='add-options-message'>
                        <div
                          className='form-group with-icon label-floating is-empty'>
                          <label className='control-label'>Upload Attachment
                            (Audio, Video or Image file)</label>

                          <div style={{display: 'inline-block'}}
                            data-tip='attachments'>
                            <i style={styles.iconclass} onClick={() => {
                              this.refs.selectFile.click()
                            }}>
                              <i style={{
                                fontSize: '25px',
                                position: 'absolute',
                                left: '0',
                                width: '100%',
                                height: '2.5em',
                                textAlign: 'center'
                              }} className='fa fa-paperclip' />
                            </i>
                            <input ref='selectFile' type='file'
                              onChange={this._onChange}
                              style={{'display': 'none'}} />

                          </div>
                        </div>

                        <button className='btn btn-primary btn-sm'
                          onClick={this.createBroadcast}> Send Broadcast
                        </button>
                        <Link
                          to='broadcasts'
                          style={{float: 'right', margin: 2}}
                          className='btn btn-sm btn-border-think btn-transparent c-grey'
                          onClick={this.gotoView}>
                          Cancel
                        </Link>
                      </div>

                      {
                        this.state.userfilename &&
                        this.state.userfilename !== '' &&
                        <p style={{color: 'red'}}>{this.state.userfilename}</p>

                      }
                      {
                        this.props.showFileUploading &&
                        this.props.showFileUploading === true &&
                        <p style={{color: 'red'}}>Uploading file...Please
                          wait</p>

                      }
                      {
                        this.state.alertMessage !== '' &&
                        <center>
                          <Alert type={this.state.alertType}>
                            {this.state.alertMessage}
                          </Alert>
                        </center>
                      }

                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Targeting</h2>
              <div className='ui-block' style={{padding: 15}}>
                <div className='news-feed-form'>
                  <p>Select the type of customer you want to send broadcast
                    to</p>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                      <div>
                        <select onChange={this.updateSegmentValue} value={this.state.segmentValue} style={{padding: 10}}>
                          {this.state.target}
                        </select>
                      </div>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                      <button className='btn btn-primary btn-sm'
                        onClick={this.addNewTarget}> {this.state.buttonLabel}
                      </button>
                    </div>

                  </div>

                  <div>
                    {this.state.targeting}

                    {
                    this.state.criteria.Gender.isPicked && <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <p>Gender is: </p>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <select style={{padding: 5}}>
                          <option selected='selected' value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>
                    </div>
                  }

                    {
                    this.state.criteria.Locale.isPicked && <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <p>Locale is: </p>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <select style={{padding: 5}}>
                          <option selected='selected' value='en_US'>en_US</option>
                          <option value='en_UK'>en_UK</option>
                          <option value='en_IN'>en_IN</option>
                        </select>
                      </div>
                    </div>
                  }

                    {
                    this.state.criteria.Page.isPicked && <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <div style={{padding: 5}}>
                          <p>Page is: </p>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                        <select style={{padding: 5}}>
                          <option selected='selected' value='en_US'>en_US</option>
                          <option value='en_UK'>en_UK</option>
                          <option value='en_IN'>en_IN</option>
                        </select>
                      </div>
                    </div>
                  }

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
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus
    },
    dispatch)
}

const styles = {

  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateBroadcast)
