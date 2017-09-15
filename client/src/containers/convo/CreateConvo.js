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
import { addPages, removePage } from '../../redux/actions/pages.actions'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import File from './File'
import Text from './Text'
import Card from './Card'

class CreateConvo extends React.Component {
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
        }
      },
      page: {
        options: [{id: '1', name: 'WoxCut'},
          {id: '2', name: 'KiboPush'},
          {id: '3', name: 'Dayem Portfolio'},
          {id: '4', name: 'United Broke My Guitar'}
        ]
      },
      target: [],
      segmentValue: '',
      buttonLabel: 'Add Segment',
      addPageLabel: 'Add Page',
      selectedPage: '',
      segmentation: {
        page_id: [],
        locale: '',
        gender: ''
      }
    }
    this._onChange = this._onChange.bind(this)
    this.onFileSubmit = this.onFileSubmit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.addNewTarget = this.addNewTarget.bind(this)
    this.updateSegmentValue = this.updateSegmentValue.bind(this)
    this.selectedPage = this.selectedPage.bind(this)
  }

  componentWillMount () {
    // this.props.loadMyPagesList();
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
    // if(nextProps.pages){
    //   var temp = [];
    //   nextProps.pages.map((page) => {
    //     temp.push(page.pageName);
    //   });
    //   var other = this.state.criteria;
    //   other.Page.options = temp;
    //   this.setState({criteria: other});
    // }
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

  selectedPage (event) {
    this.setState({selectedPage: event.target.value})
  }

  addRemovePage () {
    var temp = this.state.segmentation
    if (temp.page_id.indexOf(this.state.selectedPage) > -1) {
      temp.page_id = temp.page_id.filter(e => e !== this.state.selectedPage)
    } else {
      temp.page_id.push(this.state.selectedPage)
    }
    this.setState({segmentation: temp})
  }

  createBroadcast () {
    // console.log("Segmentation Data", this.state.segmentation);

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
      pathname: `/convos`

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
            <div className='col-lg-2 col-md-2 col-sm-2 col-xs-12' />
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
              <h2 className='presentation-margin'>Broadcast</h2>
              <div className='ui-block' style={{minHeight: 250, padding: 75}}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <Text />
                <Image />
                <Video />
                <Audio />
                <File />
                <Card />
              </div>
              <button className='btn btn-primary btn-sm'> Send Conversation </button>
            </div>
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Components</h2>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/text.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Text</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/picture.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Image</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/card.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Card</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/layout.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Gallery</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/speaker.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Audio</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/video.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Video</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' />
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/file.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>File</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' />
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
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      removePage: removePage,
      addPages: addPages
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
