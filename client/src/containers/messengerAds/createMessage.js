/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  updateCurrentJsonAd
} from '../../redux/actions/messengerAds.actions'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import List from '../convo/List'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import Media from '../convo/Media'
import { validateFields } from '../convo/utility'
import AlertContainer from 'react-alert'
import { browserHistory } from 'react-router'

class CreateMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      broadcast: [],
      title: this.props.title ? this.props.title : '',
      pageId: props.pages.filter((page) => page.pageId === props.messengerAd.pageId)[0]._id,
      selectedIndex: 1,
      jsonMessages: props.messengerAd.jsonAdMessages ? props.messengerAd.jsonAdMessages : [],
      showOptInMessage: true
    }
    this.handleMedia = this.handleMedia.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.goBack = this.goBack.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.jsonMessageClick = this.jsonMessageClick.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.showPayloadMessage = this.showPayloadMessage.bind(this)
    this.setNewJsonMessage = this.setNewJsonMessage.bind(this)
    this.removePayloadMessages = this.removePayloadMessages.bind(this)
    this.handleSaveMessage = this.handleSaveMessage.bind(this)
  }
  showPayloadMessage (data) {
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].jsonAdMessageId === data.payload) {
        this.setEditComponents(this.state.jsonMessages[i].messageContent)
        /* eslint-disable */
          $('.nav-link m-tabs__link').removeClass('active')
          $('#tab-' + this.state.jsonMessages[i].jsonAdMessageId ).addClass('active')
        /* eslint-enable */
        this.setState({
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
  }
  removePayloadMessages (tempJsonPayloads, jsonMessages) {
    var tempMessages = []
    for (var l = 0; l < jsonMessages.length; l++) {
      let removePayload = false
      for (var m = 0; m < tempJsonPayloads.length; m++) {
        if (tempJsonPayloads[m] === jsonMessages[l].jsonAdMessageId) {
          removePayload = true
        }
      }
      if (!removePayload) {
        tempMessages.push(jsonMessages[l])
      }
    }
    return tempMessages
  }

  setNewJsonMessage (data, jsonMessages) {
    var newMessage = {}
    newMessage.jsonAdMessageId = this.state.jsonMessages.length + 1
    newMessage.jsonAdMessageParentId = this.state.selectedIndex
    newMessage.title = data.title
    newMessage.messageContent = []
    jsonMessages.push(newMessage)
    return jsonMessages
  }
  replyWithMessage (data) {
    console.log('Reply with message', data)
    /* eslint-disable */
      $('.nav-link.m-tabs__link').removeClass('active')
    /* eslint-enable */
    if (data.payload && data.payload !== '') {
      this.showPayloadMessage(data)
    } else {
      var jsonMessages = this.setNewJsonMessage(data, this.state.jsonMessages)
      this.setState({
        jsonMessages: jsonMessages
      })
    }
  }
  jsonMessageClick (jsonAdMessageId) {
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].jsonAdMessageId === jsonAdMessageId) {
        this.setEditComponents(this.state.jsonMessages[i].messageContent)
        this.setState({
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
  }

  setEditComponents (editMessage) {
    var payload = editMessage
    var message = []
    var temp = []
    if (payload.length > 0) {
      for (var i = 0; i < payload.length; i++) {
        if (payload[i].componentType === 'text') {
          temp.push(<Text id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} key={payload[i].id} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload[i].buttons} removeState />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'image') {
          temp.push(<Image id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={payload[i].id} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'audio') {
          temp.push(<Audio id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'video') {
          temp.push(<Video id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'file') {
          temp.push(<File id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={payload[i].id} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'card') {
          temp.push(<Card id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={payload[i].id} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} singleCard />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'gallery') {
          if (payload[i].cards) {
            for (var m = 0; m < payload[i].cards.length; m++) {
              payload[i].cards[m].id = m
            }
          }
          temp.push(<Gallery id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={payload[i].id} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'list') {
          temp.push(<List id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={payload[i].id} list={payload[i]} cards={payload[i].listItems} handleList={this.handleList} onRemove={this.removeComponent} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        } else if (payload[i].componentType === 'media') {
          temp.push(<Media id={payload[i].id} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={payload[i].id} handleMedia={this.handleMedia} onRemove={this.removeComponent} media={payload[i]} />)
          this.setState({list: temp})
          message.push(payload[i])
          this.setState({broadcast: message})
        }
      }
    } else {
      this.setState({
        broadcast: [],
        list: []
      })
    }
  }
  componentDidMount () {
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (!this.state.jsonMessages[i].jsonAdMessageParentId) {
        this.setEditComponents(this.state.jsonMessages[i].messageContent)
        this.setState({
          selectedIndex: this.state.jsonMessages[i].jsonAdMessageId
        })
        break
      }
    }
  }
  goBack () {
    this.props.history.push({
      pathname: `/createAdMessage`
    })
  }
  saveMessage () {
    console.log('Save Call')
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].messageContent.length < 1) {
        return this.msg.error(`Postback message '${this.state.jsonMessages[i].title}' is empty`)
      }
    }
    this.props.updateCurrentJsonAd(this.props.messengerAd, 'jsonAdMessages', this.state.jsonMessages)
    this.msg.success('Message saved successfully')
  }
  handleSaveMessage (resp) {
    console.log(resp)
    this.setState({
      jsonMessages: resp.jsonAdMessages
    })
  }
  handleText (obj) {
    console.log('handleText', obj)
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
        } else {
          delete temp[i].buttons
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
    var jsonMessages = this.state.jsonMessages
    for (var j = 0; j < obj.button.length; j++) {
      if (obj.button[j].type === 'postback' && !obj.button[j].payload) {
        obj.button[j].payload = this.state.jsonMessages.length + 1
        jsonMessages = this.setNewJsonMessage(obj.button[j], jsonMessages)
      }
    }
    if (obj.deletePayload) {
      jsonMessages = this.removePayloadMessages([obj.deletePayload], jsonMessages)
    }
    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  handleCard (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        if (obj.default_action && obj.default_action !== '') {
          temp[i].default_action = obj.default_action
        } else if (temp[i].default_action) {
          delete temp[i].default_action
        }
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages
    for (var j = 0; j < obj.buttons.length; j++) {
      if (obj.buttons[j].type === 'postback' && !obj.buttons[j].payload) {
        obj.buttons[j].payload = this.state.jsonMessages.length + 1
        jsonMessages = this.setNewJsonMessage(obj.buttons[j], jsonMessages)
      }
    }
    if (obj.deletePayload) {
      jsonMessages = this.removePayloadMessages([obj.deletePayload], jsonMessages)
    }
    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  handleMedia (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      if (obj.error === 'file size error') {
        this.msg.error('File size cannot exceed 25MB')
        return
      }
      if (obj.error === 'invalid file') {
        this.msg.error('File is not valid')
        return
      }
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].mediaType = obj.mediaType
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages
    for (var j = 0; j < obj.buttons.length; j++) {
      if (obj.buttons[j].type === 'postback' && !obj.buttons[j].payload) {
        obj.buttons[j].payload = this.state.jsonMessages.length + 1
        jsonMessages = this.setNewJsonMessage(obj.buttons[j], jsonMessages)
      }
    }
    if (obj.deletePayload) {
      jsonMessages = this.removePayloadMessages([obj.deletePayload], jsonMessages)
    }
    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    if (obj.cards) {
      obj.cards.forEach((d) => {
        delete d.id
      })
    }
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages

    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages

    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages

    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }
  handleList (obj) {
    console.log('in create convo handleList', obj)
    var temp = this.state.broadcast
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].listItems = obj.listItems
        temp[i].topElementStyle = obj.topElementStyle
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    console.log('temp', temp)
    this.setState({broadcast: temp})
    var jsonMessages = this.state.jsonMessages
    for (var j = 0; j < obj.buttons.length; j++) {
      if (obj.buttons[j].type === 'postback' && !obj.buttons[j].payload) {
        obj.buttons[j].payload = this.state.jsonMessages.length + 1
        jsonMessages = this.setNewJsonMessage(obj.buttons[j], jsonMessages)
      }
    }
    if (obj.deletePayload) {
      jsonMessages = this.removePayloadMessages([obj.deletePayload], jsonMessages)
    }
    for (var k = 0; k < jsonMessages.length; k++) {
      if (jsonMessages[k].jsonAdMessageId === this.state.selectedIndex) {
        jsonMessages[k].messageContent = temp
      }
    }
    this.setState({
      jsonMessages: jsonMessages
    })
  }

  removeComponent (obj) {
    console.log('obj in removeComponent', obj)
    var temp = this.state.list.filter((component) => { return (component.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    var tempJsonPayloads = []
    this.setState({list: temp, broadcast: temp2})

    var jsonMessages = this.state.jsonMessages
    for (var i = 0; i < this.state.jsonMessages.length; i++) {
      if (this.state.jsonMessages[i].jsonAdMessageId === this.state.selectedIndex) {
        for (var j = 0; j < this.state.jsonMessages[i].messageContent.length; j++) {
          if (this.state.jsonMessages[i].messageContent[j].id === obj.id) {
            if (this.state.jsonMessages[i].messageContent[j].buttons) {
              for (var k = 0; k < this.state.jsonMessages[i].messageContent[j].buttons.length; k++) {
                if (this.state.jsonMessages[i].messageContent[j].buttons[k].type === 'postback') {
                  tempJsonPayloads.push(this.state.jsonMessages[i].messageContent[j].buttons[k].payload)
                }
              }
            }
          }
        }
        jsonMessages[i].messageContent = temp2
      }
    }
    jsonMessages = this.removePayloadMessages(tempJsonPayloads, jsonMessages)
    this.setState({
      jsonMessages: jsonMessages
    })
  }
  render () {
    let timeStamp = new Date().getTime()
    console.log('timeStamp', timeStamp)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>

            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='row' >
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, <Text id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} key={timeStamp} handleText={this.handleText} onRemove={this.removeComponent} removeState />]}); this.handleText({id: timeStamp, text: '', button: []}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: 25}} />
                      <h6>Text</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, <Image id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={timeStamp} handleImage={this.handleImage} onRemove={this.removeComponent} />]}); this.handleImage({id: timeStamp, componentType: 'image', image_url: '', fileurl: ''}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                      <h6>Image</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, <Card id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={timeStamp} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />]}); this.handleCard({id: timeStamp, componentType: 'card', title: '', description: '', fileurl: '', buttons: []}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: 25}} />
                      <h6>Card</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, <Gallery id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={timeStamp} handleGallery={this.handleGallery} onRemove={this.removeComponent} />]}); this.handleGallery({id: timeStamp, componentType: 'gallery', cards: []}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                      <h6>Gallery</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, <Audio id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'audio', fileurl: ''}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                      <h6>Audio</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, <Video id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'video', fileurl: ''}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: 25}} />
                      <h6>Video</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, <File id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pages={[this.state.pageId]} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'file', fileurl: ''}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
                      <h6>File</h6>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New List Component Added'); this.setState({list: [...temp, <List module='messengerAd' replyWithMessage={this.replyWithMessage} id={timeStamp} pageId={this.props.pageId} pages={[this.state.pageId]} key={timeStamp} handleList={this.handleList} onRemove={this.removeComponent} />]}); this.handleList({id: timeStamp, componentType: 'list', listItems: [], topElementStyle: 'compact'}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/list.png' alt='List' style={{maxHeight: 25}} />
                      <h6>List</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-3'>
                  <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Media Component Added'); this.setState({list: [...temp, <Media id={timeStamp} module='messengerAd' replyWithMessage={this.replyWithMessage} pageId={this.props.pageId} pages={[this.state.pageId]} key={timeStamp} handleMedia={this.handleMedia} onRemove={this.removeComponent} />]}); this.handleMedia({id: timeStamp, componentType: 'media', fileurl: '', buttons: []}) }}>
                    <div className='align-center'>
                      <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: 25}} />
                      <h6>Media</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <button style={{float: 'left', marginLeft: 20, marginTop: 20}} id='save' onClick={() => this.saveMessage()} className='btn btn-primary'> Save </button>
                <button onClick={this.goBack} style={{float: 'left', marginLeft: 20, marginTop: '20px'}} className='btn btn-primary'> Back </button>
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='ui-block' style={{marginBottom: '-22px', border: '1px solid rgb(204, 204, 204)', paddingLeft: '10px'}}>
                <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist' style={{float: 'none'}}>
                  { this.state.jsonMessages.map((jsonMessage, index) => (
                    <li className='nav-item m-tabs__item' style={{width: '20%', display: 'flex'}}>
                      <a id={'tab-' + jsonMessage.jsonAdMessageId} className='nav-link m-tabs__link' data-toggle='tab' role='tab' onClick={() => this.jsonMessageClick(jsonMessage.jsonAdMessageId)} style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100px'}}>
                        {jsonMessage.title}
                      </a>
                      { (index < this.state.jsonMessages.length - 1) &&
                      <i className='la la-arrow-right' style={{verticalAlign: 'middle', lineHeight: '43px'}} />
                      }
                    </li>
                  ))
                  }
                </ul>
                <div className='ui-block' style={{height: 90 + 'vh', overflowY: 'scroll', marginTop: '10px', paddingLeft: 75, paddingRight: 75, paddingTop: 30, borderRadius: '0px', border: '1px solid #ccc'}}>
                  {this.state.list}
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
    pages: (state.pagesInfo.pages),
    messengerAd: (state.messengerAdsInfo.messengerAd)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      updateCurrentJsonAd: updateCurrentJsonAd
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
