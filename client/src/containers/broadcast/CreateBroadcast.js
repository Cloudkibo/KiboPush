/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
import AlertContainer from 'react-alert'
import { Link } from 'react-router'

class CreateBroadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createBroadcast = this.createBroadcast.bind(this)
    this.state = {
      userfile: null,
      userfilename: ''
    }
    this._onChange = this._onChange.bind(this)
    this.onFileSubmit = this.onFileSubmit.bind(this)
    this.gotoView = this.gotoView.bind(this)
  }

  showAlert (bodyText) {
    this.msg.success(bodyText)
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

  createBroadcast () {
    let msgBody = this.refs.message.value
    if ((msgBody === '' || msgBody === undefined) && (this.state.userfile == '')) {
      this.showAlert('Cannot send empty broadcast')
    } else {
      if (this.state.userfile && this.state.userfile !== '') {
        this.onFileSubmit()
      } else {
        this.props.createbroadcast(
        {platform: 'Facebook', type: 'text', text: this.refs.message.value})
      }
      this.props.history.push({
        pathname: '/broadcasts'
      })
      this.showAlert('Broadcast sent successfully.')
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
    var sendmessage = true
    var fileData = new FormData()
    this.refs.selectFile.value = null
    if (this.state.userfile && this.state.userfile !== '') {
      this.props.updatefileuploadStatus(true)
      var ftype = ''
      if (this.state.userfile.type.split('/')[0] === 'image' || this.state.userfile.type.split('/')[0] === 'audio' || this.state.userfile.type.split('/')[0] === 'video') {
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
      alert('Please choose a file to upload.')
    }
    // this.forceUpdate();
    //     event.preventDefault();
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'light',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
            <h2 className='presentation-margin'>Send a Message to Facebook
              Subscribers</h2>
            <div className='ui-block'>
              <div className='news-feed-form'>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel'
                    aria-expanded='true'>

                    <div
                      className='form-group with-icon label-floating is-empty'>
                      <label className='control-label'>Say something...</label>
                      <textarea className='form-control' ref='message' />
                    </div>
                    <center>
                      <h4> OR </h4>
                    </center>
                    <div className='add-options-message'>
                      <div className='form-group with-icon label-floating is-empty'>
                        <label className='control-label'>Upload Attachment (Audio, Video or Image file)</label>

                        <div style={{display: 'inline-block'}} data-tip='attachments'>
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
                          <input ref='selectFile' type='file' onChange={this._onChange} style={{'display': 'none'}} />

                        </div>
                      </div>

                      <button className='btn btn-primary btn-sm'
                        onClick={this.createBroadcast}> Send Broadcast
                      </button>
                      <Link
                        to='broadcasts'
                        style={{float: 'right', margin: 2}}
                        className='btn btn-sm btn-border-think btn-transparent c-grey' onClick={this.gotoView}>
                        Cancel
                      </Link>
                    </div>

                    {
                        this.state.userfilename && this.state.userfilename !== '' &&
                        <p style={{color: 'red'}}>{this.state.userfilename}</p>

                      }
                    {
                        this.props.showFileUploading && this.props.showFileUploading === true &&
                        <p style={{color: 'red'}}>Uploading file...Please wait</p>

                      }

                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
            <h2 className='presentation-margin'>Targeting</h2>
            <div className='ui-block'>
                <p>Select the type of customer you want to send broadcast to</p>
                  <button className='btn btn-primary btn-sm'> Add Condition </button>
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
    {loadBroadcastsList: loadBroadcastsList, uploadBroadcastfile: uploadBroadcastfile, createbroadcast: createbroadcast, updatefileuploadStatus: updatefileuploadStatus},
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
