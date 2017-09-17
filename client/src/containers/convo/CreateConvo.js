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
import DragSortableList from 'react-drag-sortable'

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      list: [],
      broadcast: [],
    }

    this.handleText = this.handleText.bind(this);
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

  gotoView (event) {
    this.props.history.push({
      pathname: `/convos`

    })
  }

  handleText(obj){
    // console.log("Text obj changed of id: " + obj.id + " with text: " + obj.text);
    var temp = this.state.broadcast;
    var isPresent = false;
    temp.map((data) => {
      if(data.id == obj.id){
        data.text = obj.text;
        isPresent = true;
      }
    });

    if(!isPresent){
      temp.push({id: obj.id, text: obj.text});
    }

    this.setState({broadcast: temp});
  }
 

  render () {
    console.log("Payload ", this.state.broadcast);
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
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12' />
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' style={{position: 'fixed', zIndex: 2}}>
              <h2 className='presentation-margin'>Components</h2>
              <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.setState({list: [...temp, {content: (<Text id={temp.length} handleText={this.handleText} />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/text.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Text</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.setState({list: [...temp, {content: (<Image />)}]}) }} style={{minHeight: 75}}>
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

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.setState({list: [...temp, {content: (<Audio />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/speaker.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>Audio</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.setState({list: [...temp, {content: (<Video />)}]}) }} style={{minHeight: 75}}>
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

                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.setState({list: [...temp, {content: (<File />)}]}) }} style={{minHeight: 75}}>
                    <div className='align-center' style={{margin: 5}}>
                      <img src='icons/file.png' alt='Text' style={{maxHeight: 40}} />
                      <h5>File</h5>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-4 col-xs-12' />
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
              <h2 className='presentation-margin'>Broadcast</h2>
              <div className='ui-block' style={{minHeight: 250, padding: 75}}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

              </div>
              <button className='btn btn-primary btn-sm'> Send Conversation </button>
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
