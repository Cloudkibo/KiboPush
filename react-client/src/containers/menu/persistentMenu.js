import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { saveCurrentMenuItem, removeMenu, saveMenu, getIndexBypage } from '../../redux/actions/menu.actions'
import { transformData, removeMenuPayload } from './utility'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import { registerAction } from '../../utility/socketio'
import { isWebURL, isWebViewUrl, deleteFiles, deleteFile, getFileIdsOfMenu, deleteInitialFiles, getHostName } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import ViewScreen from './viewScreen'
import { RingLoader } from 'halogenium'
import YouTube from 'react-youtube'
import AlertMessage from '../../components/alertMessages/alertMessage'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      openPopover: false,
      menuItems: [],
      selectPage: '',
      selectedIndex: 'menuPopover',
      disabledWebUrl: true,
      webUrl: '',
      isEditMessage: false,
      loading: false,
      openWebView: false,
      openWebsite: false,
      webviewsize: 'FULL',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      subMenuEnable: false,
      openVideo: false,
      newFiles: [],
      initialFiles: [],
      maxMainmenu : 2,
      errorMsg: '',
      whitelistedDomains: [],
      maxMainMenuItems:2
    }
    this.pageChange = this.pageChange.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.selectIndex = this.selectIndex.bind(this)
    this.addMenu = this.addMenu.bind(this)
    this.removeMenu = this.removeMenu.bind(this)
    this.addSubMenu = this.addSubMenu.bind(this)
    this.removeSubMenu = this.removeSubMenu.bind(this)
    this.addNestedMenu = this.addNestedMenu.bind(this)
    this.removeNestedMenu = this.removeNestedMenu.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.setWebUrl = this.setWebUrl.bind(this)
    this.saveWebUrl = this.saveWebUrl.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.getMenuByIndex = this.getMenuByIndex.bind(this)
    this.changeLabel = this.changeLabel.bind(this)
    this.saveMenu = this.saveMenu.bind(this)
    this.handleSaveMenu = this.handleSaveMenu.bind(this)
    this.validateMenu = this.validateMenu.bind(this)
    this.removeMainMenu = this.removeMainMenu.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleIndexByPage = this.handleIndexByPage.bind(this)
    this.initializeMenuItems = this.initializeMenuItems.bind(this)
    this.validatePostbackPayload = this.validatePostbackPayload.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.handleWebView = this.handleWebView.bind(this)
    this.saveMenuData = this.saveMenuData.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
    this.removePayloadFiles = this.removePayloadFiles.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.messageDisplay = this.messageDisplay.bind(this)
    this.addMenuElement = this.addMenuElement.bind(this)
    if (!this.props.currentMenuItem) {
      if (this.props.pages && this.props.pages.length > 0) {
        this.props.getIndexBypage(this.props.pages[0].pageId, this.handleIndexByPage)
        props.fetchWhiteListedDomains(this.props.pages[0].pageId, this.handleFetch)
      }
    }
  }

  handleFetch(resp) {
    if (resp.status === 'success') {
      this.setState({ whitelistedDomains: resp.payload })
    }
  }

  messageDisplay () {
    if (this.state.maxMainmenu === 2) {
        return 'Only two more main menus can be added.'
    }
    else if(this.state.maxMainmenu === 1) {
      return 'Only one more main menus can be added.'
    }
    else {
      return 'No more main menus can be added.'
    }
  }

  addMenuElement () {
    let element = []
    for (let j = 0; j < this.state.maxMainmenu; j++) {
     element.push(<div className='col-8 menuDiv' style={{marginLeft: '-15px', width: '540px'}}>
          <button className='addMenu'onClick={this.addMenu}>+ Add Menu </button>
          </div>)
    }
    return element
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoMenu.click()
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Menu`;
    var compProp = this.props
    var self = this
    registerAction({
      event: 'menu_updated',
      action: function (data) {
        if (self.state.selectPage === '') {
          compProp.getIndexBypage(compProp.pages[0].pageId, self.handleIndexByPage)
          compProp.fetchWhiteListedDomains(compProp.pages[0].pageId, this.handleFetch)
        } else {
          compProp.getIndexBypage(self.state.selectPage.pageId, self.handleIndexByPage)
          compProp.fetchWhiteListedDomains(self.state.selectPage.pageId, this.handleFetch)
        }
      }
    })

    if (this.props.location.state && this.props.location.state.action === 'replyWithMessage') {
      var index = this.props.currentMenuItem.clickedIndex.split('-')
      var menuReturned = this.props.currentMenuItem.itemMenus
      var menu = this.getMenuHierarchy(this.props.currentMenuItem.clickedIndex)
      switch (menu) {
        case 'item':
          if (menuReturned[index[1]].payload && menuReturned[index[1]].payload.length < 1) {
            menuReturned[index[1]].type = ''
            menuReturned[index[1]].payload = null
          }
          break
        case 'submenu':
          if (menuReturned[index[1]].submenu[index[2]].payload && menuReturned[index[1]].submenu[index[2]].payload.length < 1) {
            menuReturned[index[1]].submenu[index[2]].type = ''
            menuReturned[index[1]].submenu[index[2]].payload = null
          }
          break
        case 'nestedMenu':
          if (menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload && menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload.length < 1) {
            menuReturned[index[1]].submenu[index[2]].submenu[index[3]].type = ''
            menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload = null
          }
          break
        default:
          break
      }

      this.setState({
        initialFiles: this.props.location.state.initialFiles,
        maxMainmenu: this.props.location.state.maxMainmenu,
        newFiles: this.props.currentMenuItem.newFiles,
        menuItems: menuReturned,
        selectedIndex: this.props.currentMenuItem.clickedIndex
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i]._id === this.props.currentMenuItem.currentPage[0]) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
      this.props.saveCurrentMenuItem(null)
    } else {
      if (this.props.pages && this.props.pages.length > 0 && this.state.selectPage === '') {
        this.setState({selectPage: this.props.pages[0]})
      }
    }
  }
  showWebsite () {
    this.setState({openWebsite: true, openWebView: false, webviewurl: '', webviewsize: 'FULL'})
  }
  showWebView () {
    this.setState({openWebView: true, openWebsite: false, webUrl: ''})
  }
  closeWebview () {
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', disabledWebUrl: true})
  }
  closeWebsite () {
    this.setState({openWebsite: false, disabledWebUrl: true, webUrl: ''})
  }
  changeWebviewUrl (e) {
    this.setState({webviewurl: e.target.value})

    let validDomain = false
    for (let i = 0; i < this.state.whitelistedDomains.length; i++) {
      let domain = this.state.whitelistedDomains[i]
      if (getHostName(e.target.value) === getHostName(domain)) {
        validDomain = true
        break
      }
    }

    if (validDomain) {
      this.setState({disabledWebUrl: false, errorMsg: ''})
    } else {
      this.setState({disabledWebUrl: true, errorMsg: 'The given domain is not whitelisted. Please add it to whitelisted domains.' })
    }

  }
  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
    }
  }
  validatePostbackPayload (indexVal) {
    var menuItemReturned = this.getMenuByIndex(indexVal)
    if (menuItemReturned.payload && menuItemReturned.payload.length < 0) {
      var temp = this.state.menuItems
      var index = indexVal.split('-')
      var menu = this.getMenuHierarchy(indexVal)
      switch (menu) {
        case 'item':
          temp[index[1]].type = ''
          temp[index[1]].payload = null
          break
        case 'submenu':
          temp[index[1]].submenu[index[2]].type = ''
          temp[index[1]].submenu[index[2]].payload = null
          break
        case 'nestedMenu':
          temp[index[1]].submenu[index[2]].submenu[index[3]].type = ''
          temp[index[1]].submenu[index[2]].submenu[index[3]].payload = null
          break

        default:
          break
      }
    }
  }
  initializeMenuItems () {
    var tempItemMenus = []
    this.setState({
      menuItems: tempItemMenus
    })
  }

  replyWithMessage (e) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    var menu = this.getMenuHierarchy(this.state.selectedIndex)
    var payload = []
    switch (menu) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (temp[index[1]].payload && temp[index[1]].payload !== '') {
          payload = temp[index[1]].payload
        }
        if (temp[index[1]].url) {
          delete temp[index[1]].url
        }
        temp[index[1]].type = 'postback'
        temp[index[1]].payload = payload
        break
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        if (temp[index[1]].submenu[index[2]].payload && temp[index[1]].submenu[index[2]].payload !== '') {
          payload = temp[index[1]].submenu[index[2]].payload
        }
        if (temp[index[1]].submenu[index[2]].url) {
          delete temp[index[1]].submenu[index[2]].url
        }

        temp[index[1]].submenu[index[2]].type = 'postback'
        temp[index[1]].submenu[index[2]].payload = payload
        break
      case 'nestedMenu':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload && temp[index[1]].submenu[index[2]].submenu[index[3]].payload !== '') {
          payload = temp[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].url) {
          delete temp[index[1]].submenu[index[2]].submenu[index[3]].url
        }

        temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'postback'
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = payload
        break

      default:
        break
    }

    this.setState({menuItems: temp})
    this.editing = true
    var currentState = { itemMenus: this.state.menuItems, clickedIndex: this.state.selectedIndex, currentPage: [this.state.selectPage._id], newFiles: this.state.newFiles }
    this.props.saveCurrentMenuItem(currentState)
    let initialFiles = this.state.initialFiles
    if (this.state.initialFiles && this.state.newFiles) {
      initialFiles = initialFiles.concat(this.state.newFiles)
    }
    this.props.history.push({
      pathname: `/createMessage`,
      state: {realInitialFiles: this.state.initialFiles, initialFiles: initialFiles, newFiles: this.state.newFiles, maxMainmenu: this.state.maxMainmenu}
    })
  }
  handleReset () {
    this.props.getIndexBypage(this.state.selectPage.pageId, this.handleIndexByPage)
    this.props.fetchWhiteListedDomains(this.state.selectPage.pageId, this.handleFetch)
  }
  handleIndexByPage (res) {
    if (res.status === 'success' && res.payload && res.payload.length > 0) {
      if(res.payload[0].jsonStructure[0].type) {
        let maxMainmenu = this.state.maxMainMenuItems - res.payload[0].jsonStructure.length
      let initialFiles = getFileIdsOfMenu(res.payload[0].jsonStructure)
      this.setState({
        initialFiles,
        menuItems: res.payload[0].jsonStructure,
        maxMainmenu:maxMainmenu
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i]._id === res.payload.pageId) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
    } else {
      this.setState({
        initialFiles : [],
        menuItems: [],
        maxMainmenu:2
      })
    }
  } else {
      this.initializeMenuItems()
    }
  }

  removePayloadFiles () {
    for (let i = 0; i < this.state.menuItems.length; i++) {
      let menuItem = this.state.menuItems[i]
      if (menuItem.payload) {
        deleteFiles(JSON.parse(menuItem.payload))
      }
      if (menuItem.submenu) {
        for (let j = 0; j < menuItem.submenu.length; j++) {
          let subItem = menuItem.submenu[j]
          if (subItem.payload) {
            deleteFiles(JSON.parse(subItem.payload))
          }
          if (subItem.submenu) {
            for (let k = 0; k < subItem.submenu.length; k++) {
              let nestedItem = subItem.submenu[k]
              if (nestedItem.payload) {
                deleteFiles(JSON.parse(nestedItem.payload))
              }
            }
          }
        }
      }
    }
  }

  removeMainMenu () {
    this.removePayloadFiles()
    var data = {}
    data.payload = removeMenuPayload()
    data.pageId = this.state.selectPage.pageId
    data.userId = this.props.user._id
    var tempItemMenus = [{
      title: 'Main Menu',
      submenu: []
    }]
    data.jsonStructure = tempItemMenus
    var currentState = null
    this.props.saveCurrentMenuItem(currentState)
    this.setState({newFiles: [], initialFiles: []})
    this.props.removeMenu(data, this.handleReset, this.msg)
  }

  validateMenu () {
    var errorMessage = ''
    var menuItems = this.state.menuItems
    for (var j = 0; j < menuItems.length; j++) {
      if (menuItems[j].title === '') {
        errorMessage = 'Menu title cannot be empty'
        break
      }
      if ((!menuItems[j].type || menuItems[j].type === '') && menuItems[j].submenu.length === 0) {
        errorMessage = `Please select action for your menu '${menuItems[j].title}`
        break
      }
      for (var k = 0; k < menuItems[j].submenu.length; k++) {
        if (menuItems[j].submenu[k].title === '') {
          errorMessage = 'Menu title cannot be empty'
          break
        }
        if ((!menuItems[j].submenu[k].type || menuItems[j].submenu[k].type === '') && menuItems[j].submenu[k].submenu.length === 0) {
          errorMessage = `Please select action for your submenu '${menuItems[j].submenu[k].title}'`
          break
        }
        for (var l = 0; l < menuItems[j].submenu[k].submenu.length; l++) {
          if (menuItems[j].submenu[k].submenu[l].title === '') {
            errorMessage = 'Menu title cannot be empty'
            break
          }
          if (!menuItems[j].submenu[k].submenu[l].type || menuItems[j].submenu[k].submenu[l].type === '') {
            errorMessage = `Please select action for your submenu '${menuItems[j].submenu[k].submenu[l].title}`
            break
          }
        }
      }
    }
    return errorMessage
  }
  changeLabel (e) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    if (index && index.length > 1) {
      var menu = this.getMenuHierarchy(this.state.selectedIndex)
      switch (menu) {
        case 'item':
          temp[index[1]].title = e.target.value
          break
        case 'submenu':
          temp[index[1]].submenu[index[2]].title = e.target.value
          break
        case 'nestedMenu':
          temp[index[1]].submenu[index[2]].submenu[index[3]].title = e.target.value
          break
        default:
          break
      }
    }
    this.setState({
      menuItems: temp
    })
  }
  selectIndex (e, index) {
    this.setState({
      selectedIndex: index,
      openPopover: false
    })
    var menu = this.getMenuByIndex(index)
    if (menu.type === 'web_url') {
      this.setState({
        selectedRadio: 'openWebsite',
        disabledWebUrl: false
      })
      if (menu.messenger_extensions) {
        this.setState({
          webviewurl: menu.url,
          webviewsize: menu.webview_height_ratio,
          openWebView: true,
          openWebsite: false,
          webUrl: '',
          errorMsg: ''
        })
      } else {
        this.setState({
          webUrl: menu.url,
          openWebsite: true,
          webviewurl: '',
          openWebView: false,
          webviewsize: 'FULL'
        })
      }
    } else {
      this.setState({
        webUrl: '',
        openWebsite: false,
        webviewurl: '',
        openWebView: false,
        webviewsize: 'FULL',
        selectedRadio: '',
        disabledWebUrl: false,
        errorMsg: ''
      })
    }
    if (menu.type === 'nested') {
      this.setState({
        selectedRadio: 'openSubMenu'
      })
    } else if (menu.type === 'postback') {
      this.setState({
        selectedRadio: 'replyWithMessage',
        isEditMessage: true
      })
    }
    console.log('Selected Index', this.state.selectedIndex)
  }
  handleRadioChange (e) {
    var menuItems = this.state.menuItems
    this.setState({
      selectedRadio: e.currentTarget.value,
      isEditMessage: false
    })
    var index = this.state.selectedIndex.split('-')
    if (e.currentTarget.value === 'openSubMenu') {
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'item') {
        this.addSubMenu(index[1])
      }
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'submenu') {
        this.addNestedMenu(index[1], index[2])
      }
      this.handleToggle()
    }
    if (e.currentTarget.value === 'openWebsite') {
      this.setState({openWebView: false, openWebsite: false})
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'item') {
        menuItems[index[1]].submenu = []
      }
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'submenu') {
        menuItems[index[1]].submenu[index[2]].submenu = []
      }
    }
    if (e.currentTarget.value === 'replyWithMessage') {
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'item') {
        menuItems[index[1]].submenu = []
        if (menuItems[index[1]].messenger_extensions) {
          delete menuItems[index[1]].messenger_extensions
        }
        if (menuItems[index[1]].webview_height_ratio) {
          delete menuItems[index[1]].webview_height_ratio
        }
      }
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'submenu') {
        menuItems[index[1]].submenu[index[2]].submenu = []
        if (menuItems[index[1]].submenu[index[2]].messenger_extensions) {
          delete menuItems[index[1]].submenu[index[2]].messenger_extensions
        }
        if (menuItems[index[1]].submenu[index[2]].webview_height_ratio) {
          delete menuItems[index[1]].submenu[index[2]].webview_height_ratio
        }
      }
      this.setState({
        menuItems: menuItems
      })
    }
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  pageChange (event) {
    if (event.target.value !== -1) {
      for (let i = 0; i < this.state.newFiles.length; i++) {
        deleteFile(this.state.newFiles[i])
      }
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectPage: page,
          newFiles: []
        })
      }
      var currentState = null
      this.props.saveCurrentMenuItem(currentState)
      this.props.getIndexBypage(page.pageId, this.handleIndexByPage)
      this.props.fetchWhiteListedDomains(page.pageId, this.handleFetch)
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        selectPage: this.props.pages[0]
      })
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  addMenu () {
    var menuItems = this.state.menuItems
    var noOfItems = this.state.maxMainmenu
    noOfItems = noOfItems-1
    var newMenu = {
      title: 'Menu Item',
      submenu: []
    }
    menuItems.push(newMenu)
    this.setState({
      menuItems: this.state.menuItems,
      maxMainmenu : noOfItems
    })
  }
  removeMenu (index) {
    var menuItems = []
    let newFiles = this.state.newFiles
    var noOfItems = this.state.maxMainmenu
    noOfItems = noOfItems+1
    if (this.state.menuItems[index].payload) {
      newFiles = deleteFiles(JSON.parse(this.state.menuItems[index].payload), newFiles, this.state.initialFiles)
    }
    for (let i = 0; i < this.state.menuItems.length; i++) {
      if (index !== i) {
        menuItems.push(this.state.menuItems[i])
      }
    }
    this.setState({
      menuItems: menuItems,
      newFiles: newFiles,
      maxMainmenu : noOfItems
    })
  }
  addSubMenu (index) {
    var menuItems = this.state.menuItems
    var newSubmenu = {
      title: 'Sub Menu',
      submenu: []
    }
    if (menuItems[index].payload) {
      delete menuItems[index].payload
    }
    if (menuItems[index].url) {
      delete menuItems[index].url
    }
    if (menuItems[index].messenger_extensions) {
      delete menuItems[index].messenger_extensions
    }
    if (menuItems[index].webview_height_ratio) {
      delete menuItems[index].webview_height_ratio
    }
    menuItems[index].type = 'nested'
    var submenus = menuItems[index].submenu
    submenus.push(newSubmenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeSubMenu (index, subIndex) {
    var subItems = []
    let newFiles = this.state.newFiles
    if (this.state.menuItems[index].submenu[subIndex].payload) {
      newFiles = deleteFiles(JSON.parse(this.state.menuItems[index].submenu[subIndex].payload), newFiles, this.state.initialFiles)
    }
    for (let i = 0; i < this.state.menuItems[index].submenu.length; i++) {
      if (subIndex !== i) {
        subItems.push(this.state.menuItems[index].submenu[i])
      }
    }

    var menuItems = this.state.menuItems
    menuItems[index].submenu = subItems
    if (subItems.length === 0) {
      menuItems[index].type = ''
    }
    this.setState({
      menuItems: menuItems,
      newFiles
    })
  }
  addNestedMenu (index, subIndex) {
    var menuItems = this.state.menuItems
    var newNestedMenu = {
      title: 'Nested Menu'
    }
    if (menuItems[index].submenu[subIndex].payload) {
      delete menuItems[index].submenu[subIndex].payload
    }
    if (menuItems[index].submenu[subIndex].url) {
      delete menuItems[index].submenu[subIndex].url
    }
    if (menuItems[index].submenu[subIndex].messenger_extensions) {
      delete menuItems[index].submenu[subIndex].messenger_extensions
    }
    if (menuItems[index].webview_height_ratio) {
      delete menuItems[index].submenu[subIndex].webview_height_ratio
    }
    menuItems[index].submenu[subIndex].type = 'nested'
    var nestedMenus = menuItems[index].submenu[subIndex].submenu
    nestedMenus.push(newNestedMenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeNestedMenu (index, subIndex, nestedIndex) {
    var nestedItems = []
    let newFiles = this.state.newFiles
    if (this.state.menuItems[index].submenu[subIndex].submenu[nestedIndex].payload) {
      newFiles = deleteFiles(JSON.parse(this.state.menuItems[index].submenu[subIndex].submenu[nestedIndex].payload), newFiles, this.state.initialFiles)
    }
    for (let i = 0; i < this.state.menuItems[index].submenu[subIndex].submenu.length; i++) {
      if (nestedIndex !== i) {
        nestedItems.push(this.state.menuItems[index].submenu[subIndex].submenu[i])
      }
    }

    var menuItems = this.state.menuItems
    menuItems[index].submenu[subIndex].submenu = nestedItems
    if (nestedItems.length === 0) {
      menuItems[index].submenu[subIndex].type = ''
    }
    this.setState({
      menuItems: menuItems,
      newFiles
    })
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
  getMenuByIndex (indexValue) {
    var menuItems = this.state.menuItems
    var item = ''
    var index = indexValue.split('-')
    if (index && index.length > 1) {
      if (index.length === 2) {
        item = menuItems[index[1]]
      } else if (index.length === 3) {
        item = menuItems[index[1]].submenu[index[2]]
      } else if (index.length === 4) {
        item = menuItems[index[1]].submenu[index[2]].submenu[index[3]]
      } else {
        item = 'invalid'
      }
    }
    return item
  }
  setWebUrl (event) {
    this.setState({
      webUrl: event.target.value,
      openWebView: false,
      webviewurl: ''
    })
    if (event.target.value !== '' && isWebURL(event.target.value)) {
      this.setState({
        disabledWebUrl: false
      })
    } else {
      this.setState({
        disabledWebUrl: true
      })
    }
  }
  saveMenuData (url) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    let newFiles = this.state.newFiles
    if (index && index.length > 1) {
      var menu = this.getMenuHierarchy(this.state.selectedIndex)
      switch (menu) {
        case 'item':
          if (temp[index[1]].payload) {
            newFiles = deleteFiles(JSON.parse(temp[index[1]].payload), newFiles, this.state.initialFiles)
            delete temp[index[1]].payload
          }
          temp[index[1]].type = 'web_url'
          temp[index[1]].url = url
          if (this.state.openWebView && this.state.webviewurl !== '') {
            temp[index[1]].messenger_extensions = true
            temp[index[1]].webview_height_ratio = this.state.webviewsize
          } else {
            delete temp[index[1]].messenger_extensions
            delete temp[index[1]].webview_height_ratio
          }
          break
        case 'submenu':
          if (temp[index[1]].submenu[index[2]].payload) {
            newFiles = deleteFiles(JSON.parse(temp[index[1]].submenu[index[2]].payload), newFiles, this.state.initialFiles)
            delete temp[index[1]].submenu[index[2]].payload
          }
          temp[index[1]].submenu[index[2]].type = 'web_url'
          temp[index[1]].submenu[index[2]].url = url
          if (this.state.openWebView && this.state.webviewurl !== '') {
            temp[index[1]].submenu[index[2]].messenger_extensions = true
            temp[index[1]].submenu[index[2]].webview_height_ratio = this.state.webviewsize
          } else {
            delete temp[index[1]].submenu[index[2]].messenger_extensions
            delete temp[index[1]].submenu[index[2]].webview_height_ratio
          }
          break
        case 'nestedMenu':
          if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload) {
            newFiles = deleteFiles(JSON.parse(temp[index[1]].submenu[index[2]].submenu[index[3]].payload), newFiles, this.state.initialFiles)
            delete temp[index[1]].submenu[index[2]].submenu[index[3]].payload
          }
          temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'web_url'
          temp[index[1]].submenu[index[2]].submenu[index[3]].url = url
          if (this.state.openWebView && this.state.webviewurl !== '') {
            temp[index[1]].submenu[index[2]].submenu[index[3]].messenger_extensions = true
            temp[index[1]].submenu[index[2]].submenu[index[3]].webview_height_ratio = this.state.webviewsize
          } else {
            delete temp[index[1]].submenu[index[2]].submenu[index[3]].messenger_extensions
            delete temp[index[1]].submenu[index[2]].submenu[index[3]].webview_height_ratio
          }
          break
        default:
          break
      }
    }
    this.setState({menuItems: temp, newFiles})

  }
  handleWebView (resp, url) {
    if (resp.status === 'success') {
      if (resp.payload) {
        this.setState({openPopover: false})
        this.saveMenuData(url)
      } else {
        this.msg.error('The given domain is not whitelisted. Please add it to whitelisted domains.')
      }
    } else {
      this.msg.error('Unable to verify whitelisted domains.')
    }
  }
  saveWebUrl (event) {
    let url = ''
    if (this.state.openWebsite && this.state.webUrl !== '') {
      url = this.state.webUrl
      this.saveMenuData(url)
      this.handleToggle()
    } else if (this.state.openWebView && this.state.webviewurl !== '') {
      url = this.state.webviewurl
      if (!isWebViewUrl(this.state.webviewurl)) {
        return this.msg.error('Webview must include a protocol identifier e.g.(https://)')
      }
      else {
        this.props.checkWhitelistedDomains({pageId: this.state.selectPage.pageId, domain: this.state.webviewurl}, this.handleWebView, url)
      }
    }
  }
  saveMenu () {
    if (this.state.menuItems && this.state.menuItems.length > 0) {
      var errorMessage = this.validateMenu()
      if (errorMessage === '') {
        let initialFiles = this.state.initialFiles
        let currentFiles = getFileIdsOfMenu(this.state.menuItems)
        deleteInitialFiles(initialFiles, currentFiles)
        var currentState = { itemMenus: this.state.menuItems, clickedIndex: this.state.selectedIndex, currentPage: this.state.selectPage.pageId, newFiles: [] }
        this.props.saveCurrentMenuItem(currentState)
        var temp = []
        for (var k = 0; k < this.state.menuItems.length; k++) {
          temp.push(this.state.menuItems[k])
        }
        temp.push({url: 'www.kibopush.com', type: 'web_url', submenu: [], title: 'Powered by KiboPush'})
        var data = {}
        if (!this.state.selectPage) {
          this.msg.error('Please select a page')
          return
        }
        data.payload = transformData(temp)
        data.pageId = this.state.selectPage.pageId
        data.userId = this.props.user._id
        data.jsonStructure = this.state.menuItems
        this.setState({
          loading: true,
          newFiles: [],
          initialFiles: currentFiles,
        })
        this.editing = true
        this.props.saveMenu(data, this.handleSaveMenu, this.msg)
      } else {
        this.msg.error(errorMessage)
      }
    }
    else {
      this.msg.error('Please add at least one Main menu')
    }
  }
  handleSaveMenu (res) {
    if (res.status === 'success' && res.payload) {
      this.setState({
        menuItems: res.payload.jsonStructure
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === res.payload.pageId) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
    }
    this.setState({
      loading: false
    })
    var currentState = null
    this.props.saveCurrentMenuItem(currentState)
  }

  componentWillUnmount () {
    if (!this.editing) {
      if (this.state.newFiles) {
        for (let i = 0; i < this.state.newFiles.length; i++) {
          deleteFile(this.state.newFiles[i])
        }
      }
    }
  }

  goToSettings () {
    this.props.history.push({
      pathname: '/settings',
      state: {tab: 'whitelistDomains'}
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        { this.state.loading &&
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0px' }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
          </div>

        }
        <a href='#/' style={{ display: 'none' }} ref='videoMenu' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoMenu">videoMenu</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoMenu" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Menu Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='2I7qnG03zVs'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Persistent Menu Preview
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <ViewScreen data={this.state.menuItems} page={this.state.selectPage.pageName} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='menuPopover' />
        <Popover placement='right-end' isOpen={this.state.openPopover} className='menuPopover' target={this.state.selectedIndex} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit Menu Item</strong></PopoverHeader>
          <PopoverBody>
            <h6>Choose an action for the menu item:</h6>
            <div className='radio-buttons' style={{marginLeft: '37px'}}>
              {
                this.getMenuHierarchy(this.state.selectedIndex) !== 'nestedMenu' && this.state.subMenuEnable &&
                  <div className='radio'>
                    <input id='openSubMenu'
                      type='radio'
                      value='openSubMenu'
                      name='openSubMenu'
                      onChange={this.handleRadioChange}
                      checked={this.state.selectedRadio === 'openSubMenu'} />
                    <label>Open a submenu</label>
                  </div>
              }
              <div className='radio'>
                <input id='replyWithMessage'
                  type='radio'
                  value='replyWithMessage'
                  name='replyWithMessage'
                  onChange={this.handleRadioChange}
                  checked={this.state.selectedRadio === 'replyWithMessage'} />
                <label>Reply with a message</label>
              </div>
              <div className='radio'>
                <input id='openWebsite'
                  type='radio'
                  value='openWebsite'
                  name='openWebsite'
                  onChange={this.handleRadioChange}
                  checked={this.state.selectedRadio === 'openWebsite'} />
                <label>Open website </label>
              </div>
            </div>
            {
              this.state.selectedRadio === 'openWebsite' &&
              <div style={{marginTop: '20px'}}>
                {
                  !this.state.openWebsite && !this.state.openWebView &&
                  <div>
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                    </div>
                    <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebView}>
                      <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                    </div>
                  </div>
                }
                {
                  this.state.openWebsite &&
                  <div className='card'>
                    <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <label className='form-label col-form-label' style={{textAlign: 'left'}}>Website URL to open</label>
                      <input className='form-control' placeholder='Enter URL' style={{marginBottom: '20px'}} value={this.state.webUrl} onChange={this.setWebUrl} type='url' />
                    </div>
                  </div>
                }
                {
                  this.state.openWebView &&
                  <div className='card'>
                    <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer', marginTop: '10px'}} className='la la-close' onClick={this.closeWebview} /></h7>
                    <div style={{padding: '10px'}} className='card-block'>
                      <div>
                        <button onClick={this.goToSettings} style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small', border: 'none', background: 'none'}}>Whitelist url domains to open in-app browser</button>
                      </div>
                      <label className='form-label col-form-label' style={{textAlign: 'left'}}>Url</label>
                      <input type='text' value={this.state.webviewurl} className='form-control' onChange={this.changeWebviewUrl} placeholder='Enter link...' />
                      <div style={{ marginBottom: '30px', color: 'red' }}>{this.state.errorMsg}</div>
                      <label className='form-label col-form-label' style={{textAlign: 'left'}}>WebView Size</label>
                      <select className='form-control m-input' value={this.state.webviewsize} onChange={this.onChangeWebviewSize}>
                        {
                          this.state.webviewsizes && this.state.webviewsizes.length > 0 && this.state.webviewsizes.map((size, i) => (
                            <option key={i} value={size} selected={size === this.state.webviewsize}>{size}</option>
                          ))
                      }
                      </select>
                    </div>
                  </div>
              }
                { (this.state.openWebsite || this.state.openWebView) &&
                <div style={{marginTop: '10px'}}>
                  <button onClick={this.saveWebUrl} className='btn btn-success pull-right' disabled={(this.state.disabledWebUrl)}> Done </button>
                  <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginBottom: '10px'}} onClick={this.handleToggle} className='btn pull-left'> Cancel </button>
                </div>
                }
              </div>
            }
            {
             this.state.selectedRadio === 'replyWithMessage' &&
             <div className='col-12' style={{marginTop: '20px', marginBottom: '10px'}}>
               { this.state.isEditMessage
               ? <button className='btn btn-success m-btn m-btn--icon replyWithMessage' onClick={this.replyWithMessage}>
                  Edit Message
                </button>
                : <button className='btn btn-success m-btn m-btn--icon replyWithMessage' onClick={this.replyWithMessage}>
                   Create Message
                </button>
               }
             </div>
            }
          </PopoverBody>
        </Popover>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Persistent Menu</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0 &&
            <AlertMessage type='page' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Persistent Menu? Here is the <a href='http://kibopush.com/persistent-menu/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div
            className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
            role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Nested menus will no longer be supported by Facebook. Menus will display in a single layer format. <a href='https://developers.facebook.com/docs/messenger-platform/changelog#20190610' target='_blank' rel='noopener noreferrer'>Learn More</a>.
            </div>
          </div>
          <div className='m-portlet m-portlet--full-height '>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption' style={{width: '400px'}}>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>Edit Menu</h3>
                </div>
              </div>
            </div>
            <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
            <div className='m-portlet__body' >
              <div className='row align-items-center'>
                <div className='col-xl-8 order-2 order-xl-1' />
                <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                </div>
              </div>
              <div className='row'>
                <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Select a page</label>
                <div className='col-8 input-group'>
                  <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.pageChange}>
                    {
                      this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                        page.connected &&
                        <option key={page.pageId} value={page.pageId} selected={page.pageId === this.state.selectPage.pageId}>{page.pageName}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className='row' style={{display: 'block', marginTop: '40px', padding: '20px'}}>
                <div className='container'>
                  {
                    this.state.menuItems.map((item, index) => {
                      return (
                        <div key={index}>
                          <div className='col-6 menuDiv m-input-icon m-input-icon--right' >
                            <input id={'item-' + index} onClick={(e) => { this.selectIndex(e, 'item-' + index); this.handleToggle() }} type='text' className='form-control m-input menuInput' onChange={(e) => this.changeLabel(e)} value={item.title} />
                            { this.state.menuItems.length > 1 &&
                              <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeMenu(index)}>
                                <span>
                                  <i className='fa fa-times-circle' />
                                </span>
                              </span>
                            }
                          </div>
                          {item.submenu.map((subItem, subindex) => {
                            return (
                              <div key={subindex}>
                                <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '30px'}}>
                                  <input id={'item-' + index + '-' + subindex} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex); this.handleToggle() }} onChange={(e) => this.changeLabel(e)} type='text' className='form-control m-input menuInput' value={subItem.title} />
                                  <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeSubMenu(index, subindex)}>
                                    <span>
                                      <i className='fa fa-times-circle' />
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  {
                                    subItem.submenu.map((nestedItem, nestedIndex) => {
                                      return (
                                        <div key={nestedIndex} className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '60px'}}>
                                          <input id={'item-' + index + '-' + subindex + '-' + nestedIndex} onChange={(e) => this.changeLabel(e)} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex + '-' + nestedIndex); this.handleToggle() }} type='text' className='form-control m-input menuInput' value={nestedItem.title} />
                                          <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeNestedMenu(index, subindex, nestedIndex)}>
                                            <span>
                                              <i className='fa fa-times-circle' />
                                            </span>
                                          </span>
                                        </div>
                                      )
                                    })
                                  }
                                  { subItem.submenu.length < 5 &&
                                    <div className='col-8 menuDiv' style={{paddingLeft: '60px', width: '482px'}}>
                                      <button className='addMenu'onClick={() => this.addNestedMenu(index, subindex)}>+ Add Nested Menu </button>
                                    </div>
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                          { item.submenu.length < 5 && this.state.subMenuEnable &&
                            <div className='col-8 menuDiv' style={{paddingLeft: '30px', width: '482px'}}>
                              <button className='addMenu'onClick={() => this.addSubMenu(index)}>+ Add Sub Menu </button>
                            </div>
                          }
                        </div>
                      )
                    })
                 }
                  {
                    this.addMenuElement()
                  }
                  <div className='col-8 menuDiv' style={{marginLeft: '-15px', width: '540px'}}>
                    <input type='text' className='form-control m-input menuFix' value='Powered by KiboPush' readOnly />
                  </div>
                  <div className='col-12' style={{paddingTop: '30px', marginLeft: '-15px'}}>
                    <i className='flaticon-exclamation m--font-brand' />
                    <span style={{marginLeft: '5px'}}>
                      {this.messageDisplay()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div style={{paddingTop: '20px', paddingBottom: '20px', marginLeft: '50px'}}>
                <button className='btn btn-sm btn-primary' onClick={this.saveMenu} disabled={this.props.pages && this.props.pages.length < 1}>
                  Save Menu
                </button>
                <button className='btn btn-sm btn-primary' data-toggle="modal" data-target="#preview" style={{marginLeft: '15px'}}>
                  Preview
                </button>
                <button style={{marginLeft: '15px'}} className='btn btn-sm btn-secondary' onClick={this.removeMainMenu}>
                  Remove Main Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    currentMenuItem: (state.menuInfo.currentMenuItem),
    user: (state.basicInfo.user),
    indexByPage: (state.menuInfo.menuitems)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    saveCurrentMenuItem: saveCurrentMenuItem,
    saveMenu: saveMenu,
    getIndexBypage: getIndexBypage,
    removeMenu: removeMenu,
    checkWhitelistedDomains: checkWhitelistedDomains,
    fetchWhiteListedDomains: fetchWhiteListedDomains
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
