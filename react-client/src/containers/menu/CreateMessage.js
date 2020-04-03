/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { validateFields } from '../convo/utility'
import AlertContainer from 'react-alert'
import { saveCurrentMenuItem } from '../../redux/actions/menu.actions'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import {deleteInitialFiles, getFileIdsOfBroadcast} from '../../utility/utils'

class CreateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview', 'subscribe sequence', 'unsubscribe sequence', 'google sheets', 'set custom field', 'hubspot'],
      broadcast: [],
      convoTitle: 'Message',
      itemMenus: [],
      pageId: this.props.pages.filter((page) => page._id === this.props.currentMenuItem.currentPage[0])[0].pageId
    }
    this.saveMessage = this.saveMessage.bind(this)
    this.setCreateMessage = this.setCreateMessage.bind(this)
    this.getPayloadByIndex = this.getPayloadByIndex.bind(this)
    this.gotoMenu = this.gotoMenu.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  gotoMenu () {
    this.props.history.push({
      pathname: `/menu`,
      state: {action: 'replyWithMessage', initialFiles: this.props.location.state.realInitialFiles}
    })
    // this.props.history.push(`/pollResult/${poll._id}`)
  }
  getPayloadByIndex (index) {
    var payload = []
    var currentMenuItem = this.props.currentMenuItem
    var menu = this.getMenuHierarchy(this.props.currentMenuItem.clickedIndex)
    switch (menu) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (currentMenuItem.itemMenus[index[1]].payload && currentMenuItem.itemMenus[index[1]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].payload
        }
        break
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        if (currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload && currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].submenu[index[2]].payload
        }
        break
      case 'nestedMenu':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload && currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload !== '') {
          payload = currentMenuItem.itemMenus[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        break
      default:
        break
    }
    if (payload.length > 0) {
      return JSON.parse(payload)
    }
    return payload
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Menu`
    if (this.props.currentMenuItem && this.props.currentMenuItem.itemMenus && this.props.currentMenuItem.itemMenus.length > 0) {
      var index = this.props.currentMenuItem.clickedIndex.split('-')
      let pageId = this.props.pages.filter((page) => page._id === this.props.currentMenuItem.currentPage[0])[0].pageId
      this.setState({
        pageId: pageId
      })
      var payload = this.getPayloadByIndex(index)
      if (payload && payload.length > 0) {
        this.setState({broadcast: payload})
      }
    }
    // let options = []
    // this.setState({ page: { options: options } })
  }

  getMenuHierarchy (indexVal) {
    var index = indexVal.split('-')
    var menu = ''
    if (index && index.length > 1) {
      if (index.length === 2) {
        menu = 'item'
      } else if (index.length === 3) {
        menu = 'submenu'
      } else if (index.length === 4) {
        menu = 'nestedMenu'
      } else {
        menu = 'invalid'
      }
    }
    return menu
  }
  setCreateMessage (clickedIndex, payload, saveMessage) {
    var temp = this.props.currentMenuItem.itemMenus
    var index = clickedIndex.split('-')
    var error = false
    var menu = this.getMenuHierarchy(clickedIndex)
    switch (menu) {
      case 'item':
        var temp1 = []
        for (var i = 0; i < payload.length; i++) {
          temp1.push(payload[i])
        }
        // if (saveMessage && JSON.stringify(temp1).length > 1000) {
        //   this.msg.error('Message is too long')
        //   error = true
        //   break
        // }
        temp[index[1]].payload = JSON.stringify(temp1)
        break
      case 'submenu':
        var temp2 = []
        for (var j = 0; j < payload.length; j++) {
          temp2.push(payload[j])
        }
        // if (saveMessage && JSON.stringify(temp2).length > 1000) {
        //   this.msg.error('Message is too long')
        //   error = true
        //   break
        // }
        temp[index[1]].submenu[index[2]].payload = JSON.stringify(temp2)
        break
      case 'nestedMenu':
        var temp3 = []
        for (var k = 0; k < payload.length; k++) {
          temp3.push(payload[k])
        }
        // if (saveMessage && JSON.stringify(temp3).length > 1000) {
        //   this.msg.error('Message is too long')
        //   error = true
        //   break
        // }
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = JSON.stringify(temp3)
        break
      default:
        break
    }
    if (error) {
      temp = ''
    }
    return temp
  }

  saveMessage () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    var saveMessage = true
    var currentState
    var updatedMenuItem = this.setCreateMessage(this.props.currentMenuItem.clickedIndex, this.state.broadcast, saveMessage)
    let newFiles = this.props.location.state.newFiles
    if (newFiles) {
      newFiles = newFiles.concat(this.state.newFiles)
    } else {
      newFiles = this.state.newFiles
    }
    newFiles = deleteInitialFiles(newFiles, getFileIdsOfBroadcast(this.state.broadcast))
    if (updatedMenuItem !== '') {
      currentState = { 
        itemMenus: updatedMenuItem, 
        clickedIndex: this.props.currentMenuItem.clickedIndex, 
        currentPage: this.props.currentMenuItem.currentPage,
        newFiles
      }
      this.props.saveCurrentMenuItem(currentState)
      this.msg.success('Message Saved Successfully')
    } else {
      currentState = { 
        itemMenus: this.props.currentMenuItem.itemMenus, 
        clickedIndex: this.props.currentMenuItem.clickedIndex, 
        currentPage: this.props.currentMenuItem.currentPage, 
        newFiles
      }
      this.props.saveCurrentMenuItem(currentState)
    }
    this.setState({newFiles: []})
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div style={{width: '100%'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content' style={{marginBottom: '-30px'}}>
          <div className='row'>
            <div className='col-12'>
              <div className='pull-right'>
                <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.gotoMenu}>
                Back
              </button>
                <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.saveMessage}>
                Save
              </button>
              </div>
            </div>
          </div>
        </div>
        <GenericMessage
          pageId={this.state.pageId}
          initialFiles={this.props.location.state.initialFiles}
          newFiles={this.state.newFiles}
          pages={this.props.currentMenuItem ? this.props.currentMenuItem.currentPage : null}
          broadcast={this.state.broadcast}
          handleChange={this.handleChange}
          convoTitle={this.state.convoTitle}
          buttonActions={this.state.buttonActions} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentMenuItem: (state.menuInfo.currentMenuItem),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      saveCurrentMenuItem: saveCurrentMenuItem
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
