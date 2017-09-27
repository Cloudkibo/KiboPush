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
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import File from './File'
import Text from './Text'
import Card from './Card'
import Gallery from './Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: []
    }
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.newConvo = this.newConvo.bind(this)
  }

  componentWillMount () {
    // this.props.loadMyPagesList();

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
    if (nextProps.fileInfo) {
      var temp = []
      temp.push(nextProps.fileInfo)
      this.setState({broadcast: temp})
    }
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/convos`

    })
  }

  handleText (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.text = obj.text
        if (obj.button.length > 0) {
          data.buttons = obj.button
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
  }

  handleCard (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.fileName = obj.fileName
        data.fileurl = obj.fileurl
        data.size = obj.size
        data.type = obj.type
        data.title = obj.title
        data.buttons = obj.buttons
        data.description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    // console.log("Image Uploaded", obj)
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  sendConvo () {
    if (this.state.broadcast.length === 0) {
      return
    }
    console.log(this.state.broadcast)
    var data = {
      platform: 'facebook',
      payload: this.state.broadcast[0],
      isSegmented: false
    }

    this.props.sendBroadcast(data, this.msg)
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  render () {
    console.log('Payload ', this.state)

    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='container'>
          <br />
          <br />
          <br />
          <div className='row'>
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12' />
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' style={{position: 'fixed', zIndex: 2}}>
              <h2 className='presentation-margin'>Components</h2>
              <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
                  <button onClick={this.sendConvo} disabled={(this.state.broadcast.length === 0)} className='btn btn-primary btn-sm push-right'> Send Conversation </button>
                </div>
                <div className='col-lg-1 col-md-1 col-sm-1 col-xs-12' />
                <div className='col-lg-5 col-md-5 col-sm-5 col-xs-12' >
                  <button onClick={this.sendConvo} disabled={(this.state.broadcast.length === 0)} className='btn btn-primary btn-sm'> Test Conversation </button>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/text.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Text</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, {content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/picture.png' alt='Image' style={{maxHeight: 40}} />
                      <h5>Image</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/card.png' alt='Card' style={{maxHeight: 40}} />
                      <h5>Card</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={temp.length} key={temp.length} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 40}} />
                      <h5>Gallery</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, {content: (<Audio id={temp.length} key={temp.length} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 40}} />
                      <h5>Audio</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, {content: (<Video id={temp.length} key={temp.length} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/video.png' alt='Video' style={{maxHeight: 40}} />
                      <h5>Video</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' />
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={temp.length} key={temp.length} onRemove={this.removeComponent} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/file.png' alt='File' style={{maxHeight: 40}} />
                      <h5>File</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' />
              </div>
              <div className='row'>
                <button onClick={this.newConvo} className='btn btn-primary btn-sm' style={{width: 100 + '%'}}> New Conversation </button>
              </div>
            </div>
            <div style={{marginLeft: '-100px'}} className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
              <h2 className='presentation-margin'>Conversation</h2>
              <div style={{paddingBottom: 15}}>
                <input type='text' className='hoverbordercomponent' placeholder='Conversation Title' style={{height: 50, textAlign: 'center', backgroundColor: '#EDF2F6'}} />
              </div>
              <div className='ui-block' style={{minHeight: 250, padding: 75}}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

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
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo)
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
      addPages: addPages,
      sendBroadcast: sendBroadcast
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
